import { LocationObject } from 'expo-location';

import { get, post } from '@/rest/_axios';
import { ID } from '@/schema/database/abstract';
import { Permission } from '@/schema/database/items_on_users';
import { ItemRelatedUser } from '@/schema/items';
import { UserRelatedItem } from '@/schema/user';
import { SocialAction } from '@/schema/util/social';

const itemsEndpoint = (req: string) => `/items/${req}`;

export async function getTimetable(user_id: string, start_date: string) {
  const endpoint = itemsEndpoint(`timetable?user_id=${user_id}&start_date=${start_date}`);

  const result = await get(endpoint);
  const items = result.data;
  if (result?.status === 200) {
    return items;
  } else {
    alert(result.data);
  }
}

export async function getWeather(start_date: string, end_date: string, location?: LocationObject) {
  if (!location) {
    return [];
  }

  const lat = location.coords.latitude;
  const lon = location.coords.longitude;
  const endpoint = itemsEndpoint(`timetableWeather?start_date=${start_date}&end_date=${end_date}&lat=${lat}&lon=${lon}`);

  const result = await get(endpoint);

  const weatherData = result.data;
  if (result?.status === 200) {
    return weatherData;
  } else {
    alert(result.data);
  }
}

export async function getItem(id: string, include: string) {
  const endpoint = itemsEndpoint(`get?id=${id}&include=${include}`);

  const result = await get(endpoint);
  const item = result.data;
  if (result?.status === 200) {
    return item;
  } else {
    alert(result.data);
  }
}

export async function updateItem(changes: Partial<UserRelatedItem>) {
  const endpoint = itemsEndpoint('update');

  const result = await post(endpoint, changes);
  if (result?.status === 200) {
    return result;
  } else {
    console.error(JSON.stringify(result))
    alert(JSON.stringify(result.data));
    return false;
  }
}

export async function createItem(item: UserRelatedItem) {
  const endpoint = itemsEndpoint('create');

  const result = await post(endpoint, item);
  if (result?.status === 201) {
    return result.data;
  } else {
    console.error(JSON.stringify(result.data))
    alert(JSON.stringify(result.data));
    return false;
  }
}

export async function deleteItem(id: ID) {
  const endpoint = itemsEndpoint(`delete?item_id=${id}`)

  const result = await get(endpoint);
  if (result?.status === 204) {
    return;
  } else {
    console.error(result.data)
    alert(result.data);
  }
}

export async function updateItemSocial(entity_id: ID, user_id: ID, action: SocialAction, permission?: Permission) {
  const endpoint = itemsEndpoint('updateSocial')

  const result = await post(endpoint, {
    entity_id,
    user_id,
    action,
    permission
  });
  if (result?.status === 200) {
    return result.data as ItemRelatedUser;
  } else {
    alert(JSON.stringify(result.data));
    return false;
  }
}
