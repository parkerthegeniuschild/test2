/* eslint @typescript-eslint/naming-convention: 0 */

import { AnyZodObject, ZodBigIntCheck, ZodNumberCheck, ZodTypeAny } from 'zod';
import type { Enum } from '@utils/types';
import { Audience, ErrorMessage, Method, MethodCode } from '@utils/constants';

// TIO => Type of input/output
export type TIOBase = {
  content: ZodTypeAny | undefined;
  description?: string;
};

export type TRequestSchema = {
  body?: TIOBase;
  params?: AnyZodObject;
  query?: AnyZodObject;
};

type TResponseSchema = TIOBase;

export type TMethod = Enum<typeof Method>;
export type TStatusCode = Enum<typeof MethodCode>;

export type TOpenAPIAction = {
  title: string;
  method: TMethod;
  path: string;
  description: string;
  response: TResponseSchema;
  isProtected?: boolean;
  request?: TRequestSchema;
  summary?: string;
  tags?: Enum<typeof Audience>[];
  statusCode?: TStatusCode;
};

export type TErrorMessage = Enum<typeof ErrorMessage>;

export type ZodNumericCheck = ZodNumberCheck | ZodBigIntCheck;

export type TBearerAuth = {
  name: string;
  ref: {
    $ref: string;
  };
};
