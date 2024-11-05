import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import { updateFriendship as updateRemoteFriendship, getUser } from 'rest/user';
import { ID } from 'schema/database/abstract';
import { ExposedUser, UserFriend } from 'schema/user';
import { FriendshipAction } from 'schema/util/social';

import { useCloud } from './cloudProvider';
import { useAuth } from './useAuth';

type Props = {
  children: JSX.Element;
}

type FriendHooks = {
  friends: UserFriend[];
  loading: boolean;
  reload: () => void;
  updateFriendship: (user_id: ID, action: FriendshipAction) => Promise<void>
}

export const FriendsProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const { setSyncing } = useCloud();

  const [friends, setFriends] = useState<UserFriend[]>([]);
  const [initialised, setInitialised] = useState(false);

  const reload = useCallback(async () => {
    if (!user) {
      return;
    }

    if (initialised) {
      setSyncing(true);
    }

    const self: ExposedUser = await getUser(user?.id, 'users');
    setFriends(self.relations.users || []);

    if (!initialised) {
      setInitialised(true);
    } else {
      setSyncing(false);
    }
  }, [])

  useEffect(() => {
    reload()
  }, [])

  const updateFriendship = async (user_id: ID, action: FriendshipAction) => {
    if (!user) {
      return;
    }

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

    setFriends(tmp);
  }

  const exposed = {
    friends,
    loading: !initialised,
    reload,
    updateFriendship
  }

  return (
    <FriendsContext.Provider value={exposed}>
      {children}
    </FriendsContext.Provider>
  );
};

const FriendsContext = createContext<FriendHooks>(undefined as never); // TODO: Do this better

export const useFriends = () => {
  return useContext(FriendsContext);
};
