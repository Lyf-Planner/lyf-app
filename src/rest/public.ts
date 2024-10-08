import { get } from "./_axios";

const publicEndpoint = (req: string) => `/public/${req}`;

export async function getNotices(version: string, exclude: string) {
  const endpoint = publicEndpoint(`notices?version=${version}&exclude=${exclude}`)

  const result = await get(endpoint);
  // We use this to check result is a user and not an error object
  if (result?.status === 200) {
    return result.data;
  } else {
    alert(result.data);
  }
}