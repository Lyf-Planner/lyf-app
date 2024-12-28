import 'dotenv/config';

// Keep secrets such as API keys seperate for visibility sake

export default {
  expo: {
    owner: 'ethanhusband',
    name: 'Lyf',
    slug: 'lyf',
    scheme: 'lyf',
    currentFullName: '@ethanhusband/lyf',
    originalFullName: '@ethanhusband/lyf',
    version: '2.1.1',
    icon: './src/assets/images/inverted-icon.png',
    orientation: 'portrait',
    newArchEnabled: true,
    userInterfaceStyle: 'light',
    runtimeVersion: {
      policy: 'sdkVersion'
    },
    jsEngine: 'hermes',
    splash: {
      image: './src/assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#FFF'
    },
    packagerOpts: {
      sourceExts: ['cjs']
    },
    updates: {
      url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`,
      requestHeaders: {
        'expo-runtime-version': '1.0.0',
        'expo-channel-name': 'local'
      }
    },
    assetBundlePatterns: ['**/*'],
    web: {
      favicon: './src/assets/images/icon.png',
      title: 'Lyf',
      output: 'single',
      bundler: 'metro'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/bg-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.lyfplanner',
      versionCode: 2101
    },
    ios: {
      bundleIdentifier: 'com.lyfplanner',
      buildNumber: '2.1.1'
    },
    plugins: [
      'expo-asset',
      'expo-font',
      'expo-localization',
      ['expo-location', { locationWhenInUsePermission: 'Allow Lyf to use your location for weather data.' }],
      'expo-router'
    ],
    extra: {
      backendUrl: process.env.BACKEND_URL,
      localBackendPort: process.env.LOCAL_BACKEND_PORT,
      appEnv: process.env.APP_ENV,
      eas: {
        projectId: '2c533ba0-983e-4ef8-abc4-e938b5768a79'
      }
    }
  }
};
