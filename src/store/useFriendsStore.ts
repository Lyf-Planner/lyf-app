import { create } from 'zustand';

type Friend = {
  id: string;
  name: string;
};

type FriendsState = {
  friends: Friend[];
  addFriend: (friend: Friend) => void;
  removeFriend: (id: string) => void;
  updateFriend: (updatedFriend: Friend) => void;
};

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],

  addFriend: (friend) =>
    set((state) => ({ friends: [...state.friends, friend] })),

  removeFriend: (id) =>
    set((state) => ({
      friends: state.friends.filter((friend) => friend.id !== id)
    })),

  updateFriend: (updatedFriend) => {
    const prevState = get().friends;

    set((state) => ({
      friends: state.friends.map((friend) =>
        friend.id === updatedFriend.id ? updatedFriend : friend
      )
    }));

    syncUpdateFriendToApi(updatedFriend).catch(() => {
      set(() => ({ friends: prevState }));
    });
  }
}));

async function syncUpdateFriendToApi(updatedFriend: Friend) {
  const response = await fetch(`/api/friends/${updatedFriend.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedFriend)
  });

  if (!response.ok) {
    throw new Error('Failed to update friend');
  }
}
