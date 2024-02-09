import { get, post } from "./axios";
import env from "../envManager";

export async function getItems(item_ids: string[]) {
  var url = `${env.BACKEND_URL}/getItems`;
  var body = { item_ids };

  var result = await post(url, body);
  var items = result.data;
  if (result.status === 200) {
    return items;
  } else {
    alert(result.text);
  }
}

export async function getItem(id: string) {
  var url = `${env.BACKEND_URL}/getItem?id=${id}`;

  var result = await get(url);
  var item = result.data;
  if (result.status === 200) {
    return item;
  } else {
    alert(result.text);
  }
}

export async function updateItem(item) {
  var url = `${env.BACKEND_URL}/updateItem`;

  var { last_updated, created, ...body } = item;
  var result = await post(url, body);
  if (result.status === 200) {
    return item;
  } else {
    alert(result.text);
  }
}

export async function createItem(item) {
  var url = `${env.BACKEND_URL}/createItem`;

  var result = await post(url, item);
  if (result.status === 200) {
    return result.data;
  } else {
    alert(result.text);
    return false;
  }
}

export async function deleteItem(id) {
  var url = `${env.BACKEND_URL}/deleteItem?item_id=${id}`;

  var result = await get(url);
  if (result.status === 200) {
    return;
  } else {
    alert(result.text);
  }
}

export async function updateItemSocial(item_id, user_id, action) {
  var url = `${process.env.REACT_APP_BACKEND_URL}/updateItemSocial`;

  var result = await post(url, { item_id, user_id, action });
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.text);
    return false;
  }
}
