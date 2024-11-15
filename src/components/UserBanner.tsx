import { useMemo } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { BouncyPressable } from '@/components/BouncyPressable';
import { FriendAction } from '@/components/FriendActions';
import { ItemSocialAction } from '@/components/item_drawer/ItemSocialAction';
import { UserListContext } from '@/containers/UserList';
import { UserModal } from '@/containers/UserModal';
import { ItemRelatedUser, LocalItem } from '@/schema/items';
import { NoteRelatedUser } from '@/schema/notes';
import { PublicUser, UserFriend } from '@/schema/user';
import { useModal } from '@/shell/useModal';
import { black, blackWithOpacity, deepBlueOpacity, eventsBadgeColor, whiteWithOpacity } from '@/utils/colours';

type Props = {
  user: UserFriend | ItemRelatedUser | NoteRelatedUser | PublicUser,
  callback?: () => void,
  context?: UserListContext,
  item?: LocalItem,
  menuContext?: string,
}

export const UserBanner = ({
  user,
  callback,
  context = UserListContext.Friends,
  item,
  menuContext
}: Props) => {
  const { updateModal } = useModal();

  const userHasDisplayName = useMemo(() =>
    user.display_name &&
    user.display_name !== user.id,
  [user]
  );

  const isItemUser = (user: PublicUser | ItemRelatedUser): user is ItemRelatedUser => {
    return 'permission' in user && user.permission !== undefined;
  }

  return (
    <BouncyPressable
      style={styles.main}
      onPress={() => updateModal(<UserModal user_id={user.id} key={user.id} />)}
    >
      <FontAwesome name="user" size={30} style={styles.userIcon} color={eventsBadgeColor} />
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
        {context === UserListContext.Friends && (
          <FriendAction
            friend={user as UserFriend}
            callback={callback}
            height={45}
          />
        )}

        {context === UserListContext.Item && isItemUser(user) && (
          <ItemSocialAction
            item={item!}
            item_user={user}
            menuContext={menuContext}
            height={45}
          />
        )}
      </View>
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  actionWrapper: {
    borderRadius: 50,
    marginLeft: 'auto',

    shadowColor: black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    width: 100
  },
  main: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: deepBlueOpacity(Platform.OS !== 'ios' ? 0.9 : 0.75),
    borderColor: blackWithOpacity(0.3),
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'row',
    height: 65,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 16,

    shadowColor: black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    width: '100%'
  },
  mainAliasText: { color: eventsBadgeColor, fontSize: 20, fontWeight: '500' },
  nameRow: {
    flexDirection: 'column',
    flex: 1,
    gap: 2,
    paddingRight: 10
  },
  subAliasText: { color: whiteWithOpacity(0.5) },
  userIcon: {
    alignSelf: 'center',
    height: 32,
    width: 32
  }
});
