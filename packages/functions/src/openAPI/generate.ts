/* eslint @typescript-eslint/naming-convention: 0 */

import fs from 'fs';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import type { TOpenAPIAction } from '@openAPI/types';
import { bearerAuth, config, registry } from '@openAPI/config';
import {
  applyBearerAuth,
  applyRequest,
  applyResponses,
  createYaml,
  dirName,
} from '@openAPI/utils';
import { Audience } from '@utils/constants';
import { CreateProviderAction } from 'src/providers/open-api';
import {
  CreateJobCommentsAction,
  ListJobCommentsAction,
  UpdateJobCommentsAction,
} from 'src/jobs/id/vehicles/vehicleId/comments/open-api';
import {
  GetJobByIdAction,
  PatchJobAction,
  PatchJobStatusAction,
} from 'src/jobs/id/open-api';
import { CreateJobAction, GetJobsAction } from 'src/jobs/open-api';
import { GetProviderJobRequestsAction } from 'src/providers/id/jobRequests/open-api';
import { CreateJobVehicleAction } from 'src/jobs/id/vehicles/open-api';
import { CreateJobRequestAction } from 'src/jobs/id/requests/open-api';
import { PatchJobRequestAction } from 'src/jobs/id/requests/requestId/open-api';
import { GetLegalDocumentsAction } from 'src/legalDocuments/open-api';
import { GetCompaniesAction } from 'src/companies/open-api';
import {
  AuthPasswordAction,
  GetAuthSMSAction,
  VerifyAuthSMSAction,
} from 'src/auth/open-api';
import { ListTransactionsAction } from 'src/transactions/open-api';
import { ListVehicleColorsAction } from 'src/vehicles/colors/open-api';
import { PatchJobVehicleContactServiceRequestAction } from 'src/jobs/id/vehicles/vehicleId/services/serviceId/open-api';
import {
  ListJobServiceTimersAction,
  PostJobServiceTimersAction,
} from 'src/jobs/id/timers/open-api';
import {
  PatchJobServiceTimersAction,
  DeleteJobServiceTimersAction,
} from 'src/jobs/id/timers/timerId/open-api';
import { ListVehicleTypesAction } from 'src/vehicles/types/open-api';
import { PatchUserAction } from 'src/users/open-api';
import {
  CreateJobInvoiceAction,
  ListSentInvoicesAction,
  ListSentInvoicesByJobIdAction,
  PreviewJobInvoiceAction,
} from 'src/invoices/open-api';
import { CreateJobEarningsItemAction } from 'src/jobs/id/earnings/open-api';
import {
  UpdateJobEarningsItemAction,
  DeleteJobEarningsItemAction,
} from 'src/jobs/id/earnings/earningsId/open-api';
import { CreatePaymentIntentAction } from 'src/stripe/open-api';
import { GetPaymentByStripePaymentIdAction } from 'src/jobs/id/stripePayments/stripePaymentId/open-api';
import { ProviderSignupAction } from 'src/signup/open-api';
import { DeleteProviderAction } from 'src/providers/id/open-api';

// More actions go inside this array
const ActionList: TOpenAPIAction[] = [
  PatchUserAction,

  CreateProviderAction,

  CreateJobAction,
  GetJobByIdAction,
  GetJobsAction,
  PatchJobAction,
  PatchJobStatusAction,

  CreatePaymentIntentAction,

  CreateJobCommentsAction,
  ListJobCommentsAction,
  UpdateJobCommentsAction,

  CreateJobVehicleAction,

  CreateJobRequestAction,
  GetProviderJobRequestsAction,
  PatchJobRequestAction,

  GetLegalDocumentsAction,

  GetCompaniesAction,

  AuthPasswordAction,
  GetAuthSMSAction,
  VerifyAuthSMSAction,

  ListTransactionsAction,

  ListVehicleColorsAction,
  ListVehicleTypesAction,

  PatchJobVehicleContactServiceRequestAction,

  ListJobServiceTimersAction,
  PostJobServiceTimersAction,

  PatchJobServiceTimersAction,
  DeleteJobServiceTimersAction,

  PreviewJobInvoiceAction,
  CreateJobInvoiceAction,
  ListSentInvoicesAction,
  ListSentInvoicesByJobIdAction,

  CreateJobEarningsItemAction,
  UpdateJobEarningsItemAction,
  DeleteJobEarningsItemAction,

  GetPaymentByStripePaymentIdAction,

  ProviderSignupAction,
  DeleteProviderAction,
];

if (!ActionList.length) process.exit(0);

const registerAction = ({
  title,
  method,
  path,
  description,
  request,
  response,
  statusCode,
  isProtected = false,
  tags = [Audience.COMMON],
  summary = `${method.toUpperCase()} ${path}`,
}: TOpenAPIAction) => {
  if (response.content) registry.register(title, response.content);

  registry.registerPath({
    method,
    path,
    tags,
    summary,
    description,
    ...(isProtected && applyBearerAuth(bearerAuth)),
    ...(request && applyRequest(request)),
    responses: applyResponses(method, response, statusCode),
  });
};

ActionList.forEach((schema) => {
  registerAction(schema);
});

const generateDocumentation = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument(config);
};

function writeDocumentation() {
  const documentation = generateDocumentation();
  const content = createYaml(documentation);

  const outputDir = `${dirName}/out`;

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  fs.writeFileSync(`${outputDir}/api-docs.yaml`, content, {
    encoding: 'utf-8',
  });
}

writeDocumentation();
