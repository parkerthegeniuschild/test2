import { Bucket, StackContext } from 'sst/constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { checkIsSandbox } from './stageUtils';

export function StorageStack({ stack }: StackContext) {
  const isSandbox = checkIsSandbox(stack.stage);
  const autoDeleteObjects = isSandbox;
  const removalPolicy = isSandbox
    ? RemovalPolicy.DESTROY
    : RemovalPolicy.RETAIN;
  const ringCentralRecordingBucket = new Bucket(
    stack,
    'ring-central-call-recordings',
    { cdk: { bucket: { removalPolicy: RemovalPolicy.RETAIN } } }
  );

  // TODO remove this resource once the removal policy has been propagated
  new s3.Bucket(stack, 'agreement-uploads', {
    versioned: true,
    removalPolicy: RemovalPolicy.DESTROY,
  });
  const legalDocumentBucket = new Bucket(stack, 'legal-documents', {
    cdk: { bucket: { versioned: true, removalPolicy: RemovalPolicy.RETAIN } },
  });

  // User uploads
  const uploadsBucket = new Bucket(stack, 'UploadsBucket', {
    cdk: { bucket: { autoDeleteObjects, removalPolicy, versioned: true } },
  });

  // Invoice uploads
  const jobDocumentsBucket = new Bucket(stack, 'JobDocumentsBucket', {
    cdk: { bucket: { versioned: true, removalPolicy: RemovalPolicy.RETAIN } },
  });

  stack.addOutputs({
    RingCentralRecordingBucket: ringCentralRecordingBucket.bucketName,
    LegalDocumentBucket: legalDocumentBucket.bucketName,
    UploadsBucket: uploadsBucket.bucketName,
    JobDocumentsBucket: jobDocumentsBucket.bucketName,
  });

  return {
    ringCentralRecordingBucket,
    legalDocumentBucket,
    uploadsBucket,
    jobDocumentsBucket,
  };
}
