import { StyleSheet, Text, View, Platform } from 'react-native';
import { deepBlueOpacity, eventsBadgeColor, lightGreen, primaryGreen, white, whiteWithOpacity } from 'utils/colours';
import { FriendAction } from '../../pages/friends/FriendActions';
import { BouncyPressable } from '../pressables/BouncyPressable';
import { ItemSocialAction } from '../item/drawer_settings/ItemSocialAction';
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
  menuContext,
}: Props) => {
  const { updateModal } = useModal();

  const userHasDisplayName = useMemo(() => 
    user.display_name && 
    user.display_name !== user.id,
    [user]
  );

  return (
    <BouncyPressable
      style={styles.main}
      onPress={() => updateModal(<UserModal user_id={user.id} key={user.id} />)}
    >
      <FontAwesome name="user" size={30} style={{ width: 32, height: 32, alignSelf: 'center' }} color={eventsBadgeColor} />
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
          <FriendAction 
            friend={user as UserFriend}
            callback={callback}
            height={45}
          />
        ) : (
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
  main: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 65,
    paddingVertical: 16,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    backgroundColor: deepBlueOpacity(Platform.OS !== 'ios' ? 0.9 : 0.7),
    borderColor: 'rgba(0,0,0,0.3)',

    shadowColor: 'black',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  nameRow: { 
    flexDirection: 'column', 
    gap: 2, 
    flex: 1, 
    paddingRight: 10 
  },
  actionWrapper: {
    marginLeft: 'auto',
    width: 100,
    borderRadius: 50,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  mainAliasText: { fontWeight: '500', fontSize: 20, color: eventsBadgeColor },
  subAliasText: { color: 'rgba(255,255,255,0.5)' }
});
