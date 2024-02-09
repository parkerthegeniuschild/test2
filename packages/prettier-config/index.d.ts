import type { Config } from 'prettier';

declare module 'prettier-config' {
  const config: Config;
  export default config;
}
