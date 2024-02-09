import { SQL, sql } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

export const FACTOR_METERS_TO_MILES = 0.000621371;

export interface IGeoPoint {
  latitude: number;
  longitude: number;
}

export interface IGeoColumns {
  latitude: PgColumn;
  longitude: PgColumn;
}

const getQueryFromInput = (input: IGeoPoint | IGeoColumns): string => {
  switch (true) {
    case input.longitude instanceof PgColumn &&
      input.latitude instanceof PgColumn:
      return `ST_GeomFromText('POINT(' || ${input.longitude.name} || ' ' || ${input.latitude.name} || ')', 4326)`;
    case input.latitude instanceof Number:
    default:
      return `ST_GeomFromText('POINT(${input.longitude} ${input.latitude})', 4326)`;
  }
};

export const geoDistanceQuery = (
  from: IGeoPoint | IGeoColumns | PgColumn,
  to: IGeoPoint | IGeoColumns | PgColumn
): SQL => {
  return sql.raw(`ST_Distance(
    ${from instanceof PgColumn ? from.name : getQueryFromInput(from)},
    ${to instanceof PgColumn ? to.name : getQueryFromInput(to)},
    false
  ) * ${FACTOR_METERS_TO_MILES}`);
};
