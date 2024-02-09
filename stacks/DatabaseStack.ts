import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsManager from 'aws-cdk-lib/aws-secretsmanager';
import { RDS, StackContext } from 'sst/constructs';
import { checkIsSandbox } from './stageUtils';

export function DatabaseStack({ stack }: StackContext) {
  const slug = checkIsSandbox(stack.stage) ? 'sandbox' : stack.stage;
  const myrds = new RDS(stack, 'db', {
    engine: 'postgresql11.13',
    defaultDatabaseName: process.env.DatabaseName || stack.stage,
    cdk: {
      cluster: rds.ServerlessCluster.fromServerlessClusterAttributes(
        stack,
        'ICluster',
        {
          clusterIdentifier: process.env.AwsClusterName || '',
        }
      ),
      secret: secretsManager.Secret.fromSecretNameV2(
        stack,
        'RdsSecret',
        `${slug}/truckup/rds`
      ),
    },
  });

  return myrds;
}
