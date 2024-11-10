import { getCalendars } from 'expo-localization';
import { create } from 'zustand';

import { autologin, login, USER_NOT_FOUND } from '@/rest/auth';
import { createUser, deleteMe, saveUser } from '@/rest/user';
import { ID } from '@/schema/database/abstract';
import { ExposedUser, User } from '@/schema/user';
import { deleteAsyncData, getAsyncData } from '@/utils/asyncStorage';
import { validatePassword, validateUsername } from '@/utils/validators';

export interface AuthState {
  lastUpdated: Date;
  loggingIn: boolean;
  user: ExposedUser | null;

  autologin: () => Promise<void>;
  createUser: (username: ID, password: string) => Promise<void>;
  deleteMe: (password: string) => Promise<true | undefined>;
  login: (username: ID, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  syncUser: () => Promise<void>;
  updateUser: (changes: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  lastUpdated: new Date(0),
  loggingIn: false,

  autologin: async () => {
    set({ loggingIn: true });
    get().syncUser();
  },

  createUser: async (username: ID, password: string) => {
    console.log('User not found, creating account')
    set({ loggingIn: false });

    if (!validateUsername(username) || !validatePassword(password)) {
      return;
    }

    // Create new user when valid and not found
    const user = await createUser(username, password);
    set({ user });
  },

  deleteMe: async (password: string) => {
    const success = await deleteMe(password);
    if (success) {
      get().logout();
    }

    return success;
  },

  login: async (username: ID, password: string) => {
    set({ loggingIn: true });
    const user = await login(username, password);

    if (user && user !== USER_NOT_FOUND) {
      get().updateUser(user);
    }

    // returns false if the user does not exist, such that we know to create instead
    return user !== USER_NOT_FOUND;
  },

  logout: async () => {
    await deleteAsyncData('token');
    set({ user: null });
  },

  syncUser: () => getAsyncData('token').then((token) => {
    if (token) {
      autologin().then((user) => {
        if (user) {
          const tz = getCalendars()[0].timeZone || undefined;
          get().updateUser({
            ...user,
            tz
          });
        }
      });
    } else {
      set({ loggingIn: false });
    }
  }),

  updateUser: async (changes: Partial<ExposedUser>) => {
    const prevUser = get().user;
    let newUser;

    if (prevUser) {
      newUser = { ...prevUser, ...changes };
    } else {
      // If there is no user this must be initialising the user
      newUser = changes as ExposedUser;
    }

    set({ user: newUser, lastUpdated: new Date(), loggingIn: false });

    // Rollback if save fails
    const saved = await saveUser(changes);
    if (!saved) {
      set({ user: prevUser });
    }
  }
}));
