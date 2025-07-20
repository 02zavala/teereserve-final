'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MapPin, Star, ArrowLeft, Phone, Mail, Globe, Calendar, Clock, Users, Cloud, Sun, CloudRain, Thermometer } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import StripePayment from '@/components/stripe-payment'
import WeatherWidget from '@/components/WeatherWidget'
import ReviewsSection from '@/components/ReviewsSection'

interface GolfCourse {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  website: string
  priceWeekday: number
  priceWeekend: number
  holes: number
  par: number
  length: number
  latitude: number
  longitude: number
  image: string
  images: string[]
  rating: number
  reviewCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

interface BookingData {
  date: string
  time: string
  players: number
  comments: string
  totalAmount: number
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [course, setCourse] = useState<GolfCourse | null>(null)
  const [loading, setLoading] = useState(true)
  const [courseId, setCourseId] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState(2)
  const [comments, setComments] = useState('')
  const [isBooking, setIsBooking] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setCourseId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (courseId) {
      fetchCourse()
      fetchWeather()
    }
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data)
      } else {
        // Mock data for development - return correct data based on courseId
        const mockCourses = {
          "1": {
            id: "1",
            name: "Cabo Real Golf Club",
            description: "Spectacular oceanfront golf course designed by Robert Trent Jones Jr. Stunning views of the Sea of Cortez with challenging desert landscape.",
            address: "Carretera Transpeninsular Km 19.5",
            city: "Los Cabos",
            state: "Baja California Sur",
            phone: "+52 624 173 9400",
            email: "info@caborealgolf.com",
            website: "https://caborealgolf.com",
            priceWeekday: 140,
            priceWeekend: 175,
            holes: 18,
            par: 71,
            length: 6945,
            latitude: 23.0545,
            longitude: -109.7123,
            image: "/images/courses/cabo-real-1.jpg",
            images: [
              "/images/courses/cabo-real-1.jpg",
              "/images/courses/cabo-real-2.jpg",
              "/images/courses/cabo-real-3.jpg",
              "/images/courses/cabo-real-4.jpg"
            ],
            rating: 4.8,
            reviewCount: 245,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          "4": {
            id: "4",
            name: "Cabo del Sol Golf Club",
            description: "Two championship courses designed by Tom Weiskopf and Jack Nicklaus in a stunning desert setting. Ocean Course and Desert Course offer unique challenges.",
            address: "Carretera Transpeninsular Km 10.3",
            city: "Los Cabos",
            state: "Baja California Sur",
            phone: "+52 624 145 8200",
            email: "info@cabodelsol.com",
            website: "https://cabodelsol.com",
            priceWeekday: 165,
            priceWeekend: 190,
            holes: 36,
            par: 72,
            length: 7100,
            latitude: 23.0234,
            longitude: -109.7456,
            image: "/images/courses/cabo-del-sol-1.jpg",
            images: [
              "/images/courses/cabo-del-sol-1.jpg",
              "/images/courses/cabo-del-sol-2.jpg",
              "/images/courses/cabo-del-sol-3.jpg",
              "/images/courses/cabo-del-sol-4.jpg"
            ],
            rating: 4.9,
            reviewCount: 198,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          "5": {
            id: "5",
            name: "Solmar Golf Links",
            description: "Spectacular clifftop golf course with dramatic ocean views. Designed by Greg Norman, this course offers challenging play with stunning Pacific vistas.",
            address: "Av. Solmar 1",
            city: "Cabo San Lucas",
            state: "Baja California Sur",
            phone: "+52 624 145 7800",
            email: "golf@solmar.com",
            website: "https://solmargolflinks.com",
            priceWeekday: 155,
            priceWeekend: 180,
            holes: 18,
            par: 72,
            length: 6851,
            latitude: 22.8905,
            longitude: -109.9167,
            image: "/images/courses/solmar-1.jpg",
            images: [
              "/images/courses/solmar-1.jpg",
              "/images/courses/solmar-2.jpg",
              "/images/courses/solmar-3.jpg",
              "/images/courses/solmar-4.jpg"
            ],
            rating: 4.7,
            reviewCount: 167,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
        
        const courseData = mockCourses[courseId as keyof typeof mockCourses]
        if (courseData) {
          setCourse(courseData)
        } else {
          // Fallback to Cabo Real if ID not found
          setCourse(mockCourses["1"])
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeather = async () => {
    // Mock weather data for development
    setWeather({
      temperature: 28,
      condition: "Soleado",
      humidity: 65,
      windSpeed: 12,
      icon: "sunny"
    })
  }

  const availableTimes = [
    "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ]

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !course) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    // Open payment modal instead of processing directly
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (result: any) => {
    setShowPaymentModal(false)
    
    // Redirect to confirmation page with booking details
    const bookingId = result.bookingId || 'booking_123456'
    const folio = result.folio || 'TRG-2025-001234'
    
    router.push(`/booking-confirmation?id=${bookingId}&folio=${folio}`)
  }

  const handlePaymentError = (error: string) => {
    alert(`Error en el pago: ${error}`)
  }

  const calculateTotal = () => {
    if (!course) return 0
    const isWeekend = selectedDate ? new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6 : false
    const pricePerPerson = isWeekend ? course.priceWeekend : course.priceWeekday
    return pricePerPerson * selectedPlayers
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'soleado':
        return <Sun className="w-6 h-6 text-yellow-500" />
      case 'nublado':
        return <Cloud className="w-6 h-6 text-gray-500" />
      case 'lluvia':
        return <CloudRain className="w-6 h-6 text-blue-500" />
      default:
        return <Sun className="w-6 h-6 text-yellow-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-golf-green-600 mx-auto mb-4"></div>
          <p className="text-golf-green-600 font-montserrat">Cargando información del campo...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-golf-green-800 mb-4">Campo no encontrado</h1>
          <Link href="/courses">
            <Button className="bg-golf-green-600 hover:bg-golf-green-700 text-white">
              ← Volver a Campos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/courses" className="flex items-center text-golf-green-600 hover:text-golf-green-700 font-montserrat transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Campos
            </Link>
            <div className="flex items-center space-x-3">
              <Badge className="bg-golf-gold-100 text-golf-gold-800 border-golf-gold-200">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {course.rating}
              </Badge>
              <Badge variant="outline" className="border-golf-green-200 text-golf-green-700 dark:border-golf-green-600 dark:text-golf-green-400">
                {course.holes} hoyos
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <h1 className="text-4xl font-bold text-golf-green-800 dark:text-golf-green-400 font-playfair mb-3">
                {course.name}
              </h1>
              <div className="flex items-center text-golf-green-600 dark:text-golf-green-400 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="font-montserrat">{course.city}, {course.state}</span>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-montserrat leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={course.images[selectedImageIndex] || course.image}
                  alt={course.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {course.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-golf-green-500 ring-offset-2' 
                        : 'hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${course.name} - Vista ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Course Details */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-golf-green-800 dark:text-golf-green-400 mb-4 font-playfair">
                  Detalles del Campo
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-golf-green-600 dark:text-golf-green-400">
                      {course.holes}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Hoyos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-golf-green-600 dark:text-golf-green-400">
                      {course.par}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Par</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-golf-green-600 dark:text-golf-green-400">
                      {course.length.toLocaleString()}m
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Longitud</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-golf-green-600 dark:text-golf-green-400">
                      {course.reviewCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Reseñas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-golf-green-800 dark:text-golf-green-400 mb-4 font-playfair">
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Dirección</h4>
                    <p className="text-gray-600 dark:text-gray-400">{course.address}</p>
                    <p className="text-gray-600 dark:text-gray-400">{course.city}, {course.state}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Contacto</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{course.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{course.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Globe className="w-4 h-4 mr-2" />
                        <a href={course.website} target="_blank" rel="noopener noreferrer" className="hover:text-golf-green-600">
                          {course.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <WeatherWidget 
              latitude={course.latitude} 
              longitude={course.longitude}
              location={`${course.city}, ${course.state}`}
            />

            {/* Booking Form */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-golf-green-800 dark:text-golf-green-400 mb-4">
                  Reservar Tee Time
                </h3>
                
                {/* Pricing */}
                <div className="mb-6 p-4 bg-golf-green-50 dark:bg-golf-green-900/20 rounded-lg">
                  <div className="text-sm text-golf-green-600 dark:text-golf-green-400 mb-1">Precios desde</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Lunes - Viernes</div>
                      <div className="font-bold text-golf-green-800 dark:text-golf-green-400">${course.priceWeekday}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Fines de semana</div>
                      <div className="font-bold text-golf-green-800 dark:text-golf-green-400">${course.priceWeekend}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Horario
                    </label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar horario" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Players Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Número de Jugadores
                    </label>
                    <Select value={selectedPlayers.toString()} onValueChange={(value) => setSelectedPlayers(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'jugador' : 'jugadores'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comentarios (opcional)
                    </label>
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Solicitudes especiales, preferencias de horario, etc."
                      rows={3}
                    />
                  </div>

                  {/* Total */}
                  {selectedDate && selectedTime && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Total:</span>
                        <span className="text-xl font-bold text-golf-green-600 dark:text-golf-green-400">
                          ${calculateTotal()} USD
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {selectedPlayers} {selectedPlayers === 1 ? 'jugador' : 'jugadores'} × ${
                          selectedDate ? (new Date(selectedDate).getDay() === 0 || new Date(selectedDate).getDay() === 6 
                            ? course.priceWeekend 
                            : course.priceWeekday) 
                          : course.priceWeekday
                        }
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  <Button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime || isBooking}
                    className="w-full bg-golf-green-600 hover:bg-golf-green-700 text-white py-3 font-semibold"
                  >
                    {isBooking ? 'Procesando...' : 'Reservar Ahora'}
                  </Button>

                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Recibirás confirmación por email, PDF y WhatsApp
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewsSection 
            courseId={course.id}
            courseName={course.name}
            averageRating={course.rating}
            totalReviews={course.reviewCount}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-lg max-h-[95vh] overflow-hidden p-0 m-2 sm:m-6">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-golf-green-800">Completar Reserva</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
            <StripePayment
              amount={calculateTotal()}
              bookingData={{
                courseId: course.id,
                courseName: course.name,
                date: selectedDate,
                time: selectedTime,
                players: selectedPlayers,
                comments: comments,
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

