import { post } from "./axios";
import { getAsyncData, storeAsyncData } from "../utils/asyncStorage";
import env from "../envManager";

export async function saveUser(user, token?: string) {
  var url = `${env.BACKEND_URL}/updateUser`;

  var token = token || (await getAsyncData("token"));
  // Update will only be successful if token matches user being updated!

  var { last_updated, created, ...body } = user;
  var result = await post(url, { user: body, token });
  if (result.status === 200) return true;
  else {
    // These posts may be unsuccessful often, as when the app closes this gets called frequently,
    // and the server throttles the requests - most of the time not actually an issue!
    console.error(`Issue saving user data, server returned ${result.status}`);
  }
}

export async function createUser(username: string, password: string) {
  var url = `${env.BACKEND_URL}/createUser`;
  var body = { user_id: username, password };

  var result = await post(url, body);
  if (result.status === 200) {
    console.log("User creation successful", result.data);
    storeAsyncData("token", result.data.token);
    return result.data.user;
  } else if (result.status === 400) {
    // While login and creation come from the same function, this won't (shouldn't) happen
    alert("This username is already taken. Maybe try another?");
  } else if (result.status === 429) {
    alert("Account creation rate is limited to 30 seconds. Please wait");
  }
}

export async function deleteMe(password: string) {
  var url = `${env.BACKEND_URL}/deleteMe`;

  var result = await post(url, { password });
  if (result.status === 200) return true;
  else {
    alert(result.text);
  }
}
