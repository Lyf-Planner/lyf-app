import { StyleSheet, Text, View } from 'react-native';
import { eventsBadgeColor } from 'utils/colours';
import { FriendAction } from '../../pages/friends/FriendActions';
import { BouncyPressable } from '../pressables/BouncyPressable';
import { ItemSocialAction } from '../list/drawer_settings/ItemSocialAction';
import { useModal } from 'providers/overlays/useModal';
import { UserModal } from './UserModal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { UserFriend } from 'schema/user';
import { ItemRelatedUser, LocalItem } from 'schema/items';
import { useMemo } from 'react';
import { NoteRelatedUser } from 'schema/notes';
import { UserListContext } from './UserList';

type Props = {
  user: UserFriend | ItemRelatedUser | NoteRelatedUser,
  context?: UserListContext,
  item?: LocalItem
}

export const UserBanner = ({
  user,
  context = UserListContext.Friends,
  item
}: Props) => {
  const { updateModal } = useModal();

  const userHasDisplayName = useMemo(() => user.display_name && user.display_name !== user.id, [user]);

  return (
    <BouncyPressable
      style={styles.main}
      onPress={() => updateModal(<UserModal user_id={user.id} />)}
    >
      <FontAwesome name="user" size={24} />
      <View style={styles.nameRow}>
        {userHasDisplayName &&
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={styles.mainAliasText}
          >
            {user.display_name}
          </Text>
        }
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={userHasDisplayName ? styles.subAliasText : styles.mainAliasText}
        >
          {user.id}
        </Text>
      </View>

      <View style={styles.actionWrapper}>
        {context === UserListContext.Friends ? (
          <FriendAction friend={user as UserFriend} /> // This is an indicator of a poorly written component. Should really be factoring out this logic
        ) : (
          <ItemSocialAction item={item!} item_user={user as ItemRelatedUser} />
        )}
      </View>
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: 70,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: eventsBadgeColor,
    borderRadius: 10,

    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 1
  },
  nameRow: { flexDirection: 'column', gap: 2, width: '55%' },
  actionWrapper: {
    marginLeft: 'auto',
    width: 110,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  mainAliasText: { fontSize: 22, fontWeight: '500' },
  subAliasText: { fontSize: 14, color: 'rgba(0,0,0,0.5)' }
});
