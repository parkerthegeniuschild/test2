import { z } from '@openAPI/config';
import { paginated } from '@openAPI/schema';
import { Audience, Method } from '@utils/constants';
import { IdScalar, schemaFromShape } from '@utils/schema';
import type { TOpenAPIAction } from '@openAPI/types';

const LegalTextShape = {
  nodeType: z.string(),
  data: z.object({}),
  content: z.array(
    z.object({
      nodeType: z.string(),
      data: z.object({}),
      content: z.array(
        z.object({
          nodeType: z.string(),
          value: z.string(),
          marks: z.array(z.record(z.string(), z.string())),
          data: z.object({}),
        })
      ),
    })
  ),
};

const LegalDocumentsResponseSchema = paginated(
  z
    .object({
      id: z.string(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      revision: IdScalar,
      locale: z.string(),
      title: z.string(),
      slug: z.string(),
      legalText: schemaFromShape(LegalTextShape),
    })
    .openapi({
      example: {
        id: '35CAAmdUfg4gQvQMcl5uGs',
        createdAt: '2021-08-16T15:27:56.722Z',
        updatedAt: '2023-08-21T19:47:19.535Z',
        revision: 43,
        locale: 'en-US',
        title: 'Liability Waiver & Release',
        slug: 'liability-waiver-and-release',
        legalText: {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value:
                    'If you or your business do not agree to the terms described here, then you and your business should not use the Platform.',
                  marks: [{ type: 'bold' }],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    })
);

export const GetLegalDocumentsAction: TOpenAPIAction = {
  title: 'LegalDocumentSchema',
  method: Method.GET,
  path: '/legalDocuments',
  description: 'Get legal documents',
  tags: [Audience.COMMON],
  isProtected: true,
  response: {
    content: LegalDocumentsResponseSchema,
  },
};
