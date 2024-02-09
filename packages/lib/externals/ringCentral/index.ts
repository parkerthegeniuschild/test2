import { SDK } from '@ringcentral/sdk';

// TODO: leverage aws secret manager
const initRingCentral = async () => {
  const RingCentralSDK = new SDK({
    server: SDK.server.sandbox,
    clientId: process.env.RingcentralClientId,
    clientSecret: process.env.RingcentralClientSecret,
  });

  const platform = RingCentralSDK.platform();
  await platform.login({ jwt: process.env.RingcentralJWT });

  return platform;
};

export { initRingCentral };
