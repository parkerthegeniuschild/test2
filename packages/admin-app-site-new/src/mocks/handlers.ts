import { rest } from 'msw';

import { jobs, providers } from './data';

export const handlers = [
  rest.get(providers.url, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(providers.data.default))
  ),
  rest.get(jobs.url, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(jobs.data.default))
  ),
];
