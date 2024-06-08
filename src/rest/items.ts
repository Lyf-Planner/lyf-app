import { get, post } from './axios';
import env from '../envManager';

export async function getItems(item_ids: string[]) {
  const url = `${env.BACKEND_URL}/getItems`;
  const body = { item_ids };

  const result = await post(url, body);
  const items = result.data;
  if (result?.status === 200) {
    return items;
  } else {
    alert(result.data);
  }
}

export async function getItem(id: string) {
  const url = `${env.BACKEND_URL}/getItem?id=${id}`;

  const result = await get(url);
  const item = result.data;
  if (result?.status === 200) {
    return item;
  } else {
    alert(result.data);
  }
}

export async function updateItem(item) {
  const url = `${env.BACKEND_URL}/updateItem`;

  const body = {
    id: item.id,
    title: item.title,
    type: item.type,
    status: item.status,
    date: item.date,
    day: item.day,
    time: item.time,
    tz: item.tz,
    end_time: item.end_time,
    url: item.url,
    location: item.location,
    show_in_upcoming: item.show_in_upcoming,
    desc: item.desc,
    notifications: item.notifications
  };
  const result = await post(url, body);
  if (result?.status === 200) {
    return item;
  } else {
    alert(result.data);
    return false;
  }
}

export async function createItem(item) {
  const url = `${env.BACKEND_URL}/createItem`;

  const body = {
    id: item.id,
    template_id: item.template_id,
    title: item.title,
    type: item.type,
    status: item.status,
    date: item.date,
    day: item.day,
    time: item.time,
    tz: item.tz,
    end_time: item.end_time,
    url: item.url,
    location: item.location,
    show_in_upcoming: item.show_in_upcoming,
    desc: item.desc,
    notifications: item.notifications,
    permitted_users: item.permitted_users
  };
  const result = await post(url, body);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
    return false;
  }
}

export async function deleteItem(id) {
  const url = `${env.BACKEND_URL}/deleteItem?item_id=${id}`;

  const result = await get(url);
  if (result?.status === 200) {
    return;
  } else {
    alert(result.data);
  }
}

export async function updateItemSocial(item_id, user_id, action) {
  const url = `${env.BACKEND_URL}/updateItemSocial`;

  const result = await post(url, { item_id, user_id, action });
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(JSON.stringify(result.data));
    return false;
  }
}
