import { create } from 'zustand';

import { getUser, updateFriendship as updateRemoteFriendship } from '@/rest/user';
import { ID } from '@/schema/database/abstract';
import { ExposedUser, UserFriend } from '@/schema/user';
import { FriendshipAction } from '@/schema/util/social';
import { AuthState, useAuthStore } from '@/store/useAuthStore';

type FriendsState = {
  friends: UserFriend[];
  loading: boolean;
  reload: () => void;
  updateFriendship: (user_id: ID, action: FriendshipAction) => Promise<void>
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  loading: true,

  reload: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      return;
    }

    const self: ExposedUser = await getUser(user?.id, 'users');
    set({ friends: self.relations?.users || [], loading: false });
  },

  updateFriendship: async (user_id: ID, action: FriendshipAction) => {
    const { user } = useAuthStore.getState();
    if (!user) {
      return;
    }

    const { friends } = get()
    const i = friends.findIndex((x) => x.id === user_id);
    const localFriendExists = i !== -1;

    const friend = await updateRemoteFriendship(user_id, action);
    const tmp = [...friends];
    if (localFriendExists && friend) {
      tmp[i] = friend;
    } else if (friend) {
      tmp.push(friend);
    } else {
      // friend comes from the API, it being null implies it should no longer exist
      tmp.splice(i, 1);
    }

    set({ friends: tmp });
  }
}));

// listeners
useAuthStore.subscribe((state: AuthState, prevState: AuthState) => {
  // initialise notes store in response to authorisation
  if (state.user && !prevState.user) {
    useFriendsStore.getState().reload();
  }
});

