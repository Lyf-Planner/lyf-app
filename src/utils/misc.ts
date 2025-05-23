export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type SocialEntityType = 'item' | 'note';

export const unreachable = () => {
  throw new Error('unreachable!')
};
