import { type SSTConfig } from 'sst';

import { ApiStack } from './stacks/ApiStack';
import { ConfigStack } from './stacks/ConfigStack';
import { CronStack } from './stacks/CronStack';
import { DatabaseStack } from './stacks/DatabaseStack';
import { MigrationStack } from './stacks/MigrationStack';
import { StaticStackNew } from './stacks/StaticStackV2';
import { StorageStack } from './stacks/StorageStack';
import { DebugStack } from './stacks/DebugStack';
import { checkIsDev, checkIsSandbox } from './stacks/stageUtils';
import { DnsStack } from './stacks/DnsStack';
import { use } from 'sst/constructs';
import { DocumentationStack } from './stacks/DocumentationStack';
import { ApiJobsStack } from './stacks/ApiJobsStack';

const SANDBOX_PROFILE = 'sandbox';

export default {
  config(input) {
    return {
      name: 'truckup-api',
      region: 'us-east-2',
      profile: getProfile(input),
    };
  },
  stacks(app) {
    const isSandbox = checkIsSandbox(app.stage);
    if (isSandbox && !checkIsDev(app.stage)) {
      app.setDefaultRemovalPolicy('destroy');
    }

    app.stack(ConfigStack);
    const { defaults } = use(ConfigStack);

    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      environment: { POWERTOOLS_DEV: `${isSandbox}` },
      bind: defaults,
      // for sentry https://github.com/getsentry/profiling-node/issues/189
      nodejs: { esbuild: { loader: { '.node': 'copy' } } },
    });

    app
      .stack(DnsStack)
      .stack(DatabaseStack)
      .stack(StorageStack)
      .stack(ApiStack)
      .stack(ApiJobsStack)
      .stack(StaticStackNew)
      .stack(CronStack)
      .stack(MigrationStack)
      .stack(DebugStack)
      .stack(DocumentationStack);
  },
} satisfies SSTConfig;

type GlobalOptions = Parameters<SSTConfig['config']>[0];

const getProfile = ({ profile, stage }: GlobalOptions) => {
  if (profile) return profile;
  // stage is undefined for default parameterless run (will become developer stage)
  if (!stage || checkIsSandbox(stage)) return SANDBOX_PROFILE;
  return profile;
};
