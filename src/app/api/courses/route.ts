import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const courses = await prisma.golfCourse.findMany({
      where: {
        isActive: true
      },
      include: {
        golfCourseImages: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    })

    // Si hay cursos en la base de datos, devolverlos con las imágenes de la galería
    if (courses.length > 0) {
      const coursesWithImages = courses.map(course => ({
        ...course,
        images: course.golfCourseImages.map(img => img.imageUrl)
      }))
      return NextResponse.json(coursesWithImages)
    }

    // Fallback con datos mock y las nuevas imágenes locales
    const mockCourses = [
      {
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
        priceWeekend: 160,
        holes: 18,
        par: 71,
        length: 6945,
        latitude: 23.0545,
        longitude: -109.7164,
        image: "/images/golf-courses/cabo-real-1.jpg",
        images: [
          "/images/golf-courses/cabo-real-1.jpg",
          "/images/golf-courses/cabo-real-2.jpg",
          "/images/golf-courses/cabo-real-3.jpg",
          "/images/golf-courses/cabo-real-4.jpg"
        ],
        rating: 4.8,
        reviewCount: 245,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Palmilla Golf Club",
        description: "Jack Nicklaus Signature Design featuring 27 holes of world-class golf with breathtaking ocean and mountain views.",
        address: "Carretera Transpeninsular Km 27.5",
        city: "San José del Cabo",
        state: "Baja California Sur",
        phone: "+52 624 146 7250",
        email: "info@palmillagolf.com",
        website: "https://palmillagolf.com",
        priceWeekday: 175,
        priceWeekend: 200,
        holes: 27,
        par: 72,
        length: 7100,
        latitude: 23.0545,
        longitude: -109.7164,
        image: "/images/golf-courses/palmilla-1.jpg",
        images: [
          "/images/golf-courses/palmilla-1.jpg",
          "/images/golf-courses/palmilla-2.jpg",
          "/images/golf-courses/palmilla-3.jpg",
          "/images/golf-courses/palmilla-4.jpg"
        ],
        rating: 4.9,
        reviewCount: 189,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Quivira Golf Club",
        description: "Clifftop masterpiece by Jack Nicklaus with dramatic ocean views and world-renowned golf architecture.",
        address: "Copala s/n",
        city: "Cabo San Lucas",
        state: "Baja California Sur",
        phone: "+52 624 104 3400",
        email: "info@quiviragolf.com",
        website: "https://quiviragolf.com",
        priceWeekday: 210,
        priceWeekend: 240,
        holes: 18,
        par: 72,
        length: 7085,
        latitude: 22.8905,
        longitude: -109.9167,
        image: "/images/golf-courses/quivira-1.jpg",
        images: [
          "/images/golf-courses/quivira-1.jpg",
          "/images/golf-courses/quivira-2.jpg",
          "/images/golf-courses/quivira-3.jpg",
          "/images/golf-courses/quivira-4.jpg"
        ],
        rating: 4.7,
        reviewCount: 312,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "4",
        name: "Cabo del Sol",
        description: "Two championship courses designed by Tom Weiskopf and Jack Nicklaus in a stunning desert setting.",
        address: "Carretera Transpeninsular Km 10.3",
        city: "Los Cabos",
        state: "Baja California Sur",
        phone: "+52 624 145 8200",
        email: "info@cabodelsol.com",
        website: "https://cabodelsol.com",
        priceWeekday: 190,
        priceWeekend: 220,
        holes: 36,
        par: 72,
        length: 7100,
        latitude: 23.0545,
        longitude: -109.7164,
        image: "/images/golf-courses/cabo-del-sol-1.jpg",
        images: [
          "/images/golf-courses/cabo-del-sol-1.jpg",
          "/images/golf-courses/cabo-del-sol-2.jpg",
          "/images/golf-courses/cabo-del-sol-3.jpg",
          "/images/golf-courses/cabo-del-sol-4.jpg"
        ],
        rating: 4.6,
        reviewCount: 198,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "5",
        name: "Solmar Golf Links",
        description: "Challenging links-style course with dramatic Pacific Ocean views and desert landscape.",
        address: "Av. Solmar 1",
        city: "Cabo San Lucas",
        state: "Baja California Sur",
        phone: "+52 624 143 2884",
        email: "info@solmargolf.com",
        website: "https://solmargolf.com",
        priceWeekday: 145,
        priceWeekend: 165,
        holes: 18,
        par: 71,
        length: 6900,
        latitude: 22.8905,
        longitude: -109.9167,
        image: "/images/golf-courses/solmar-1.jpg",
        images: [
          "/images/golf-courses/solmar-1.jpg",
          "/images/golf-courses/solmar-2.jpg",
          "/images/golf-courses/solmar-3.jpg",
          "/images/golf-courses/solmar-4.jpg"
        ],
        rating: 4.5,
        reviewCount: 156,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "6",
        name: "El Camaleón Golf Club",
        description: "Greg Norman designed course in the Riviera Maya, home to the PGA Tour's Mayakoba Golf Classic.",
        address: "Carretera Federal Cancún-Playa del Carmen Km 298",
        city: "Playa del Carmen",
        state: "Quintana Roo",
        phone: "+52 984 206 3088",
        email: "info@elcamaleongolf.com",
        website: "https://elcamaleongolf.com",
        priceWeekday: 175,
        priceWeekend: 195,
        holes: 18,
        par: 72,
        length: 7039,
        latitude: 20.6296,
        longitude: -87.0739,
        image: "/images/golf-courses/el-camaleon-1.jpg",
        images: [
          "/images/golf-courses/el-camaleon-1.jpg",
          "/images/golf-courses/el-camaleon-2.jpg",
          "/images/golf-courses/el-camaleon-3.jpg",
          "/images/golf-courses/el-camaleon-4.jpg"
        ],
        rating: 4.9,
        reviewCount: 287,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "7",
        name: "Club de Golf La Ceiba",
        description: "Traditional golf course in the heart of Yucatan with lush tropical vegetation.",
        address: "Carretera Mérida-Progreso Km 14.5",
        city: "Mérida",
        state: "Yucatán",
        phone: "+52 999 922 0053",
        email: "info@golfceiba.com",
        website: "https://golfceiba.com",
        priceWeekday: 90,
        priceWeekend: 110,
        holes: 18,
        par: 72,
        length: 6400,
        latitude: 21.0285,
        longitude: -89.6650,
        image: "/images/golf-courses/la-ceiba-1.jpg",
        images: [
          "/images/golf-courses/la-ceiba-1.jpg",
          "/images/golf-courses/la-ceiba-2.jpg",
          "/images/golf-courses/la-ceiba-3.jpg",
          "/images/golf-courses/la-ceiba-4.jpg"
        ],
        rating: 4.5,
        reviewCount: 134,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "8",
        name: "Golf Club Bosques",
        description: "Urban golf course in the heart of Mexico City with mature trees and challenging layout.",
        address: "Av. Bosques de Duraznos 65",
        city: "Ciudad de México",
        state: "Ciudad de México",
        phone: "+52 55 5596 5400",
        email: "info@golfbosques.com",
        website: "https://golfbosques.com",
        priceWeekday: 110,
        priceWeekend: 130,
        holes: 18,
        par: 70,
        length: 6200,
        latitude: 19.4326,
        longitude: -99.1332,
        image: "/images/golf-courses/golf-bosques-1.jpg",
        images: [
          "/images/golf-courses/golf-bosques-1.jpg",
          "/images/golf-courses/golf-bosques-2.jpg",
          "/images/golf-courses/golf-bosques-3.jpg",
          "/images/golf-courses/golf-bosques-4.jpg"
        ],
        rating: 4.3,
        reviewCount: 89,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "9",
        name: "Vidanta Golf Los Cabos",
        description: "Norman-designed course with stunning views of the Sea of Cortez and desert landscape.",
        address: "Blvd. Paseo de los Cabos s/n",
        city: "San José del Cabo",
        state: "Baja California Sur",
        phone: "+52 624 163 4000",
        email: "info@vidantagolf.com",
        website: "https://vidantagolf.com",
        priceWeekday: 165,
        priceWeekend: 185,
        holes: 18,
        par: 72,
        length: 7156,
        latitude: 23.0545,
        longitude: -109.7164,
        image: "/images/golf-courses/vidanta-1.jpg",
        images: [
          "/images/golf-courses/vidanta-1.jpg",
          "/images/golf-courses/vidanta-2.jpg",
          "/images/golf-courses/vidanta-3.jpg",
          "/images/golf-courses/vidanta-4.jpg"
        ],
        rating: 4.7,
        reviewCount: 203,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "10",
        name: "Punta Mita Golf Club",
        description: "Jack Nicklaus Signature course with ocean views and the famous 'Tail of the Whale' island green.",
        address: "Carretera Punta de Mita Km 11.5",
        city: "Punta de Mita",
        state: "Nayarit",
        phone: "+52 329 291 6000",
        email: "info@puntamita.com",
        website: "https://puntamita.com",
        priceWeekday: 195,
        priceWeekend: 225,
        holes: 18,
        par: 72,
        length: 7014,
        latitude: 20.7667,
        longitude: -105.5167,
        image: "/images/golf-courses/punta-mita-1.jpg",
        images: [
          "/images/golf-courses/punta-mita-1.jpg",
          "/images/golf-courses/punta-mita-2.jpg",
          "/images/golf-courses/punta-mita-3.jpg",
          "/images/golf-courses/punta-mita-4.jpg"
        ],
        rating: 4.8,
        reviewCount: 167,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "11",
        name: "Estrella del Mar Golf Club",
        description: "Robert Trent Jones Jr. design featuring three distinct nine-hole courses in Mazatlán.",
        address: "Av. Estrella del Mar 1",
        city: "Mazatlán",
        state: "Sinaloa",
        phone: "+52 669 982 3300",
        email: "info@estrelladelmar.com",
        website: "https://estrelladelmar.com",
        priceWeekday: 125,
        priceWeekend: 145,
        holes: 27,
        par: 72,
        length: 6800,
        latitude: 23.2494,
        longitude: -106.4103,
        image: "/images/golf-courses/estrella-del-mar-1.jpg",
        images: [
          "/images/golf-courses/estrella-del-mar-1.jpg",
          "/images/golf-courses/estrella-del-mar-2.jpg",
          "/images/golf-courses/estrella-del-mar-3.jpg",
          "/images/golf-courses/estrella-del-mar-4.jpg"
        ],
        rating: 4.4,
        reviewCount: 112,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "12",
        name: "Moon Palace Golf Club",
        description: "Jack Nicklaus designed championship course in Cancun with jungle and lagoon views.",
        address: "Carretera Cancún-Chetumal Km 340",
        city: "Cancún",
        state: "Quintana Roo",
        phone: "+52 998 881 6000",
        email: "info@moonpalacegolf.com",
        website: "https://moonpalacegolf.com",
        priceWeekday: 155,
        priceWeekend: 175,
        holes: 27,
        par: 72,
        length: 6900,
        latitude: 21.2619,
        longitude: -86.8515,
        image: "/images/golf-courses/moon-palace-1.jpg",
        images: [
          "/images/golf-courses/moon-palace-1.jpg",
          "/images/golf-courses/moon-palace-2.jpg",
          "/images/golf-courses/moon-palace-3.jpg",
          "/images/golf-courses/moon-palace-4.jpg"
        ],
        rating: 4.6,
        reviewCount: 178,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json(mockCourses)

  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

