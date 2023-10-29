import { post } from "./axios";
import { getAsyncData } from "./asyncStorage";
import env from "../envManager";
import _ from "lodash";

export async function saveUserData(user: any, token?: string) {
  var url = `${env.BACKEND_URL}/updateUser`;

  var token = token || (await getAsyncData("token"));
  // Update will only be successful if token matches user being updated!

  var result = await post(url, { user, token });
  if (result.status === 200) return true;
  else {
    // These posts may be unsuccessful often, as when the app closes this gets called frequently,
    // and the server throttles the requests - most of the time not actually an issue!
    console.error(`Issue saving user data, server returned ${result.status}`);
  }
}
