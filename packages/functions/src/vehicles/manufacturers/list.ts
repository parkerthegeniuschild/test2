import { response } from '@utils/response';
import { transformEvent } from '@utils/helpers';
import { ApiHandler } from 'sst/node/api';
import { jobVehicleContacts as jobVehicleContactsSchema } from 'db/schema/jobVehicleContacts';
import { MANUFACTURERS_LIST } from '@utils/constants';

export const handler = ApiHandler(async (_evt) => {
  const { size, filters } = transformEvent(_evt, jobVehicleContactsSchema);

  const list = filters
    ? extractQueryManufacturer(_evt.queryStringParameters?.manufacturer || '')
    : MANUFACTURERS_LIST;

  return response.success(list.slice(0, size));
});

const extractQueryManufacturer = (query: string) => {
  return MANUFACTURERS_LIST.filter((item) =>
    item.manufacturer.match(
      new RegExp(query.split(':')[1]?.replace(/%/g, ''), 'gi')
    )
  );
};
