import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Matches `app/(protected)/**` URLs (route groups are not in the path).
const isProtectedRoute = createRouteMatcher(['/app(.*)', '/profile(.*)'])

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/login'
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/signup'

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      const loginHref = new URL(signInUrl, req.nextUrl.origin).href
      await auth.protect({ unauthenticatedUrl: loginHref })
    }
  },
  { signInUrl, signUpUrl },
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}