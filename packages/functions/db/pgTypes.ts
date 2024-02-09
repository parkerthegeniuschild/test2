import assert from 'node:assert/strict';
import { customType } from 'drizzle-orm/pg-core';

export const timestampInt = customType<{
  data: Date;
  driverData: number;
}>({
  dataType() {
    return 'bigint';
  },
  toDriver(date) {
    return date.valueOf();
  },
  fromDriver(value) {
    return new Date(value);
  },
});

export const geospatialPoint = customType<{
  data: { latitude: number; longitude: number };
  driverData: string;
}>({
  dataType() {
    return 'GEOGRAPHY(POINT, 4326)';
  },
  toDriver({ longitude, latitude }) {
    // return `SRID=4326;POINT(${longitude} ${latitude})`;
    return `ST_GeogFromText('POINT(${longitude} ${latitude})')`;
  },
  fromDriver(value) {
    assert.ok(typeof value === 'string', `Failed to parse geospatialPoint`);
    const [longitude, latitude] = value
      .substring(16, value.length - 1)
      .trim()
      .split(' ')
      .map(parseFloat);
    assert.ok(
      typeof longitude === 'number' && typeof latitude === 'number',
      `Invalid geospatialPoint`
    );
    return { longitude, latitude };
  },
});

export const geospatialPointTemp = customType<{
  data: { latitude: number; longitude: number };
  driverData: string;
}>({
  dataType() {
    return 'text';
  },
  toDriver({ longitude, latitude }) {
    return JSON.stringify({ longitude, latitude });
  },
  fromDriver(value) {
    assert.ok(typeof value === 'string', `Failed to parse geospatialPoint`);
    return JSON.parse(value);
  },
});
