import { post } from "./axios";
import { getAsyncData } from "./asyncStorage";

export async function saveUserData(user: any) {
  console.log("Calling update endpoint");
  var url = `${process.env.REACT_APP_BACKEND_URL}/updateUser`;

  var token = await getAsyncData("token");
  // Update will only be successful if token matches user being updated!
  var result = await post(url, { user, token });
  if (result.status === 200) return true;
  else {
    console.log(result);
    throw new Error(`Issue saving user data, server returned ${result.status}`);
  }
}
