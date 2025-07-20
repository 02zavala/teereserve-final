"use client"

import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Users, Calendar, MapPin, Tag, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BookingDetails {
  date: Date
  timeSlot: {
    id: string
    startTime: string
    endTime: string
    availableSlots: number
  }
  golfCourse: {
    id: string
    name: string
    location: string
    pricePerRound: number
  }
}

interface BookingPaymentProps {
  bookingDetails: BookingDetails
  onBookingComplete: (booking: any) => void
  onCancel: () => void
}

const PaymentForm = ({ bookingDetails, onBookingComplete, onCancel }: BookingPaymentProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [numberOfPlayers, setNumberOfPlayers] = useState(1)
  const [discountCode, setDiscountCode] = useState('')
  const [affiliateCode, setAffiliateCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState<any>(null)
  const [affiliateApplied, setAffiliateApplied] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState('')
  const [error, setError] = useState('')

  const basePrice = bookingDetails.golfCourse.pricePerRound * numberOfPlayers
  const finalPrice = discountApplied 
    ? discountApplied.discountType === 'percentage'
      ? basePrice * (1 - discountApplied.value)
      : Math.max(0, basePrice - discountApplied.value)
    : basePrice

  // Create payment intent when component mounts or price changes
  useEffect(() => {
    createPaymentIntent()
  }, [finalPrice])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalPrice,
          metadata: {
            golfCourseId: bookingDetails.golfCourse.id,
            numberOfPlayers: numberOfPlayers.toString(),
            bookingDate: format(bookingDetails.date, 'yyyy-MM-dd'),
            teeTime: bookingDetails.timeSlot.startTime
          }
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setClientSecret(data.clientSecret)
      } else {
        setError('Error al crear la intención de pago')
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      setError('Error al procesar el pago')
    }
  }

  const applyAffiliateCode = async () => {
    if (!affiliateCode.trim()) return

    try {
      const response = await fetch(`/api/affiliates/${affiliateCode}`)
      
      if (response.ok) {
        const data = await response.json()
        setAffiliateApplied(data.affiliate)
        setError('')
      } else {
        setError('Código de afiliado inválido')
      }
    } catch (error) {
      console.error('Error applying affiliate code:', error)
      setError('Error al aplicar el código de afiliado')
    }
  }

  const applyDiscountCode = async () => {
    if (!discountCode.trim()) return

    try {
      const response = await fetch(`/api/discount-codes/${discountCode}`)
      
      if (response.ok) {
        const data = await response.json()
        const discount = data.discountCode
        
        // Validate discount
        if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
          setError('El código de descuento ha expirado')
          return
        }
        
        if (discount.maxUses && discount.currentUses >= discount.maxUses) {
          setError('El código de descuento ha alcanzado su límite de uso')
          return
        }
        
        if (discount.minBookingValue && basePrice < discount.minBookingValue) {
          setError(`El monto mínimo para este descuento es $${discount.minBookingValue}`)
          return
        }
        
        setDiscountApplied(discount)
        setError('')
      } else {
        setError('Código de descuento inválido')
      }
    } catch (error) {
      console.error('Error applying discount:', error)
      setError('Error al aplicar el descuento')
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements || !clientSecret) {
      return
    }

    setLoading(true)
    setError('')

    const cardElement = elements.getElement(CardElement)
    
    if (!cardElement) {
      setError('Error al procesar la tarjeta')
      setLoading(false)
      return
    }

    // Confirm payment
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    })

    if (stripeError) {
      setError(stripeError.message || 'Error al procesar el pago')
      setLoading(false)
      return
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Confirm booking
      try {
        const response = await fetch('/api/stripe/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            golfCourseId: bookingDetails.golfCourse.id,
            bookingDate: format(bookingDetails.date, 'yyyy-MM-dd'),
            teeTime: bookingDetails.timeSlot.startTime,
            numberOfPlayers,
            discountCode: discountApplied?.code,
            affiliateCode: affiliateApplied?.referralCode
          }),
        })

        if (response.ok) {
          const data = await response.json()
          onBookingComplete(data.booking)
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Error al confirmar la reserva')
        }
      } catch (error) {
        console.error('Error confirming booking:', error)
        setError('Error al confirmar la reserva')
      }
    }

    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resumen de Reserva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <p className="font-medium">{bookingDetails.golfCourse.name}</p>
              <p className="text-sm text-gray-600">{bookingDetails.golfCourse.location}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fecha:</span>
              <span className="font-medium">
                {format(bookingDetails.date, 'EEEE, d MMMM yyyy', { locale: es })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Hora:</span>
              <span className="font-medium">
                {bookingDetails.timeSlot.startTime} - {bookingDetails.timeSlot.endTime}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="numberOfPlayers">Número de Jugadores</Label>
            <select
              id="numberOfPlayers"
              value={numberOfPlayers}
              onChange={(e) => setNumberOfPlayers(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md mt-1"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} jugador{num > 1 ? 'es' : ''}</option>
              ))}
            </select>
          </div>

          <Separator />

          {/* Affiliate Code */}
          <div>
            <Label htmlFor="affiliateCode">Código de Afiliado (Opcional)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="affiliateCode"
                value={affiliateCode}
                onChange={(e) => setAffiliateCode(e.target.value)}
                placeholder="Ej: TEE123"
              />
              <Button 
                onClick={applyAffiliateCode}
                variant="outline"
                size="sm"
              >
                <Tag className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
            </div>
            {affiliateApplied && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-blue-700 bg-blue-100">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Afiliado: {affiliateApplied.user.name}
                </Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Discount Code */}
          <div>
            <Label htmlFor="discountCode">Código de Descuento (Opcional)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="discountCode"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Ingresa tu código"
              />
              <Button 
                onClick={applyDiscountCode}
                variant="outline"
                size="sm"
              >
                <Tag className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
            </div>
            {discountApplied && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Descuento aplicado: {discountApplied.code}
                </Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Precio por jugador:
              </span>
              <span>${bookingDetails.golfCourse.pricePerRound.toLocaleString()} MXN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                Subtotal ({numberOfPlayers} jugador{numberOfPlayers > 1 ? 'es' : ''}):
              </span>
              <span>${basePrice.toLocaleString()} MXN</span>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-green-600">
                <span className="text-sm">
                  Descuento ({discountApplied.code}):
                </span>
                <span>
                  -{discountApplied.discountType === 'percentage' 
                    ? `${(discountApplied.value * 100).toFixed(0)}%`
                    : `$${discountApplied.value.toLocaleString()} MXN`
                  }
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${finalPrice.toLocaleString()} MXN</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Información de Pago
          </CardTitle>
          <CardDescription>
            Completa tu reserva con un pago seguro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Información de la Tarjeta</Label>
              <div className="mt-2 p-3 border rounded-md">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!stripe || loading}
                className="flex-1"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Procesando...
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pagar ${finalPrice.toLocaleString()} MXN
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BookingPayment(props: BookingPaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  )
}

