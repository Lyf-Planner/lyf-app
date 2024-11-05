import { Platform } from 'react-native';

import Constants from 'expo-constants';
const { manifest, manifest2 } = Constants;

// With expo constants, once Constants.manifest is null, Constants.manifest2 contains the env vars
// Which of these contains data depends on environments (e.g. manifest is populated on web, manifest2 on ios)
// This unifies them into one function call so we don't have to worry about distinguishing elsewhere

function envVar(varName: string, subvar_name?: string) {
  // @ts-expect-error our types expect manifest to not exist, though it often does
  for (const extra of [manifest?.extra, manifest2?.extra]) {
    let result;
    if (subvar_name) {
      result =
        extra?.[varName][subvar_name] ??
        extra?.expoClient?.extra?.[varName][subvar_name];
    } else {
      result = extra?.[varName] ?? extra?.expoClient?.extra?.[varName];
    }
    if (result) {
      return result;
    }
  }

  throw new Error(`Constant ${varName} not found in expo manifest.`);
}

function parseBackendUrl() {
  // Adaptable function to use debugger and IP as hostname in a local environment,
  // Otherwise use full URL
  if (envVar('appEnv') !== 'local') {
    console.log('Deriving Backend hostname from supplied variable');
    return envVar('backendUrl');
  }

  console.log('Deriving Backend hostname locally');
  const extractIPfromURL = (url: string) => {
    const x = url.split('/');
    // Skip the / in the http prefix to extract the hostname of the debugger
    const y = x[2];
    // Seperate the IP and port
    const ip_host = y.split(':');
    // Return just the IP
    return ip_host[0];
  };

  // The IP address of the machine hosting the expo app can be found in manifest2.launchAsset or manifest.debuggerHost
  // Which one is present depends on which of manifest or manifest2 is null - which varies across environments
  const debuggerUrl = manifest
    // @ts-expect-error types expect manifest to not exist
    ? manifest.debuggerHost
    : manifest2?.launchAsset.url;

  // Retrieve IP from URL
  const ip = Platform.OS !== 'ios' ? 'localhost' : extractIPfromURL(debuggerUrl);

  // Must be http if local
  return `http://${ip.concat(`:${envVar('localBackendPort')}`)}`;
}

const getVersion = () => {
  // Extract the version field
  const appVersion =
    // @ts-expect-error types expect manifest to not exist
    Constants.manifest?.version ||
    Constants.manifest2?.extra?.expoClient?.version ||
    '0.0.0';

  console.log('App Version:', appVersion);
  return appVersion;
}

const env = {
  APP_ENV: envVar('appEnv'),
  BACKEND_URL: parseBackendUrl(),
  PROJECT_ID: envVar('eas', 'projectId'),
  VERSION: getVersion()
}

export default env;
