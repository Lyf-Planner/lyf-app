import "dotenv/config";

// Keep secrets such as API keys seperate for visibility sake

export default {
  expo: {
    owner: "ethanhusband",
    name: "Lyf",
    slug: "lyf",
    scheme: "lyf",
    currentFullName: "@user/lyf",
    originalFullName: "@user/lyf",
    version: "1.0.0",
    icon: "./assets/images/bg-icon.png",
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
      package: "com.bouldermate",
      versionCode: 100,
    },
    ios: {
      bundleIdentifier: "com.bouldermate",
      buildNumber: "1.0.0",
      infoPlist: {
        NSCameraUsageDescription:
          "This app uses the camera to record climbs and upload routes.",
        NSPhotoLibraryUsageDescription:
          "This app uses the photo library to upload climbs and route images.",
      },
      usesAppleSignIn: true,
    },
    plugins: [],
    extra: {
      backendUrl: process.env.BACKEND_URL,
      localBackendPort: process.env.LOCAL_BACKEND_PORT,
      appEnv: process.env.APP_ENV,
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
  },
};
