import * as Sentry from "@sentry/nextjs";

// Next.js calls register() once per server runtime at startup. This is what
// actually loads the server/edge Sentry configs (they are not auto-loaded).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captures errors thrown in nested React Server Components on the App Router.
export const onRequestError = Sentry.captureRequestError;
