import {
  serviceAreaRateRelations,
  serviceAreaRates as serviceAreaRatesSchema,
} from 'db/schema/serviceAreaRates';
import {
  serviceAreas as serviceAreasSchema,
  serviceAreasRelations,
} from 'db/schema/serviceAreas';
import { keyBy } from 'lodash';
import { ApiHandler } from 'sst/node/api';
import { useDb } from 'db/dbClient';
import { transformEvent } from '@utils/helpers';
import { response } from '@utils/response';

const db = useDb({
  serviceAreasRates: serviceAreaRatesSchema,
  serviceAreas: serviceAreasSchema,
  serviceAreasRelations,
  serviceAreasRateRelations: serviceAreaRateRelations,
});

export const handler = ApiHandler(async (_evt) => {
  const { page, size, orderBy, filters } = transformEvent(
    _evt,
    serviceAreasSchema
  );

  const serviceAreas = await db.query.serviceAreas
    .findMany({
      where: filters,
      limit: Number(size),
      offset: Number(size) * Number(page),
      orderBy,
      with: { serviceAreasRates: true },
    })
    .execute();

  const serviceAreasWRate = serviceAreas.map((serviceArea) => {
    const { serviceAreasRates, ...serviceAreaWRate } = serviceArea;
    const serviceAreaRateByAreaRateId = keyBy(
      serviceAreasRates,
      'area_rate_id'
    );
    const fuel_surcharge = serviceAreaRateByAreaRateId[1022]?.value;
    const callout = serviceAreaRateByAreaRateId[1023]?.value;
    const hourly_rate = serviceAreaRateByAreaRateId[1024]?.value;
    return { ...serviceAreaWRate, fuel_surcharge, callout, hourly_rate };
  });

  return response.success({
    serviceAreas: serviceAreasWRate,
    page: {
      size,
      number: serviceAreasWRate.length,
    },
  });
});
