import * as Sentry from "@sentry/nextjs";

// Edge runtime (middleware and any edge route handlers).
Sentry.init({
  dsn: "https://3357e0cf91f73bdd90d0ca2e9511938c@o4511451726741504.ingest.de.sentry.io/4511451731066960",
  tracesSampleRate: 0.1,
});
