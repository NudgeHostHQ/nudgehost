import * as Sentry from "@sentry/nextjs";

// Browser-side Sentry. Session Replay is disabled (both sample rates 0); only
// a 10% trace sample is collected to keep quota low.
Sentry.init({
  dsn: "https://3357e0cf91f73bdd90d0ca2e9511938c@o4511451726741504.ingest.de.sentry.io/4511451731066960",
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});
