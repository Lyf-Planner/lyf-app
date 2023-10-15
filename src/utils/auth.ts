import { get } from "./axios";
import { formatDateData } from "./dates";
var localStorage = require("localStorage");

export async function login(username: string, password: string) {
  var local = new Date();
  var sent_time = formatDateData(local);

  var url = `${process.env.REACT_APP_BACKEND_URL}/login?user_id=${username}&password=${password}&local_date=${sent_time}`;

  var result = (await get(url)) as any;
  if (result.status === 200) {
    localStorage.setItem("token", result.data.token);
    return result.data.user;
  } else {
    alert("Incorrect password");
  }
}

export async function autologin(token: string) {
  var local = new Date();
  var sent_time = formatDateData(local);

  var url = `${process.env.REACT_APP_BACKEND_URL}/autoLogin?token=${token}&local_date=${sent_time}`;

  var result = (await get(url)) as any;
  if (result.status === 200) return result.data;
  else return null;
}
