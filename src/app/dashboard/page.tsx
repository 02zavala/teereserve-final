'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Users, Calendar, DollarSign, 
  MapPin, Clock, Star, Activity, AlertCircle, CheckCircle,
  Download, Filter, RefreshCw, Eye
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Mock data for dashboard
const mockData = {
  overview: {
    totalBookings: 1247,
    totalRevenue: 187350,
    activeUsers: 892,
    averageRating: 4.7,
    bookingsGrowth: 12.5,
    revenueGrowth: 8.3,
    usersGrowth: 15.2,
    ratingGrowth: 2.1
  },
  monthlyRevenue: [
    { month: 'Ene', revenue: 12500, bookings: 89 },
    { month: 'Feb', revenue: 15200, bookings: 108 },
    { month: 'Mar', revenue: 18900, bookings: 134 },
    { month: 'Abr', revenue: 22100, bookings: 157 },
    { month: 'May', revenue: 25800, bookings: 183 },
    { month: 'Jun', revenue: 28400, bookings: 201 },
    { month: 'Jul', revenue: 31200, bookings: 221 }
  ],
  topCourses: [
    { name: 'Cabo Real Golf Club', bookings: 234, revenue: 32890, rating: 4.8 },
    { name: 'Cabo del Sol Golf Club', bookings: 198, revenue: 27650, rating: 4.7 },
    { name: 'Solmar Golf Links', bookings: 167, revenue: 23420, rating: 4.6 },
    { name: 'Palmilla Golf Club', bookings: 145, revenue: 20300, rating: 4.5 },
    { name: 'Querencia Golf Club', bookings: 123, revenue: 17250, rating: 4.7 }
  ],
  bookingsByHour: [
    { hour: '06:00', bookings: 12 },
    { hour: '07:00', bookings: 28 },
    { hour: '08:00', bookings: 45 },
    { hour: '09:00', bookings: 67 },
    { hour: '10:00', bookings: 89 },
    { hour: '11:00', bookings: 76 },
    { hour: '12:00', bookings: 54 },
    { hour: '13:00', bookings: 43 },
    { hour: '14:00', bookings: 58 },
    { hour: '15:00', bookings: 71 },
    { hour: '16:00', bookings: 62 },
    { hour: '17:00', bookings: 38 }
  ],
  recentBookings: [
    {
      id: 'TRG-2025-001234',
      customer: 'Oscar Gómez',
      course: 'Cabo Real Golf Club',
      date: '2025-07-15',
      time: '09:00',
      players: 4,
      amount: 560,
      status: 'confirmed'
    },
    {
      id: 'TRG-2025-001235',
      customer: 'María López',
      course: 'Cabo del Sol Golf Club',
      date: '2025-07-15',
      time: '10:30',
      players: 2,
      amount: 280,
      status: 'confirmed'
    },
    {
      id: 'TRG-2025-001236',
      customer: 'Carlos Ruiz',
      course: 'Solmar Golf Links',
      date: '2025-07-16',
      time: '08:00',
      players: 3,
      amount: 420,
      status: 'pending'
    },
    {
      id: 'TRG-2025-001237',
      customer: 'Ana García',
      course: 'Palmilla Golf Club',
      date: '2025-07-16',
      time: '14:00',
      players: 2,
      amount: 320,
      status: 'confirmed'
    },
    {
      id: 'TRG-2025-001238',
      customer: 'Luis Martínez',
      course: 'Querencia Golf Club',
      date: '2025-07-17',
      time: '07:30',
      players: 4,
      amount: 640,
      status: 'cancelled'
    }
  ]
}

const COLORS = ['#059669', '#0891b2', '#7c3aed', '#dc2626', '#ea580c']

export default function DashboardPage() {
  const { t } = useLanguage()
  const [data, setData] = useState(mockData)
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  const refreshData = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-3 h-3" />
      case 'pending': return <Clock className="w-3 h-3" />
      case 'cancelled': return <AlertCircle className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-beige-50 to-golf-beige-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-golf-green-800 dark:text-golf-green-400 font-playfair">
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-montserrat">
              Gestión y analytics de TeeReserve Golf
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={refreshData}
              disabled={loading}
              variant="outline"
              className="border-golf-green-600 text-golf-green-600 hover:bg-golf-green-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            
            <Button className="bg-golf-green-600 hover:bg-golf-green-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Reservas
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.overview.totalBookings.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-golf-green-100 rounded-full">
                  <Calendar className="w-6 h-6 text-golf-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{data.overview.bookingsGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ingresos Totales
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(data.overview.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-golf-gold-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-golf-gold-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{data.overview.revenueGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Usuarios Activos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.overview.activeUsers.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{data.overview.usersGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Calificación Promedio
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {data.overview.averageRating}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{data.overview.ratingGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue">Ingresos</TabsTrigger>
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
            <TabsTrigger value="courses">Campos</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-golf-green-800 dark:text-golf-green-400">
                    Ingresos Mensuales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#059669" 
                        fill="#059669" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-golf-green-800 dark:text-golf-green-400">
                    Distribución de Ingresos por Campo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.topCourses}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {data.topCourses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-golf-green-800 dark:text-golf-green-400">
                    Reservas por Mes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-golf-green-800 dark:text-golf-green-400">
                    Reservas por Horario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.bookingsByHour}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#059669" 
                        strokeWidth={2}
                        dot={{ fill: '#059669' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-golf-green-800 dark:text-golf-green-400">
                  Campos Más Populares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topCourses.map((course, index) => (
                    <div key={course.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-golf-green-100 rounded-full">
                          <span className="text-sm font-bold text-golf-green-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {course.name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{course.bookings} reservas</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              {course.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-golf-green-600">
                          {formatCurrency(course.revenue)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(course.revenue / course.bookings)} promedio
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-golf-green-800 dark:text-golf-green-400">
                  Reservas Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-golf-green-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-golf-green-600" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {booking.customer}
                            </h4>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">{booking.status}</span>
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.course} • {booking.date} • {booking.time} • {booking.players} jugadores
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {booking.id}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-golf-green-600">
                          {formatCurrency(booking.amount)}
                        </div>
                        <Button variant="ghost" size="sm" className="mt-1">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}

