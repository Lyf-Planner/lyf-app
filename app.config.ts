import "dotenv/config";

// Keep secrets such as API keys seperate for visibility sake

export default {
  expo: {
    owner: "ethanhusband",
    name: "Lyf",
    slug: "lyf",
    scheme: "lyf",
    currentFullName: "@ethanhusband/lyf",
    originalFullName: "@ethanhusband/lyf",
    version: "1.2.0",
    icon: "./assets/images/inverted-icon.png",
    orientation: "portrait",
    userInterfaceStyle: "light",
    runtimeVersion: {
      policy: "sdkVersion",
    },
    jsEngine: "hermes",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#fff",
    },
    packagerOpts: {
      sourceExts: ["cjs"],
    },
    updates: {
      url: `https://u.expo.dev/${process.env.EAS_PROJECT_ID}`,
      requestHeaders: {
        "expo-runtime-version": "1.0.0",
        "expo-channel-name": "local",
      },
    },
    assetBundlePatterns: ["**/*"],
    web: {
      favicon: "./assets/images/icon.png",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/bg-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.lyfplanner",
      versionCode: 120,
    },
    ios: {
      bundleIdentifier: "com.lyfplanner",
      buildNumber: "1.2.0",
    },
    plugins: [],
    extra: {
      backendUrl: process.env.BACKEND_URL,
      localBackendPort: process.env.LOCAL_BACKEND_PORT,
      appEnv: process.env.APP_ENV,
      eas: {
        projectId: "2c533ba0-983e-4ef8-abc4-e938b5768a79"
      }
    },
  },
};
