// We have to use two certificates, because:
// - cloudfront requires us-east-1
// - ApiGateway requires matching region
export const SANDBOX_CF_CERT_ARN =
  'arn:aws:acm:us-east-1:193886518961:certificate/3405915b-60f2-4944-bc78-d248d6a40537';
export const SANDBOX_CERT_ARN =
  'arn:aws:acm:us-east-2:193886518961:certificate/c400b113-b3b2-44b0-a2f9-c2f92ad1fe0b';
export const STAGING_CF_CERT_ARN =
  'arn:aws:acm:us-east-1:654654515199:certificate/4dca3e16-7ae2-48c2-99f6-9a9f1f478a47';
export const STAGING_CERT_ARN =
  'arn:aws:acm:us-east-2:654654515199:certificate/63b67401-e097-4bf2-b955-21b13c82b771';

export * as config from './stackConfig';
export * as default from './stackConfig';
