import { Function, Script, StackContext, use } from 'sst/constructs';
import { ConfigStack } from './ConfigStack';
import { DatabaseStack } from './DatabaseStack';

export function MigrationStack({ stack }: StackContext) {
  const {
    config: { DB_RESET_CLIENT },
    secret: { FIREBASE_ADMIN_KEY },
  } = use(ConfigStack);
  const db = use(DatabaseStack);

  new Function(stack, 'FirebaseAgreementsMigrator', {
    handler: 'packages/functions/src/migrations/firebaseAgreements.handler',
    bind: [db, FIREBASE_ADMIN_KEY],
  });

  const dbMigrator = new Script(stack, 'DatabaseMigrator', {
    onCreate: {
      handler: 'packages/functions/src/debug/resetDatabase.handler',
      bind: [db, DB_RESET_CLIENT],
      copyFiles: [{ from: 'packages/functions/drizzle' }],
      environment: { IS_CREATE: 'true' },
    },
    onUpdate: {
      handler: 'packages/functions/src/migrations/databaseMigrator.handler',
      bind: [db, DB_RESET_CLIENT],
      copyFiles: [{ from: 'packages/functions/drizzle' }],
    },
  });
  dbMigrator.createFunction?.bind([dbMigrator.updateFunction!]);

  return { dbMigrator };
}
