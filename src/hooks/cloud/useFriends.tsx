import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { ExposedUser, UserFriend } from 'schema/user';
import { updateFriendship as updateRemoteFriendship, getUser } from 'rest/user';
import { ID } from 'schema/database/abstract';
import { FriendshipAction } from 'schema/util/social';
import { useAuth } from './useAuth';
import { useCloud } from './cloudProvider';

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
    if (!user) return;

    if (initialised) {
      setSyncing(true);
    }
    
    const self: ExposedUser = await getUser(user?.id, "users");
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
    } else if (!!friend) {
      tmp.push(friend);
    } else if (localFriendExists) {
      tmp.splice(i, 1);
    } else {
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

const FriendsContext = createContext<FriendHooks>(undefined as any); // TODO: Do this better

export const useFriends = () => {
  return useContext(FriendsContext);
};
