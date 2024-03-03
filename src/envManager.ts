import Constants from "expo-constants";
const { manifest2 } = Constants;

function envVar(varName: string, subvar_name: string = null) {
  return manifest2?.extra?.expoClient?.extra?.[varName];
}

function parseBackendUrl() {
  // Adaptable function to use debugger and IP as hostname in a local environment,
  // Otherwise use full URL
  if (envVar("appEnv") !== "local") {
    console.log("Deriving Backend hostname from supplied variable");
    return envVar("backendUrl");
  }

  console.log("Deriving Backend hostname locally");
  const extractIPfromURL = (url: string) => {
    const x = url.split("/");
    // Skip the / in the http prefix to extract the hostname of the debugger
    const y = x[2];
    // Seperate the IP and port
    const ip_host = y.split(":");
    // Return just the IP
    return ip_host[0];
  };

  // The IP address of the machine hosting the expo app can be found in manifest2.launchAsset or manifest.debuggerHost
  // Which one is present depends on which of manifest or manifest2 is null - which varies across environments
  var debuggerUrl = manifest2.launchAsset.url;

  // Retrieve IP from URL
  var ip = extractIPfromURL(debuggerUrl);

  // Must be http if local
  return "http://" + ip.concat(`:${envVar("localBackendPort")}`);
}

enum env {
  APP_ENV = envVar("appEnv"),
  BACKEND_URL = parseBackendUrl() as any,
  PROJECT_ID = envVar("eas", "projectId") as any,
}

export default env;
