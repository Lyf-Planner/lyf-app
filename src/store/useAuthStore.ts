import { getCalendars } from 'expo-localization';
import { create } from 'zustand';

import { autologin, login, LoginResult } from '@/rest/auth';
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
  login: (username: ID, password: string) => Promise<LoginResult>;
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
    const loginResultIsUser = (loginResult: LoginResult): loginResult is ExposedUser => {
      return !!(loginResult as ExposedUser).id
    }

    const loginResult = await login(username, password);

    console.log('login result is??', loginResult);
    if (loginResultIsUser(loginResult)) {
      get().updateUser(loginResult);
    }

    return loginResult
  },

  logout: async () => {
    await deleteAsyncData('token');
    set({ user: null });
  },

  syncUser: () => getAsyncData('token').then(async (token) => {
    if (token) {
      const user = await autologin();
      if (user) {
        const tz = getCalendars()[0].timeZone || undefined;
        get().updateUser({
          ...user,
          tz
        });
      } else {
        // autologin failed, token must be no good
        console.debug('autologin failed');
        deleteAsyncData('token');
        set({ loggingIn: false });
      }
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
