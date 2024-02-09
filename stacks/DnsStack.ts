import { Stack, StackContext, use } from 'sst/constructs';
import { checkIsProd, checkIsSandbox, checkIsStaging } from './stageUtils';
import { Certificate, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import config from './stackConfig';
import type { CustomDomainProps } from 'sst/constructs/util/apiGatewayV2Domain';
import { ConfigStack } from './ConfigStack';

export function DnsStack({ stack }: StackContext) {
  const {
    config: { DNS_ZONE },
  } = use(ConfigStack);
  const zone = DNS_ZONE.value;
  const isProd = checkIsProd(stack.stage);

  const { sharedCertificate, sharedGlobalCertificate } =
    fetchCertificates(stack);

  const createDomainInfo = (
    domain: string | undefined,
    certificate = sharedCertificate
  ) => ({
    domain,
    customDomain:
      domain === undefined
        ? undefined
        : ({
            domainName: domain,
            cdk: certificate && { certificate },
            hostedZone: zone,
          } satisfies CustomDomainProps),
  });

  // we disable on prod for now because we do not want to accidently interfere with existing DNS
  const dnsDisabled = isProd || !!process.env.DNS_DISABLED;
  const createDomain = domainCreator({ zone, stage: stack.stage });
  const admin = createDomainInfo(
    dnsDisabled ? undefined : createDomain('app'),
    sharedGlobalCertificate
  );
  const api = createDomainInfo(dnsDisabled ? undefined : createDomain('api'));
  const apiDocs = createDomainInfo(
    dnsDisabled ? undefined : createDomain('api-docs')
  );

  stack.addOutputs({
    Zone: DNS_ZONE.value,
    AdminDomain: admin.domain,
    ApiDomain: api.domain,
    SharedCertificateArn: sharedCertificate?.certificateArn,
    SharedGlobalCertificateArn: sharedGlobalCertificate?.certificateArn,
  });

  return {
    zone,
    admin,
    api,
    apiDocs,
    sharedCertificate,
    sharedGlobalCertificate,
  };
}

const domainCreator =
  ({ zone, stage }: { zone: string; stage: string }) =>
  (slug: string) =>
    checkIsSandbox(stage) ? `${stage}.${slug}.${zone}` : `${slug}.${zone}`;

function fetchCertificates(stack: Stack):
  | {
      sharedCertificate: ICertificate;
      sharedGlobalCertificate: ICertificate;
    }
  | { sharedCertificate: undefined; sharedGlobalCertificate: undefined };
function fetchCertificates(stack: Stack): {
  sharedCertificate: ICertificate;
  sharedGlobalCertificate: ICertificate;
};
function fetchCertificates(stack: Stack): {
  sharedCertificate: undefined;
  sharedGlobalCertificate: undefined;
};
function fetchCertificates(stack: Stack) {
  const arns = fetchCertificateArns(stack);
  return {
    sharedCertificate: arns.sharedCertificateArn
      ? Certificate.fromCertificateArn(
          stack,
          'SharedCert',
          arns.sharedCertificateArn
        )
      : undefined,
    sharedGlobalCertificate: arns.sharedGlobalCertificateArn
      ? Certificate.fromCertificateArn(
          stack,
          'SharedGlobalCert',
          arns.sharedGlobalCertificateArn
        )
      : undefined,
  };
}

function fetchCertificateArns(stack: Stack) {
  switch (true) {
    case checkIsSandbox(stack.stage): {
      return {
        sharedCertificateArn: config.SANDBOX_CERT_ARN,
        sharedGlobalCertificateArn: config.SANDBOX_CF_CERT_ARN,
      };
    }
    case checkIsStaging(stack.stage): {
      return {
        sharedCertificateArn: config.STAGING_CERT_ARN,
        sharedGlobalCertificateArn: config.STAGING_CF_CERT_ARN,
      };
    }
    default: {
      return {
        sharedCertificateArn: undefined,
        sharedGlobalCertificateArn: undefined,
      };
    }
  }
}
