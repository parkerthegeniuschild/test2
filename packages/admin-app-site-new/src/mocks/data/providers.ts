import { faker } from '@faker-js/faker';

import { api } from '../api';

export const providers = {
  url: api.sst('/providers'),
  data: {
    empty: {
      providers: [],
      paginationData: {
        number: 0,
        totalElements: 0,
      },
    },
    default: {
      providers: [
        {
          id: 777,
          firstname: 'John',
          lastname: 'Doe',
          phone: '01234567890',
          email: 'john@doe.com',
          balance: 1000,
          is_blocked: false,
          rating: '5.00',
          completedJobsCount: 1000,
          acceptedRate: 1,
        },
        ...Array.from({ length: 14 }, (_, i) => ({
          id: i,
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          phone: faker.phone.number('1##########'),
          email: faker.internet.email(),
          balance: faker.finance.amount({ min: -1000, max: 999 }),
          is_blocked: faker.datatype.boolean(),
          rating: faker.datatype.boolean(0.75)
            ? String(faker.number.float({ min: 0, max: 4.99, precision: 0.01 }))
            : null,
          completedJobsCount: faker.number.int({ min: 0, max: 1000 }),
          acceptedRate: faker.datatype.boolean(0.75)
            ? faker.number.float({ min: 0, max: 0.99 })
            : undefined,
        })),
      ],
      paginationData: {
        size: 15,
        number: 15,
        page: 0,
        totalElements: 33,
      },
    },
  },
};
