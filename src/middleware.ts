import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token

    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    const userRole = token.role as string

    if (req.nextUrl.pathname.startsWith("/admin") && !["Admin", "SuperAdmin"].includes(userRole)) {
      return NextResponse.rewrite(new URL("/denied", req.url))
    }

    if (req.nextUrl.pathname.startsWith("/partner") && userRole !== "GolfCourse") {
      return NextResponse.rewrite(new URL("/denied", req.url))
    }

    if (req.nextUrl.pathname.startsWith("/affiliate") && userRole !== "Promoter") {
      return NextResponse.rewrite(new URL("/denied", req.url))
    }

    if (req.nextUrl.pathname.startsWith("/user") && userRole !== "Client") {
      return NextResponse.rewrite(new URL("/denied", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*", "/affiliate/:path*", "/user/:path*"],
}


