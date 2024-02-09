import { StackContext, NextjsSite, use } from 'sst/constructs';
import { DnsStack } from './DnsStack';
import { ApiStack } from './ApiStack';

export function StaticStackNew({ stack }: StackContext) {
  const dns = use(DnsStack);
  const api = use(ApiStack);
  const adminAppSiteV2 = new NextjsSite(stack, 'adminAppSiteNew', {
    customDomain: dns.admin.customDomain,
    path: 'packages/admin-app-site-new',
    environment: {
      NEXT_PUBLIC_API_URL:
        process.env.NextPublicApiUrl ?? api.apiUrl ?? 'NOT SET',
      NEXT_PUBLIC_STAGE_NAME: stack.stage,
      NEXTAUTH_SECRET: process.env.NextAuthSecret ?? 'NOT SET',
      NEXTAUTH_URL:
        process.env.NextAuthUrl ??
        (dns.admin.domain && `https://${dns.admin.domain}`) ??
        'NOT SET',
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
        process.env.NextPublicMapboxAccessToken ?? 'NOT SET',
      NEXT_PUBLIC_GOOGLE_API_KEY:
        process.env.NextPublicGoogleApiKey ?? 'NOT SET',
      NEXT_PUBLIC_GOOGLE_MAPS_ID:
        process.env.NextPublicGoogleMapsId ?? 'NOT SET',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
        process.env.NextPublicStripePublishableKey ?? 'NOT SET',
      SENTRY_AUTH_TOKEN: process.env.NextSentryAuthToken ?? 'NOT SET',
    },
  });

  stack.addOutputs({
    SiteUrl:
      adminAppSiteV2.customDomainUrl ||
      adminAppSiteV2.url ||
      'http://localhost:5173',
  });

  return adminAppSiteV2;
}
