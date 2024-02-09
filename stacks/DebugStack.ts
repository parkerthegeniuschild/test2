import { Function, StackContext, use } from 'sst/constructs';
import { DatabaseStack } from './DatabaseStack';
import { MigrationStack } from './MigrationStack';
import { ConfigStack } from './ConfigStack';
import { checkIsSandbox } from './stageUtils';

// This stack will always deploy, but most resources will only deploy for dev stages
export function DebugStack({ stack, app }: StackContext) {
  const {
    config: { DB_RESET_CLIENT },
    secret: { AUTH_PRIVATE_KEY, FIREBASE_ADMIN_KEY },
  } = use(ConfigStack);
  const db = use(DatabaseStack);
  const {
    dbMigrator: { updateFunction },
  } = use(MigrationStack);

  new Function(stack, 'ImpersonateUser', {
    handler: 'packages/functions/src/debug/impersonateUser.handler',
    bind: [db, AUTH_PRIVATE_KEY],
  });

  new Function(stack, 'ProviderAgreementReset', {
    handler: 'packages/functions/src/debug/resetProviderAgreements.handler',
    bind: [db],
  });

  if (!checkIsSandbox(app.stage)) return;

  new Function(stack, 'DatabaseReset', {
    handler: 'packages/functions/src/debug/resetDatabase.handler',
    bind: [db, DB_RESET_CLIENT, ...(updateFunction ? [updateFunction] : [])],
  });

  new Function(stack, 'FirebasePush', {
    handler: 'packages/functions/src/debug/firebasePush.handler',
    bind: [FIREBASE_ADMIN_KEY],
  });
}
