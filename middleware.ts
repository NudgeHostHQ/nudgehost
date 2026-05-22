import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only /dashboard (and any future nested routes under it) require auth.
// Every marketing page stays fully public.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except Next.js internals and static assets.
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
