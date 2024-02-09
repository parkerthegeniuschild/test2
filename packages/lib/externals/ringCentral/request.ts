import { DateTime } from 'luxon';

import Platform from '@ringcentral/sdk/lib/platform/Platform';

async function getExtensionIds(platform: Platform) {
  const apiResponse = await platform.send({
    method: 'GET',
    url: `/restapi/v1.0/account/~/phone-number`,
    headers: {
      accept: 'application/json',
    },
  });

  const data = await apiResponse.json();

  if (!data?.records?.length) {
    return [] as string[];
  }

  const extensionIds: string[] = data.records.reduce((ids, { extension }) => {
    if (!!extension && extension.id) {
      ids.push(extension.id);
    }
    return ids;
  }, [] as string[]);

  return extensionIds;
}

async function getCallLog(platform: Platform, extensionId: string) {
  const apiResponse = await platform.send({
    method: 'GET',
    url: `/restapi/v1.0/account/~/extension/${extensionId}/call-log`,
    query: {
      dateTo: DateTime.now().toISO({ includeOffset: true }),
      dateFrom: DateTime.now()
        .minus({ days: 30 })
        .toISO({ includeOffset: true }),
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await apiResponse.json();

  return data;
}

async function getCallRecording(platform: Platform, recordingId: string) {
  const recordingInfoRequest = platform.send({
    method: 'GET',
    url: `/restapi/v1.0/account/~/recording/${recordingId}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const recordingContentRequest = platform.send({
    method: 'GET',
    url: `/restapi/v1.0/account/~/recording/${recordingId}/content`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const [apiResponseInfo, apiResponseContent] = await Promise.all([
    recordingInfoRequest,
    recordingContentRequest,
  ]);
  const [{ contentType }, data] = await Promise.all([
    apiResponseInfo.json(),
    apiResponseContent.arrayBuffer(),
  ]);

  return { data, recordingId, contentType };
}

export { getExtensionIds, getCallLog, getCallRecording };
