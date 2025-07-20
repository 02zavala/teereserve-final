import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Ya existe un usuario con este email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: { connect: { name: 'Client' } },
      }
    })

    // Return user without sensitive data
    const { password: userPassword, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Error creating user:', String(error))
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
