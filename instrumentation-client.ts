// Next.js loads this file on the client at startup. Under Turbopack this is
// how the browser Sentry config is initialized, so we just pull it in here.
import "./sentry.client.config";

import * as Sentry from "@sentry/nextjs";

// Lets Sentry tie client navigations to performance traces.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
