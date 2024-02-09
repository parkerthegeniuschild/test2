import { StackContext, use } from 'sst/constructs';
import { ApiStack } from './ApiStack';
import { ConfigStack } from './ConfigStack';

export function ApiJobsStack({ stack }: StackContext) {
  const { api } = use(ApiStack);
  const {
    secret: { STRIPE_SK },
  } = use(ConfigStack);

  api.addRoutes(stack, {
    'GET /jobs': 'packages/functions/src/jobs/list.handler',
    'POST /jobs': 'packages/functions/src/jobs/post.handler',
    'GET /jobs/{id}': 'packages/functions/src/jobs/id/get.handler',
    'PATCH /jobs/{id}': 'packages/functions/src/jobs/id/patch.handler',
    'POST /jobs/{id}/payment-intent': {
      function: {
        handler: 'packages/functions/src/stripe/createPaymentIntent.handler',
        bind: [STRIPE_SK],
      },
    },
    'GET /jobs/{id}/stripe-payments/{stripePaymentId}': {
      function: {
        handler:
          'packages/functions/src/jobs/id/stripePayments/stripePaymentId/get.handler',
        bind: [STRIPE_SK],
      },
    },
    'GET /jobs/{id}/nearby-providers':
      'packages/functions/src/jobs/id/nearbyProviders.handler',
    'PATCH /jobs/{id}/status': 'packages/functions/src/jobs/id/status.handler',
    'PATCH /jobs/{id}/leave': 'packages/functions/src/jobs/id/leave.handler',
    'PATCH /jobs/{id}/publish':
      'packages/functions/src/jobs/id/publish.handler',
    'POST /jobs/{id}/earnings':
      'packages/functions/src/jobs/id/earnings/post.handler',
    'GET /jobs/{id}/earnings':
      'packages/functions/src/jobs/id/earnings/get.handler',
    'PATCH /jobs/{id}/earnings/{earningsId}':
      'packages/functions/src/jobs/id/earnings/earningsId/patch.handler',
    'DELETE /jobs/{id}/earnings/{earningsId}':
      'packages/functions/src/jobs/id/earnings/earningsId/delete.handler',
    'POST /jobs/{id}/charges':
      'packages/functions/src/jobs/id/charges/post.handler',
    'GET /jobs/{id}/charges':
      'packages/functions/src/jobs/id/charges/get.handler',
    'PATCH /jobs/{id}/charges/{chargesId}':
      'packages/functions/src/jobs/id/charges/chargesId/patch.handler',
    'DELETE /jobs/{id}/charges/{chargesId}':
      'packages/functions/src/jobs/id/charges/chargesId/delete.handler',
    'DELETE /jobs/{id}/providers/{providerId}':
      'packages/functions/src/jobs/id/providers/id/delete.handler',
    'POST /jobs/{id}/vehicles':
      'packages/functions/src/jobs/id/vehicles/post.handler',
    'PATCH /jobs/{id}/vehicles/{vehicleId}':
      'packages/functions/src/jobs/id/vehicles/vehicleId/patch.handler',
    'DELETE /jobs/{id}/vehicles/{vehicleId}':
      'packages/functions/src/jobs/id/vehicles/vehicleId/delete.handler',
    'POST /jobs/{jobId}/vehicles/{vehicleId}/comments':
      'packages/functions/src/jobs/id/vehicles/vehicleId/comments/post.handler',
    'GET /jobs/{jobId}/vehicles/{vehicleId}/comments':
      'packages/functions/src/jobs/id/vehicles/vehicleId/comments/list.handler',
    'PATCH /jobs/{jobId}/vehicles/{vehicleId}/comments/{commentId}':
      'packages/functions/src/jobs/id/vehicles/vehicleId/comments/commentId/patch.handler',
    'DELETE /jobs/{jobId}/vehicles/{vehicleId}/comments/{commentId}':
      'packages/functions/src/jobs/id/vehicles/vehicleId/comments/commentId/delete.handler',
    'POST /jobs/{jobId}/vehicles/{vehicleId}/photos':
      'packages/functions/src/jobs/id/vehicles/vehicleId/photos/post.handler',
    'DELETE /jobs/{jobId}/vehicles/{vehicleId}/photos/{photoId}':
      'packages/functions/src/jobs/id/vehicles/vehicleId/photos/photoId/delete.handler',
    'POST /jobs/{id}/vehicles/{vehicleId}/services':
      'packages/functions/src/jobs/id/vehicles/vehicleId/services/post.handler',
    'PATCH /jobs/{id}/vehicles/{vehicleId}/services/{serviceId}':
      'packages/functions/src/jobs/id/vehicles/vehicleId/services/serviceId/patch.handler',
    'DELETE /jobs/{id}/vehicles/{vehicleId}/services/{serviceId}':
      'packages/functions/src/jobs/id/vehicles/vehicleId/services/serviceId/delete.handler',
    'POST /jobs/{id}/vehicles/{vehicleId}/services/{serviceId}/parts':
      'packages/functions/src/jobs/id/vehicles/vehicleId/services/serviceId/parts/post.handler',
    'PATCH /jobs/{id}/vehicles/{vehicleId}/services/{serviceId}/parts/{partId}':
      'packages/functions/src/jobs/id/vehicles/vehicleId/services/serviceId/parts/partId/patch.handler',
    'DELETE /jobs/{id}/vehicles/{vehicleId}/services/{serviceId}/parts/{partId}':
      'packages/functions/src/jobs/id/vehicles/vehicleId/services/serviceId/parts/partId/delete.handler',
    'POST /jobs/{id}/requests':
      'packages/functions/src/jobs/id/requests/post.handler',
    'PATCH /jobs/{jobId}/requests/{requestId}':
      'packages/functions/src/jobs/id/requests/requestId/patch.handler',
    'GET /jobs/{id}/timers':
      'packages/functions/src/jobs/id/timers/list.handler',
    'POST /jobs/{id}/timers':
      'packages/functions/src/jobs/id/timers/post.handler',
    'PATCH /jobs/{id}/timers/{timerId}':
      'packages/functions/src/jobs/id/timers/timerId/patch.handler',
    'DELETE /jobs/{id}/timers/{timerId}':
      'packages/functions/src/jobs/id/timers/timerId/delete.handler',
  });
}
