import env from "../envManager";
import { getAsyncData } from "./asyncStorage";
import { post } from "./axios";

export async function deleteMe(password: string) {
  var url = `${env.BACKEND_URL}/deleteMe`;

  var token = await getAsyncData("token");
  // Update will only be successful if token matches user being updated, and re-entered pass is correct.

  var result = await post(url, { token, password });
  if (result.status === 200) return true;
  else {
    throw new Error(`Issue deleting user, server returned ${result.status}`);
  }
}
