'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react'

interface StripePaymentProps {
  amount: number
  bookingData: {
    courseId: string
    courseName: string
    date: string
    time: string
    players: number
    comments: string
  }
  onSuccess: (result: any) => void
  onError: (error: string) => void
}

export default function StripePayment({ amount, bookingData, onSuccess, onError }: StripePaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success' | 'error'>('form')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    cardNumber: '4242424242424242', // Test card number
    expiryDate: '12/25',
    cvc: '123',
  })

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      onError('Por favor completa todos los campos requeridos')
      return
    }

    setIsProcessing(true)
    setPaymentStep('processing')

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Create booking with payment
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          totalAmount: amount,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
        })
      })

      if (response.ok) {
        const result = await response.json()
        setPaymentStep('success')
        
        // Show success message for 2 seconds then call onSuccess
        setTimeout(() => {
          onSuccess({
            bookingId: 'booking_123456',
            folio: 'TRG-2025-001234',
            ...result
          })
        }, 2000)
      } else {
        const errorData = await response.json()
        setPaymentStep('error')
        onError(errorData.error || 'Error al procesar el pago')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStep('error')
      onError('Error de conexión. Por favor intenta nuevamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (paymentStep === 'processing') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-golf-green-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Procesando Pago</h3>
          <p className="text-gray-600">Por favor espera mientras procesamos tu reserva...</p>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-golf-green-500 rounded-full mr-2"></div>
              Validando información de pago
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-golf-green-500 rounded-full mr-2"></div>
              Confirmando disponibilidad
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
              Enviando confirmaciones
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStep === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Pago Exitoso!</h3>
          <p className="text-gray-600 mb-4">Tu reserva ha sido confirmada</p>
          <div className="space-y-2 text-sm text-green-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Email de confirmación enviado
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              PDF generado
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              WhatsApp enviado
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStep === 'error') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error en el Pago</h3>
          <p className="text-gray-600 mb-4">Hubo un problema al procesar tu reserva</p>
          <Button 
            onClick={() => setPaymentStep('form')}
            className="bg-golf-green-600 hover:bg-golf-green-700 text-white"
          >
            Intentar Nuevamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-golf-green-800 text-lg">
          <CreditCard className="w-5 h-5 mr-2" />
          Información de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {/* Booking Summary */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Resumen de Reserva</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Campo:</span>
              <span>{bookingData.courseName}</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha:</span>
              <span>{new Date(bookingData.date).toLocaleDateString('es-ES')}</span>
            </div>
            <div className="flex justify-between">
              <span>Hora:</span>
              <span>{bookingData.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Jugadores:</span>
              <span>{bookingData.players}</span>
            </div>
            <div className="flex justify-between font-semibold text-golf-green-600 border-t pt-2 mt-2">
              <span>Total:</span>
              <span>${amount} USD</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-2">
          <div>
            <Label htmlFor="name" className="text-sm">Nombre Completo *</Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Tu nombre completo"
              className="h-10"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              className="h-10"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-sm">Teléfono *</Label>
            <Input
              id="phone"
              value={customerInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+52 555 123 4567"
              className="h-10"
            />
          </div>
        </div>

        {/* Test Card Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Información de Tarjeta</Label>
            <div className="flex items-center text-xs text-gray-500">
              <Lock className="w-3 h-3 mr-1" />
              Modo Test
            </div>
          </div>
          
          <div>
            <Label htmlFor="cardNumber" className="text-sm">Número de Tarjeta</Label>
            <Input
              id="cardNumber"
              value={customerInfo.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              placeholder="4242 4242 4242 4242"
              disabled
              className="h-10"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="expiryDate" className="text-sm">Fecha de Vencimiento</Label>
              <Input
                id="expiryDate"
                value={customerInfo.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                placeholder="MM/YY"
                disabled
                className="h-10"
              />
            </div>
            <div>
              <Label htmlFor="cvc" className="text-sm">CVC</Label>
              <Input
                id="cvc"
                value={customerInfo.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value)}
                placeholder="123"
                disabled
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* Test Mode Notice */}
        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
            <div className="text-xs text-blue-700">
              <strong>Modo de Prueba:</strong> Esta es una transacción de prueba. 
              No se realizará ningún cargo real. Los datos de la tarjeta son de prueba de Stripe.
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="sticky bottom-0 bg-white pt-2 pb-2 -mx-4 px-4 border-t">
          <Button
            onClick={handlePayment}
            disabled={isProcessing || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
            className="w-full bg-golf-green-600 hover:bg-golf-green-700 text-white py-3 font-semibold h-12 text-base"
          >
            {isProcessing ? 'Procesando...' : `Pagar $${amount} USD`}
          </Button>

          <div className="text-xs text-gray-500 text-center mt-2">
            Al confirmar el pago, recibirás confirmación por email, PDF y WhatsApp
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

