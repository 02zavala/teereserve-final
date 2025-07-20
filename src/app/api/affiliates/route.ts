import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - Fetch affiliates (SuperAdmin only) or current affiliate info
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role === 'SuperAdmin') {
      // SuperAdmin can see all affiliates
      const affiliates = await prisma.affiliate.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          commissions: {
            include: {
              booking: {
                include: {
                  golfCourse: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({ affiliates })
    } else if (session.user.role === 'Promoter') {
      // Promoter can only see their own affiliate info
      const affiliate = await prisma.affiliate.findUnique({
        where: { userId: session.user.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          commissions: {
            include: {
              booking: {
                include: {
                  golfCourse: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })

      if (!affiliate) {
        return NextResponse.json(
          { message: 'Affiliate profile not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ affiliate })
    } else {
      return NextResponse.json(
        { message: 'Unauthorized - Promoter or SuperAdmin access required' },
        { status: 403 }
      )
    }

  } catch (error) {
    console.error('Error fetching affiliates:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Create affiliate profile (SuperAdmin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SuperAdmin') {
      return NextResponse.json(
        { message: 'Unauthorized - SuperAdmin access required' },
        { status: 403 }
      )
    }

    const { userId, commissionRate, referralCode } = await request.json()

    if (!userId || !commissionRate || !referralCode) {
      return NextResponse.json(
        { message: 'User ID, commission rate, and referral code are required' },
        { status: 400 }
      )
    }

    // Check if user exists and has Promoter role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    if (user.role.name !== 'Promoter') {
      return NextResponse.json(
        { message: 'User must have Promoter role' },
        { status: 400 }
      )
    }

    // Check if affiliate already exists
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { userId }
    })

    if (existingAffiliate) {
      return NextResponse.json(
        { message: 'Affiliate profile already exists for this user' },
        { status: 400 }
      )
    }

    // Check if referral code is unique
    const existingCode = await prisma.affiliate.findUnique({
      where: { referralCode }
    })

    if (existingCode) {
      return NextResponse.json(
        { message: 'Referral code already exists' },
        { status: 400 }
      )
    }

    // Create affiliate
    const affiliate = await prisma.affiliate.create({
      data: {
        userId,
        commissionRate,
        referralCode
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Affiliate created successfully',
      affiliate
    })

  } catch (error) {
    console.error('Error creating affiliate:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Update affiliate (SuperAdmin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SuperAdmin') {
      return NextResponse.json(
        { message: 'Unauthorized - SuperAdmin access required' },
        { status: 403 }
      )
    }

    const { id, commissionRate, referralCode } = await request.json()

    if (!id) {
      return NextResponse.json(
        { message: 'Affiliate ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (commissionRate !== undefined) updateData.commissionRate = commissionRate
    if (referralCode !== undefined) {
      // Check if new referral code is unique
      const existingCode = await prisma.affiliate.findFirst({
        where: { 
          referralCode,
          id: { not: id }
        }
      })

      if (existingCode) {
        return NextResponse.json(
          { message: 'Referral code already exists' },
          { status: 400 }
        )
      }
      updateData.referralCode = referralCode
    }

    const affiliate = await prisma.affiliate.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Affiliate updated successfully',
      affiliate
    })

  } catch (error) {
    console.error('Error updating affiliate:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

