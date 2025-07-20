import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// GET - Fetch commissions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const affiliateId = searchParams.get('affiliateId')

    let whereClause: any = {}

    if (session.user.role === 'Promoter') {
      // Promoter can only see their own commissions
      const affiliate = await prisma.affiliate.findUnique({
        where: { userId: session.user.id }
      })

      if (!affiliate) {
        return NextResponse.json(
          { message: 'Affiliate profile not found' },
          { status: 404 }
        )
      }

      whereClause.affiliateId = affiliate.id
    } else if (session.user.role !== 'SuperAdmin') {
      return NextResponse.json(
        { message: 'Unauthorized - Promoter or SuperAdmin access required' },
        { status: 403 }
      )
    }

    // Apply filters
    if (status) whereClause.status = status
    if (affiliateId && session.user.role === 'SuperAdmin') {
      whereClause.affiliateId = affiliateId
    }

    const commissions = await prisma.commission.findMany({
      where: whereClause,
      include: {
        affiliate: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            golfCourse: {
              select: {
                id: true,
                name: true,
                location: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate summary statistics
    const totalCommissions = commissions.reduce((sum, commission) => 
      sum + commission.amount.toNumber(), 0
    )
    const pendingCommissions = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, commission) => sum + commission.amount.toNumber(), 0)
    const paidCommissions = commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, commission) => sum + commission.amount.toNumber(), 0)

    return NextResponse.json({ 
      commissions,
      summary: {
        total: totalCommissions,
        pending: pendingCommissions,
        paid: paidCommissions,
        count: commissions.length
      }
    })

  } catch (error) {
    console.error('Error fetching commissions:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Update commission status (SuperAdmin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SuperAdmin') {
      return NextResponse.json(
        { message: 'Unauthorized - SuperAdmin access required' },
        { status: 403 }
      )
    }

    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { message: 'Commission ID and status are required' },
        { status: 400 }
      )
    }

    if (!['pending', 'paid', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status. Must be pending, paid, or cancelled' },
        { status: 400 }
      )
    }

    const commission = await prisma.commission.update({
      where: { id },
      data: { status },
      include: {
        affiliate: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
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
    })

    return NextResponse.json({
      message: 'Commission status updated successfully',
      commission
    })

  } catch (error) {
    console.error('Error updating commission:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Bulk update commission status (SuperAdmin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'SuperAdmin') {
      return NextResponse.json(
        { message: 'Unauthorized - SuperAdmin access required' },
        { status: 403 }
      )
    }

    const { commissionIds, status } = await request.json()

    if (!commissionIds || !Array.isArray(commissionIds) || !status) {
      return NextResponse.json(
        { message: 'Commission IDs array and status are required' },
        { status: 400 }
      )
    }

    if (!['pending', 'paid', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status. Must be pending, paid, or cancelled' },
        { status: 400 }
      )
    }

    const updatedCommissions = await prisma.commission.updateMany({
      where: {
        id: {
          in: commissionIds
        }
      },
      data: { status }
    })

    return NextResponse.json({
      message: `${updatedCommissions.count} commissions updated successfully`,
      updatedCount: updatedCommissions.count
    })

  } catch (error) {
    console.error('Error bulk updating commissions:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

