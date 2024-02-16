import { get, post } from "./axios";
import env from "../envManager";

export async function getItems(item_ids: string[]) {
  var url = `${env.BACKEND_URL}/getItems`;
  var body = { item_ids };

  var result = await post(url, body);
  var items = result.data;
  if (result?.status === 200) {
    return items;
  } else {
    alert(result.data);
  }
}

export async function getItem(id: string) {
  var url = `${env.BACKEND_URL}/getItem?id=${id}`;

  var result = await get(url);
  var item = result.data;
  if (result?.status === 200) {
    return item;
  } else {
    alert(result.data);
  }
}

export async function updateItem(item) {
  var url = `${env.BACKEND_URL}/updateItem`;

  var body = {
    id: item.id,
    title: item.title,
    type: item.type,
    status: item.status,
    date: item.date,
    day: item.day,
    time: item.time,
    desc: item.desc,
    notifications: item.notifications,
  };
  var result = await post(url, body);
  if (result?.status === 200) {
    return item;
  } else {
    alert(result.data);
    return false;
  }
}

export async function createItem(item) {
  var url = `${env.BACKEND_URL}/createItem`;

  var result = await post(url, item);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
    return false;
  }
}

export async function deleteItem(id) {
  var url = `${env.BACKEND_URL}/deleteItem?item_id=${id}`;

  var result = await get(url);
  if (result?.status === 200) {
    return;
  } else {
    alert(result.data);
  }
}

export async function updateItemSocial(item_id, user_id, action) {
  var url = `${env.BACKEND_URL}/updateItemSocial`;

  var result = await post(url, { item_id, user_id, action });
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
    return false;
  }
}
