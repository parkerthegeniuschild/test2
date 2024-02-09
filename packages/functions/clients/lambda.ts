import {
  InvocationType,
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from '@aws-sdk/client-lambda';

const client = new LambdaClient({});
export const invoker =
  <T = unknown, U = unknown>(functionName: string) =>
  (payload?: T) =>
  async (input?: Partial<InvokeCommandInput>): Promise<U> => {
    const command = new InvokeCommand({
      /* eslint-disable @typescript-eslint/naming-convention */
      FunctionName: functionName,
      InvocationType: InvocationType.RequestResponse,
      Payload: payload === undefined ? undefined : JSON.stringify(payload),
      ...(input || {}),
      /* eslint-enable @typescript-eslint/naming-convention */
    });
    const { Payload: _res } = await client.send(command);
    const res = JSON.parse(_res?.transformToString('utf-8') || '{}');
    const err = res.errorMessage || res.errorType;
    if (err) throw new Error(err);
    return res;
  };

export interface IInvokeParams<T = unknown>
  extends Partial<InvokeCommandInput> {
  functionName: string;
  payload?: T;
}
export const invoke = async <T = unknown, U = unknown>({
  functionName,
  payload,
  ...input
}: IInvokeParams<T>): Promise<U> =>
  await invoker<T, U>(functionName)(payload)(input);
