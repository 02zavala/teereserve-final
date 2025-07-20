"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Users, Phone, Globe, Calendar } from 'lucide-react'
import AdvancedFilters from '@/components/AdvancedFilters'
import { useLanguage } from '@/contexts/LanguageContext'

interface GolfCourse {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  phone: string
  website: string
  priceWeekday: number
  priceWeekend: number
  holes: number
  par: number
  length: number
  image: string
  images: string[]
  rating: number
  reviewCount: number
  isActive: boolean
}

async function getCourses(): Promise<GolfCourse[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/courses`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching courses:', error)
    // Return mock data as fallback
    return [
      {
        id: "1",
        name: "Cabo Real Golf Club",
        description: "Spectacular oceanfront golf course designed by Robert Trent Jones Jr. Stunning views of the Sea of Cortez with challenging desert landscape.",
        address: "Carretera Transpeninsular Km 19.5",
        city: "Los Cabos",
        state: "Baja California Sur",
        phone: "+52 624 173 9400",
        website: "https://caborealgolf.com",
            priceWeekday: 140,
            priceWeekend: 160,
        holes: 18,
        par: 71,
        length: 6945,
        image: "/images/courses/cabo-real-1.jpg",
        images: [],
        rating: 4.8,
        reviewCount: 245,
        isActive: true
      },
      {
        id: "2",
        name: "Palmilla Golf Club",
        description: "Jack Nicklaus Signature Design featuring 27 holes of world-class golf with breathtaking ocean and mountain views.",
        address: "Carretera Transpeninsular Km 27.5",
        city: "San José del Cabo",
        state: "Baja California Sur",
        phone: "+52 624 146 7250",
        website: "https://palmillagolf.com",
            priceWeekday: 175,
            priceWeekend: 200,
        holes: 27,
        par: 72,
        length: 7100,
        image: "/images/courses/palmilla-1.jpg",
        images: [],
        rating: 4.9,
        reviewCount: 189,
        isActive: true
      },
      {
        id: "3",
            name: "Paraíso del Mar Golf Club",
            description: "An 18-hole, links-style championship golf course designed by Arthur Hills, located on the El Mogote Peninsula in La Paz.",
            address: "KM 220, Carreterra Federal Mexico 1, La Paz, B.C.S",
            city: "La Paz",
            state: "Baja California Sur",
            phone: "+52 612 140 1391",
            website: "https://paraisodelmar.com/",
            priceWeekday: 160,
            priceWeekend: 170,
            holes: 18,
            par: 72,
            length: 7039,
            image: "/images/courses/paraiso-del-mar-1.jpg",
            images: [],
            rating: 4.7,
            reviewCount: 312,
            isActive: true
      }
    ]
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<GolfCourse[]>([])
  const [filteredCourses, setFilteredCourses] = useState<GolfCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
        setFilteredCourses(data)
      } else {
        // Use mock data as fallback
        const mockData = [
          {
            id: "4",
            name: "Cabo del Sol",
            description: "Two championship courses designed by Tom Weiskopf and Jack Nicklaus in a stunning desert setting.",
            address: "Carretera Transpeninsular Km 10.3",
            city: "Los Cabos",
            state: "Baja California Sur",
            phone: "+52 624 145 8200",
            website: "https://cabodelsol.com",
            priceWeekday: 190,
            priceWeekend: 220,
            holes: 36,
            par: 72,
            length: 7100,
            image: "/images/courses/cabo-del-sol-1.jpg",
            images: [],
            rating: 4.6,
            reviewCount: 198,
            isActive: true
          },
          {
            id: "1",
            name: "Cabo Real Golf Club",
            description: "Spectacular oceanfront golf course designed by Robert Trent Jones Jr. Stunning views of the Sea of Cortez with challenging desert landscape.",
            address: "Carretera Transpeninsular Km 19.5",
            city: "Los Cabos",
            state: "Baja California Sur",
            phone: "+52 624 173 9400",
            website: "https://caborealgolf.com",
            priceWeekday: 140,
            priceWeekend: 160,
            holes: 18,
            par: 71,
            length: 6945,
            image: "/images/courses/cabo-real-1.jpg",
            images: [],
            rating: 4.8,
            reviewCount: 245,
            isActive: true
          },
          {
            id: "2",
            name: "Palmilla Golf Club",
            description: "Jack Nicklaus Signature Design featuring 27 holes of world-class golf with breathtaking ocean and mountain views.",
            address: "Carretera Transpeninsular Km 27.5",
            city: "San José del Cabo",
            state: "Baja California Sur",
            phone: "+52 624 146 7250",
            website: "https://palmillagolf.com",
            priceWeekday: 175,
            priceWeekend: 200,
            holes: 27,
            par: 72,
            length: 7100,
            image: "/images/courses/palmilla-1.jpg",
            images: [],
            rating: 4.9,
            reviewCount: 189,
            isActive: true
          },
          {
            id: "3",
            name: "Paraíso del Mar Golf Club",
            description: "An 18-hole, links-style championship golf course designed by Arthur Hills, located on the El Mogote Peninsula in La Paz.",
            address: "KM 220, Carreterra Federal Mexico 1, La Paz, B.C.S",
            city: "La Paz",
            state: "Baja California Sur",
            phone: "+52 612 140 1391",
            website: "https://paraisodelmar.com/",
            priceWeekday: 160,
            priceWeekend: 170,
            holes: 18,
            par: 72,
            length: 7039,
            image: "/images/courses/paraiso-del-mar-1.jpg",
            images: [],
            rating: 4.7,
            reviewCount: 312,
            isActive: true
          },
          {
            id: "4",
            name: "Cabo del Sol",
            description: "Two championship courses designed by Tom Weiskopf and Jack Nicklaus in a stunning desert setting.",
            address: "Carretera Transpeninsular Km 10.3",
            city: "Los Cabos",
            state: "Baja California Sur",
            phone: "+52 624 145 8200",
            website: "https://cabodelsol.com",
            priceWeekday: 190,
            priceWeekend: 220,
            holes: 36,
            par: 72,
            length: 7100,
            image: "/images/courses/cabo-del-sol-1.jpg",
            images: [],
            rating: 4.6,
            reviewCount: 198,
            isActive: true
          },
          {
            id: "5",
            name: "Solmar Golf Links",
            description: "Challenging links-style course with dramatic Pacific Ocean views and desert landscape.",
            address: "Av. Solmar 1",
            city: "Cabo San Lucas",
            state: "Baja California Sur",
            phone: "+52 624 143 2884",
            website: "https://solmargolf.com",
            priceWeekday: 145,
            priceWeekend: 165,
            holes: 18,
            par: 71,
            length: 6900,
            image: "/images/courses/solmar-1.jpg",
            images: [],
            rating: 4.5,
            reviewCount: 156,
            isActive: true
          },
          {
            id: "6",
            name: "El Camaleón Golf Club",
            description: "Greg Norman designed course in the Riviera Maya, home to the PGA Tour's Mayakoba Golf Classic.",
            address: "Carretera Federal Cancún-Playa del Carmen Km 298",
            city: "Playa del Carmen",
            state: "Quintana Roo",
            phone: "+52 984 206 3088",
            website: "https://elcamaleongolf.com",
            priceWeekday: 175,
            priceWeekend: 195,
            holes: 18,
            par: 72,
            length: 7039,
            image: "/images/courses/el-camaleon-1.jpg",
            images: [],
            rating: 4.9,
            reviewCount: 287,
            isActive: true
          },
          {
            id: "7",
            name: "Puerto Los Cabos Golf Club",
            description: "A 27-hole golf resort in San Jose del Cabo, featuring three 9-hole championship courses designed by Jack Nicklaus and Greg Norman.",
            address: "Blvd. Mar de Cortez S/N, Colonia La Playita",
            city: "San Jose del Cabo",
            state: "Baja California Sur",
            phone: "+52 624 105 6441",
            website: "https://puertoloscabos.com/golf/",
            priceWeekday: 195,
            priceWeekend: 225,
            holes: 27,
            par: 72,
            length: 7461,
            image: "/images/courses/puerto-los-cabos-1.jpg",
            images: [],
            rating: 4.5,
            reviewCount: 134,
            isActive: true
          },
          {
            id: "8",
            name: "Club Campestre San José",
            description: "An 18-hole championship golf course designed by Jack Nicklaus, nestled in the rolling foothills of the Sierra de la Laguna Mountains in San José del Cabo",
            address: "Libramiento Aeropuerto Km. 119, Campo de Golf Fonatur",
            city: "San José del Cabo",
            state: "Baja California Sur",
            phone: "+52 624 173 9400",
            website: "https://www.questrogolf.com/golf/club-campestre",
            priceWeekday: 175,
            priceWeekend: 195,
            holes: 18,
            par: 71,
            length: 7055,
            image: "/images/courses/campestre-san-jose-1.jpg",
            images: [],
            rating: 4.3,
            reviewCount: 89,
            isActive: true
          },
          {
            id: "9",
            name: "Vidanta Golf Los Cabos",
            description: "Norman-designed course with stunning views of the Sea of Cortez and desert landscape.",
            address: "Blvd. Paseo de los Cabos s/n",
            city: "San José del Cabo",
            state: "Baja California Sur",
            phone: "+52 624 163 4000",
            website: "https://vidantagolf.com",
            priceWeekday: 165,
            priceWeekend: 185,
            holes: 18,
            par: 72,
            length: 7156,
            image: "/images/courses/vidanta-1.jpg",
            images: [],
            rating: 4.7,
            reviewCount: 203,
            isActive: true
          },
          {
            id: "10",
            name: "TPC Danzante Bay",
            description: "A Rees Jones-designed 18-hole championship golf course at Villa del Palmar Beach Resort & Spa in Loreto, Mexico, named the Best Golf Course in Mexico (2024).",
            address: "Carretera Transpeninsular Km 84, Ensenada Blanca",
            city: "Loreto",
            state: "Baja California Sur",
            phone: "+526131341025",
            website: "https://tpcdanzantebay.com",
            priceWeekday: 225,
            priceWeekend: 245,
            holes: 18,
            par: 72,
            length: 7237,
            image: "/images/courses/TPC-danzante-bay-1.jpg",
            images: [],
            rating: 4.8,
            reviewCount: 167,
            isActive: true
          },
          {
            id: "11",
            name: "Cabo San Lucas Country Club",
            description: "A Roy Dye-designed 18-hole championship golf course in the heart of Cabo San Lucas.",
            address: "Via de Carlos Lote 601 S/N, Km 3.7 Carretera Transpeninsular",
            city: "Cabo San Lucas",
            state: "Baja California Sur",
            phone: "+52 624 143 4653",
            website: "https://cabocountry.com",
            priceWeekday: 168,
            priceWeekend: 185,
            holes: 18,
            par: 72,
            length: 7220,
            image: "/images/courses/Cabo-country-club-1.jpg",
            images: [],
            rating: 4.4,
            reviewCount: 112,
            isActive: true
          },
          {
            id: "12",
            name: "Costa Palmas Golf Club",
            description: "A Robert Trent Jones II-designed championship golf course on the East Cape of Los Cabos.",
            address: "Avenida Hacienda Eureka, La Ribera",
            city: "Los Cabos",
            state: "Baja California Sur",
            phone: "+52 624 689 0292",
            website: "https://costapalmas.com/experiences/golf-club/",
            priceWeekday: 375,
            priceWeekend: 375,
            holes: 18,
            par: 72,
            length: 7221,
            image: "/images/courses/Costa-palmas-1.jpg",
            images: [],
            rating: 4.6,
            reviewCount: 178,
            isActive: true
          }
        ]
        setCourses(mockData)
        setFilteredCourses(mockData)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (filters: any) => {
    let filtered = [...courses]

    // Filter by search text
    if (filters.searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        course.city.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        course.state.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    // Filter by location
    if (filters.location && filters.location !== 'all') {
      const locationMap: { [key: string]: string[] } = {
        'los-cabos': ['Los Cabos', 'Cabo San Lucas', 'San José del Cabo'],
        'cancun': ['Cancún'],
        'puerto-vallarta': ['Puerto Vallarta'],
        'playa-del-carmen': ['Playa del Carmen'],
        'mazatlan': ['Mazatlán']
      }
      
      const cities = locationMap[filters.location] || []
      if (cities.length > 0) {
        filtered = filtered.filter(course =>
          cities.some(city => course.city.includes(city))
        )
      }
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(course =>
        course.priceWeekday >= filters.priceRange[0] &&
        course.priceWeekday <= filters.priceRange[1]
      )
    }

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter(course => course.rating >= filters.rating)
    }

    // Filter by holes
    if (filters.holes && filters.holes.length > 0) {
      filtered = filtered.filter(course => 
        filters.holes.includes(course.holes.toString())
      )
    }

    // Filter by features (mock implementation)
    if (filters.features && filters.features.length > 0) {
      // En una implementación real, los campos tendrían un array de características
      // Por ahora, filtramos basado en el nombre y descripción
      filtered = filtered.filter(course => {
        const courseText = `${course.name} ${course.description}`.toLowerCase()
        return filters.features.some((feature: string) => {
          switch (feature) {
            case 'ocean-view':
              return courseText.includes('ocean') || courseText.includes('sea') || courseText.includes('pacific')
            case 'desert':
              return courseText.includes('desert') || courseText.includes('desierto')
            case 'championship':
              return courseText.includes('championship') || courseText.includes('signature')
            case 'resort':
              return courseText.includes('resort')
            default:
              return false
          }
        })
      })
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.priceWeekday - b.priceWeekday)
        break
      case 'price-high':
        filtered.sort((a, b) => b.priceWeekday - a.priceWeekday)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'newest':
        // En una implementación real, ordenaríamos por fecha de creación
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id))
        break
      default:
        // 'relevance' - mantener orden original
        break
    }

    setFilteredCourses(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-golf-beige-50 to-golf-beige-100 flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/logo.svg"
            alt="TeeReserve Golf"
            width={64}
            height={64}
            className="mx-auto mb-4 animate-pulse"
          />
          <p className="text-golf-green-600">Cargando campos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golf-beige-50 to-golf-beige-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-golf-beige-300 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-16 h-16">
              <Image
                src="/icon.svg"
                alt="TeeReserve Golf"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-golf-green-600 font-playfair">TeeReserve</h1>
              <p className="text-sm text-golf-gold-600 font-semibold font-dm-serif">Golf</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-golf-green-700 hover:text-golf-gold-600 transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/courses" className="text-golf-gold-600 font-semibold">
              Campos
            </Link>
            <Link href="/auth/signin" className="text-golf-green-700 hover:text-golf-gold-600 transition-colors font-medium">
              Iniciar Sesión
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-golf-green-600 hover:bg-golf-green-700 text-white font-semibold px-6">
                Registrarse
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-golf-green-400 via-golf-green-500 to-golf-green-600">
        {/* Tornasol overlay más verde */}
        <div className="absolute inset-0 bg-gradient-to-tr from-golf-green-600/85 via-golf-green-500/70 to-golf-green-700/90"></div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/golf-pattern.svg"
            alt=""
            fill
            className="object-repeat"
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h1 className="title-hero text-white mb-6 leading-tight">
            Campos de Golf
            <br />
            <span className="text-golf-beige-100 drop-shadow-lg">Exclusivos</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-4xl mx-auto leading-relaxed font-medium font-montserrat">
            Descubre los campos más icónicos de México y vive la experiencia de golf premium
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-white/90">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
              🏌️ {courses.length} Campos Premium
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
              ⭐ Rating 4.8+ Promedio
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
              📍 Ubicaciones Exclusivas
            </Badge>
          </div>
        </div>
      </section>

      {/* Advanced Filters Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <AdvancedFilters onFiltersChange={handleFiltersChange} />
        </div>
      </section>

      {/* Results Counter */}
      <section className="px-4">
        <div className="container mx-auto">
          <p className="text-golf-green-700 text-lg mb-8">
            {filteredCourses.length === courses.length
              ? `Mostrando todos los ${courses.length} campos`
              : `${filteredCourses.length} de ${courses.length} campos encontrados`}
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏌️‍♂️</div>
              <h3 className="text-2xl font-bold text-golf-green-600 mb-2">
                No se encontraron campos
              </h3>
              <p className="text-golf-green-700 mb-6">
                Intenta ajustar tus filtros de búsqueda para encontrar más opciones
              </p>
              <Button
                onClick={() => handleFiltersChange({})}
                className="bg-golf-green-600 hover:bg-golf-green-700 text-white"
              >
                Ver Todos los Campos
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-golf-beige-300 bg-white group">
                <div className="relative h-64">
                  <Image
                    src={course.image}
                    alt={course.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-golf-gold-600 text-white px-3 py-1 rounded-full shadow-lg">
                    <span className="text-sm font-bold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {course.rating}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-golf-green-600 text-white">
                      {course.holes} hoyos
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-golf-green-600 text-xl font-bold group-hover:text-golf-gold-600 transition-colors font-playfair">
                    {course.name}
                  </CardTitle>
                  <CardDescription className="text-golf-green-700 font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {course.city}, {course.state}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-golf-green-700 text-sm leading-relaxed line-clamp-3 font-montserrat">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-golf-green-600">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Par {course.par}
                      </span>
                      <span>{course.length}m</span>
                    </div>
                    <span className="text-xs">{course.reviewCount} reseñas</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-golf-beige-200">
                    <div>
                      <div className="text-golf-green-700 text-sm">Desde</div>
                      <div className="text-2xl font-bold text-golf-gold-600">
                        ${course.priceWeekday.toLocaleString()}
                      </div>
                      <div className="text-xs text-golf-green-600">USD por persona</div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link href={`/courses/${course.id}`}>
                        <Button className="bg-golf-green-600 hover:bg-golf-green-700 text-white font-semibold px-6 btn-premium">
                          Ver Detalles
                        </Button>
                      </Link>
                      <Link href={`/courses/${course.id}/book`}>
                        <Button variant="outline" className="border-golf-gold-600 text-golf-gold-700 hover:bg-golf-gold-50 font-semibold px-6 btn-premium">
                          <Calendar className="w-4 h-4 mr-1" />
                          Reservar
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-golf-beige-200 text-sm">
                    {course.phone && (
                      <a
                        href={`tel:${course.phone}`}
                        className="flex items-center text-golf-green-600 hover:text-golf-gold-600 transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Llamar
                      </a>
                    )}
                    {course.website && (
                      <a
                        href={course.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-golf-green-600 hover:text-golf-gold-600 transition-colors"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        Sitio Web
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-golf-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/golf-pattern.svg"
            alt=""
            fill
            className="object-repeat"
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <h3 className="text-4xl font-bold mb-6">¿No encuentras tu campo ideal?</h3>
          <p className="text-xl text-golf-beige-200 mb-8 max-w-2xl mx-auto">
            Contáctanos y te ayudaremos a encontrar el campo perfecto para tu próxima ronda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-golf-gold-600 hover:bg-golf-gold-700 text-white px-8 py-4">
                Contactar Soporte
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-golf-gold-600 hover:bg-golf-gold-700 text-white border-2 border-golf-gold-500 px-8 py-4 font-bold shadow-lg">
                Registrarse Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-golf-beige-100 border-t border-golf-beige-300 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Image
              src="/icon.svg"
              alt="TeeReserve Golf"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="font-bold text-golf-green-600 text-lg">TeeReserve Golf</span>
          </div>
          <p className="text-golf-green-700 mb-4">
            La plataforma líder de reservas de golf en México
          </p>
          <div className="flex justify-center space-x-6 text-sm text-golf-green-600">
            <Link href="/" className="hover:text-golf-gold-600">Inicio</Link>
            <Link href="/courses" className="hover:text-golf-gold-600">Campos</Link>
            <Link href="/auth/signin" className="hover:text-golf-gold-600">Iniciar Sesión</Link>
            <Link href="/contact" className="hover:text-golf-gold-600">Contacto</Link>
          </div>
          <div className="mt-6 pt-6 border-t border-golf-beige-400">
            <p className="text-golf-green-700 font-medium">&copy; 2025 TeeReserve Golf. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
