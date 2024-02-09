import path from 'node:path';
import { Api, StackContext, use } from 'sst/constructs';
import { DnsStack } from './DnsStack';

export function DocumentationStack({ stack }: StackContext) {
  const dns = use(DnsStack);

  const swagger = new Api(stack, 'SwaggerServer', {
    customDomain: dns.apiDocs.customDomain,
    routes: {
      //   'ANY /': 'packages/functions/src/openAPI/swagger.handler',
      //   'ANY /{proxy+}': 'packages/functions/src/openAPI/swagger.handler',
      $default: 'packages/functions/src/openAPI/swagger.handler',
    },
    defaults: {
      function: {
        enableLiveDev: false,
        copyFiles: [
          { from: 'packages/functions/src/openAPI/out' },
          ...SWAGGER_FILES.map((e) => ({
            from: path.join('node_modules/swagger-ui-dist/', e),
            to: path.join('static', e),
          })),
        ],
      },
    },
  });

  stack.addOutputs({ docs: swagger.customDomainUrl || swagger.url });

  return { swagger };
}

// based on this and other tickets: https://github.com/scottie1984/swagger-ui-express/issues/90
const SWAGGER_FILES = [
  'favicon-16x16.png',
  'favicon-32x32.png',
  'swagger-ui-bundle.js',
  'swagger-ui-es-bundle.js',
  'swagger-ui-standalone-preset.js',
  'swagger-ui.css',

  /** These files seem not needed, or at least not yet with our currently used features */
  // 'swagger-ui-es-bundle-core.js',
  // 'swagger-ui.js',
  // 'oauth2-redirect.html',
  // 'swagger-initializer.js',

  /** Since the static content is higher priority in our express router, we have to avoid index.js so we can fall through */
  // 'index.css',
  // 'index.html',
  // 'index.js',
];
