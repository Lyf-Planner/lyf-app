import Constants from "expo-constants";
const { manifest, manifest2 } = Constants;

// With expo constants, once Constants.manifest is null, Constants.manifest2 contains the env vars
// Which of these contains data depends on environments
// This unifies them into one function call so we don't have to worry about distinguishing elsewhere
function envVar(varName: string) {
  // Slower but more robust method of finding env var
  for (const extra of [manifest?.extra, manifest2?.extra]) {
    const c = extra?.[varName] ?? extra?.expoClient?.extra?.[varName];
    if (c) return c;
  }
  throw new Error(`Constant ${varName} not found in expo manifest.`);
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
  var debuggerUrl = manifest
    ? manifest.debuggerHost
    : manifest2.launchAsset.url;

  // Retrieve IP from URL
  var ip = extractIPfromURL(debuggerUrl);

  // Must be http if local
  return 'http://' + ip.concat(`:${envVar("localBackendPort")}`);
}
  

enum env {
  BACKEND_URL = parseBackendUrl() as any,
}

export default env;
