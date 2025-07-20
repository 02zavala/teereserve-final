"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import BookingCalendar from '@/components/booking-calendar'
import BookingPayment from '@/components/booking-payment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowLeft, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface GolfCourse {
  id: string
  name: string
  location: string
  pricePerRound: number
}

interface BookingDetails {
  date: Date
  timeSlot: {
    id: string
    startTime: string
    endTime: string
    availableSlots: number
  }
  golfCourse: GolfCourse
}

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedGolfCourse, setSelectedGolfCourse] = useState<GolfCourse | null>(null)
  const [golfCourses, setGolfCourses] = useState<GolfCourse[]>([])
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [completedBooking, setCompletedBooking] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<'select-course' | 'calendar' | 'payment' | 'confirmation'>('select-course')

  // Redirect if not authenticated or not a client
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    if (session.user.role !== 'Client') {
      router.push('/denied')
      return
    }
  }, [session, status, router])

  // Fetch golf courses
  useEffect(() => {
    fetchGolfCourses()
  }, [])

  const fetchGolfCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setGolfCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Error fetching golf courses:', error)
    }
  }

  const handleGolfCourseSelect = (course: GolfCourse) => {
    setSelectedGolfCourse(course)
    setCurrentStep('calendar')
  }

  const handleBookingSelect = (booking: BookingDetails) => {
    setBookingDetails(booking)
    setCurrentStep('payment')
  }

  const handleBookingComplete = (booking: any) => {
    setCompletedBooking(booking)
    setCurrentStep('confirmation')
  }

  const handleStartOver = () => {
    setSelectedGolfCourse(null)
    setBookingDetails(null)
    setCompletedBooking(null)
    setCurrentStep('select-course')
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {currentStep !== 'select-course' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentStep === 'calendar') setCurrentStep('select-course')
                else if (currentStep === 'payment') setCurrentStep('calendar')
                else if (currentStep === 'confirmation') setCurrentStep('select-course')
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">Reservar Campo de Golf</h1>
            <p className="text-gray-600">
              {currentStep === 'select-course' && 'Selecciona un campo de golf'}
              {currentStep === 'calendar' && 'Elige fecha y hora'}
              {currentStep === 'payment' && 'Completa tu reserva'}
              {currentStep === 'confirmation' && 'Reserva confirmada'}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`flex items-center gap-2 ${
            currentStep === 'select-course' ? 'text-green-600' : 
            ['calendar', 'payment', 'confirmation'].includes(currentStep) ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              ['calendar', 'payment', 'confirmation'].includes(currentStep) ? 'bg-green-600 text-white' : 
              currentStep === 'select-course' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Campo</span>
          </div>
          
          <div className={`w-8 h-0.5 ${
            ['calendar', 'payment', 'confirmation'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-200'
          }`}></div>
          
          <div className={`flex items-center gap-2 ${
            currentStep === 'calendar' ? 'text-green-600' : 
            ['payment', 'confirmation'].includes(currentStep) ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              ['payment', 'confirmation'].includes(currentStep) ? 'bg-green-600 text-white' : 
              currentStep === 'calendar' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Fecha</span>
          </div>
          
          <div className={`w-8 h-0.5 ${
            ['payment', 'confirmation'].includes(currentStep) ? 'bg-green-600' : 'bg-gray-200'
          }`}></div>
          
          <div className={`flex items-center gap-2 ${
            currentStep === 'payment' ? 'text-green-600' : 
            currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'confirmation' ? 'bg-green-600 text-white' : 
              currentStep === 'payment' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              3
            </div>
            <span className="text-sm font-medium">Pago</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {currentStep === 'select-course' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {golfCourses.map((course) => (
            <Card 
              key={course.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleGolfCourseSelect(course)}
            >
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ${course.pricePerRound.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-600">MXN por ronda</span>
                </div>
                <Button className="w-full mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Seleccionar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentStep === 'calendar' && selectedGolfCourse && (
        <BookingCalendar
          golfCourse={selectedGolfCourse}
          onBookingSelect={handleBookingSelect}
        />
      )}

      {currentStep === 'payment' && bookingDetails && (
        <BookingPayment
          bookingDetails={bookingDetails}
          onBookingComplete={handleBookingComplete}
          onCancel={() => setCurrentStep('calendar')}
        />
      )}

      {currentStep === 'confirmation' && completedBooking && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">¡Reserva Confirmada!</CardTitle>
            <CardDescription>
              Tu reserva ha sido procesada exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium">Detalles de la Reserva</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Campo:</span>
                  <p className="font-medium">{completedBooking.golfCourse.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Fecha:</span>
                  <p className="font-medium">
                    {format(new Date(completedBooking.bookingDate), 'EEEE, d MMMM yyyy', { locale: es })}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Hora:</span>
                  <p className="font-medium">
                    {format(new Date(completedBooking.teeTime), 'HH:mm')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Jugadores:</span>
                  <p className="font-medium">{completedBooking.numberOfPlayers}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total Pagado:</span>
                  <p className="font-medium text-green-600">
                    ${completedBooking.totalPrice.toLocaleString()} MXN
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <p className="font-medium text-green-600">Confirmada</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleStartOver} className="flex-1">
                Hacer Nueva Reserva
              </Button>
              <Button variant="outline" onClick={() => router.push('/user/bookings')}>
                Ver Mis Reservas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

