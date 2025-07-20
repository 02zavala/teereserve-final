import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'Client') {
      return NextResponse.json(
        { message: 'Unauthorized - Client access required' },
        { status: 403 }
      )
    }

    const { 
      paymentIntentId,
      golfCourseId, 
      bookingDate, 
      teeTime, 
      numberOfPlayers, 
      discountCode 
    } = await request.json()

    if (!paymentIntentId || !golfCourseId || !bookingDate || !teeTime || !numberOfPlayers) {
      return NextResponse.json(
        { message: 'Missing required booking information' },
        { status: 400 }
      )
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { message: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Get golf course details
    const golfCourse = await prisma.golfCourse.findUnique({
      where: { id: golfCourseId }
    })

    if (!golfCourse) {
      return NextResponse.json(
        { message: 'Golf course not found' },
        { status: 404 }
      )
    }

    // Calculate total price
    let totalPrice = golfCourse.pricePerRound.toNumber() * numberOfPlayers
    let appliedDiscountCode = null

    // Apply discount code if provided
    if (discountCode) {
      const discount = await prisma.discountCode.findUnique({
        where: { code: discountCode }
      })

      if (discount && discount.expiresAt && discount.expiresAt > new Date()) {
        if (!discount.maxUses || discount.currentUses < discount.maxUses) {
          if (!discount.minBookingValue || totalPrice >= discount.minBookingValue.toNumber()) {
            appliedDiscountCode = discount
            
            if (discount.discountType === 'percentage') {
              totalPrice = totalPrice * (1 - discount.value.toNumber())
            } else if (discount.discountType === 'fixed_amount') {
              totalPrice = Math.max(0, totalPrice - discount.value.toNumber())
            }
          }
        }
      }
    }

    // Check availability
    const availabilitySlot = await prisma.availability.findFirst({
      where: {
        golfCourseId,
        date: new Date(bookingDate),
        startTime: new Date(`1970-01-01T${teeTime}:00.000Z`),
        availableSlots: {
          gt: 0
        }
      }
    })

    if (!availabilitySlot) {
      return NextResponse.json(
        { message: 'Selected time slot is no longer available' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        golfCourseId,
        bookingDate: new Date(bookingDate),
        teeTime: new Date(`${bookingDate}T${teeTime}:00.000Z`),
        numberOfPlayers,
        totalPrice,
        status: 'confirmed',
        discountCodeId: appliedDiscountCode?.id
      },
      include: {
        golfCourse: {
          select: {
            name: true,
            location: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    // Update availability
    await prisma.availability.update({
      where: { id: availabilitySlot.id },
      data: {
        availableSlots: availabilitySlot.availableSlots - 1
      }
    })

    // Update discount code usage
    if (appliedDiscountCode) {
      await prisma.discountCode.update({
        where: { id: appliedDiscountCode.id },
        data: {
          currentUses: appliedDiscountCode.currentUses + 1
        }
      })
    }

    return NextResponse.json({
      message: 'Booking confirmed successfully',
      booking,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount
      }
    })

  } catch (error) {
    console.error('Error confirming payment and booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

