
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bc5b124e71d348128544cd47689e5bc0',
  appName: 'unmute-life-19',
  webDir: 'dist',
  server: {
    url: 'https://bc5b124e-71d3-4812-8544-cd47689e5bc0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'release.keystore',
      keystoreAlias: 'key0',
    }
  }
};

export default config;
