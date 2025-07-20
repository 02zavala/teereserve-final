import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get session to verify authentication
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    // Get all users with their roles
    const users = await prisma.user.findMany({
      include: {
        role: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Remove sensitive data
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json({
      users: sanitizedUsers,
      total: sanitizedUsers.length
    })

  } catch (error) {
    console.error('Error fetching users:', String(error))
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

