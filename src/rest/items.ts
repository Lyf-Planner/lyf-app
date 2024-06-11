import { get, post } from './axios';
import env from '../envManager';
import { SocialAction } from 'schema/social';
import { Permission } from 'schema/database/items_on_users';
import { ID } from 'schema/database/abstract';
import { UserRelatedItem } from 'schema/user';

export async function getTimetable(user_id: string, start_date: string) {
  const url = `${env.BACKEND_URL}/item/timetable`;
  const body = { user_id, start_date };

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

export async function updateItem(changes: Partial<UserRelatedItem>) {
  const url = `${env.BACKEND_URL}/item/update`;

  const result = await post(url, changes);
  if (result?.status === 200) {
    return result;
  } else {
    alert(result.data);
    return false;
  }
}

export async function createItem(item: UserRelatedItem) {
  const url = `${env.BACKEND_URL}/createItem`;

  const body: UserRelatedItem = {
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
  };
  const result = await post(url, body);
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
    return false;
  }
}

export async function deleteItem(id: ID) {
  const url = `${env.BACKEND_URL}/deleteItem?item_id=${id}`;

  const result = await get(url);
  if (result?.status === 200) {
    return;
  } else {
    alert(result.data);
  }
}

export async function updateItemSocial(item_id: ID, user_id: ID, action: SocialAction, permission?: Permission) {
  const url = `${env.BACKEND_URL}/item/updateSocial`;

  const result = await post(url, { 
    item_id, 
    user_id, 
    action, 
    permission
  });
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(JSON.stringify(result.data));
    return false;
  }
}
