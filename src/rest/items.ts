import { get, post } from './axios';
import env from '../envManager';
import { SocialAction } from '../schema/util/social';
import { Permission } from '../schema/database/items_on_users';
import { ID } from '../schema/database/abstract';
import { UserRelatedItem } from '../schema/user';

export async function getTimetable(user_id: string, start_date: string) {
  console.log('getting timetable of', user_id)
  const url = `${env.BACKEND_URL}/item/timetable?user_id=${user_id}&start_date=${start_date}`;

  const result = await get(url);
  const items = result.data;
  if (result?.status === 200) {
    return items;
  } else {
    alert(result.data);
  }
}

export async function getItem(id: string, include: string) {
  const url = `${env.BACKEND_URL}/item/get?id=${id}&include=${include}`;

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
  console.log("update result:", result);
  if (result?.status === 200) {
    return result;
  } else {
    console.error(JSON.stringify(result))
    alert(JSON.stringify(result.data));
    return false;
  }
}

export async function createItem(item: UserRelatedItem) {
  const url = `${env.BACKEND_URL}/item/create`;

  console.log('creating item', item);

  const result = await post(url, item);
  if (result?.status === 201) {
    return result.data;
  } else {
    console.error(JSON.stringify(result))
    alert(JSON.stringify(result.data));
    return false;
  }
}

export async function deleteItem(id: ID) {
  const url = `${env.BACKEND_URL}/item/delete?item_id=${id}`;

  const result = await get(url);
  if (result?.status === 204) {
    return;
  } else {
    console.error(JSON.stringify(result))
    alert(JSON.stringify(result));
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
