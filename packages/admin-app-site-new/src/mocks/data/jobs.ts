import { api } from '../api';

export const jobs = {
  url: api.sst('/jobs'),
  data: {
    empty: {
      jobs: [],
      page: {
        number: 0,
        totalElements: 0,
      },
    },
    default: {
      jobs: [
        {
          id: 4092,
          created_at: '2022-09-11T14:35:53.580Z',
          status_id: 'COMPLETED_PENDING_REVIEW',
          total_cost: '375.00',
          payment_sum: '10',
          company: { name: 'First Class Transport' },
          jobVehicle: {
            vehicle: {
              vehicleDriver: {
                driver: {
                  firstname: 'Bobby',
                  lastname: 'Brown',
                  is_no_text_messages: false,
                  phone: '11234567890',
                },
              },
            },
          },
          provider: {
            firstname: 'Kyle ',
            lastname: 'Hatcher',
            phone: '10987654321',
            is_blocked: false,
            is_online: true,
            is_onjob: false,
            rating: 4.9,
          },
          dispatcher: {
            firstname: 'Travis',
            lastname: 'Scott',
            is_no_text_messages: false,
            phone: '11111111111',
          },
          jobRequest: {
            location_city: 'St. Louis',
            location_state: 'MO',
          },
        },
      ],
      page: {
        size: 15,
        number: 15,
        page: 0,
        totalElements: 18,
      },
    },
  },
};
