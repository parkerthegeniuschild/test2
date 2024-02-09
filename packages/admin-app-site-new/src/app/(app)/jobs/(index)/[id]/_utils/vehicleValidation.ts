import type { VehicleContact, VehicleService } from '../_types';

export const vehicleValidation = {
  validate(
    vehicle?: VehicleContact,
    { validateOnlyVehicleFields }: { validateOnlyVehicleFields?: boolean } = {}
  ) {
    const isValidVehicle = Boolean(
      this.check.isValidType(vehicle) &&
        this.check.isValidYear(vehicle) &&
        this.check.isValidUsdot(vehicle)
    );

    if (validateOnlyVehicleFields) {
      return isValidVehicle;
    }

    const areValidServices = Boolean(
      (vehicle?.jobServices.length ?? 0) > 0 &&
        vehicle?.jobServices.every(this.check.isValidServiceType) &&
        vehicle?.jobServices.every(this.check.isValidServiceDescription)
    );

    return isValidVehicle && areValidServices;
  },
  check: {
    isValidType: (vehicle?: VehicleContact) => !!vehicle?.type?.length,

    isValidYear: (vehicle?: VehicleContact) =>
      vehicle?.year === null ||
      vehicle?.year === undefined ||
      (vehicle?.year ?? 0) >= 1900,

    isValidUsdot: (vehicle?: VehicleContact) =>
      vehicle?.usdot === null ||
      vehicle?.usdot === undefined ||
      (vehicle?.usdot.length ?? 0) >= 6,

    isValidServiceType: (vehicleService?: VehicleService) =>
      typeof vehicleService?.service_id === 'number',

    isValidServiceDescription: (vehicleService?: VehicleService) =>
      typeof vehicleService?.description === 'string' &&
      vehicleService.description.trim().length > 0,
  },
};
