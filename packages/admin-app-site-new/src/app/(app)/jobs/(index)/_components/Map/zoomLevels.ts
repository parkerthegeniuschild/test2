const zoomLevels: Record<string, number> = {
  continent: 5,
  country: 5,
  administrative_area_level_1: 7,
  administrative_area_level_2: 11,
  locality: 11,
  street: 15,
  building: 20,
};

export const DEFAULT_ZOOM = 15;

export function getZoomByLocationType(locationType?: string | null) {
  if (!locationType) {
    return DEFAULT_ZOOM;
  }

  return zoomLevels[locationType] || DEFAULT_ZOOM;
}
