import { StyleSheet, Text, View } from 'react-native';
import { eventsBadgeColor, primaryGreen, white, whiteWithOpacity } from 'utils/colours';
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
  callback?: () => void,
  context?: UserListContext,
  item?: LocalItem,
  menuContext?: string,
  bannerColor?: string,
}

export const UserBanner = ({
  user,
  callback,
  context = UserListContext.Friends,
  item,
  menuContext,
  bannerColor,
}: Props) => {
  const { updateModal } = useModal();

  const userHasDisplayName = useMemo(() => 
    user.display_name && 
    user.display_name !== user.id,
    [user]
  );

  const conditionalStyles = {
    main: {
      backgroundColor: bannerColor || eventsBadgeColor,
    }
  }

  return (
    <BouncyPressable
      style={[conditionalStyles.main, styles.main]}
      onPress={() => updateModal(<UserModal user_id={user.id} key={user.id} />)}
    >
      <FontAwesome name="user" size={32} style={{ width: 32, height: 32 }}/>
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
          <FriendAction friend={user as UserFriend} callback={callback} /> // This is an indicator of a poorly written component. Should really be factoring out this logic
        ) : (
          <ItemSocialAction 
            item={item!} 
            item_user={user} 
            menuContext={menuContext} 
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
    alignItems: 'center',
    height: 75,
    gap: 4,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',

    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
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
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  mainAliasText: { fontWeight: '500', color: 'black', fontSize: 20 },
  subAliasText: { color: 'rgba(0,0,0,0.5)' }
});
