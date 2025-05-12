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
    version: '2.2.0',
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
      versionCode: 2200
    },
    ios: {
      bundleIdentifier: 'com.lyfplanner',
      buildNumber: '2.2.0',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
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
        projectId: process.env.EAS_PROJECT_ID
      }
    }
  }
};
