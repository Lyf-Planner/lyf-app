import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { StyleSheet } from 'react-native';
import {
  appleGray,
  black,
  primaryGreen,
  white
} from '../../utils/colours';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useAuth } from 'hooks/cloud/useAuth';
import { useTimetable } from 'hooks/cloud/useTimetable';
import { ActionButton } from 'components/ActionButton';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { ItemRelatedUser, LocalItem } from '../../schema/items';
import { ID } from '../../schema/database/abstract';
import { Permission } from '../../schema/database/items_on_users';
import { SocialAction } from '../../schema/util/social';
import { UserFriend } from 'schema/user';
import { NoteRelatedUser } from 'schema/notes';
import { BouncyPressable } from 'components/BouncyPressable';
import { Horizontal } from 'components/Horizontal';

const PERMISSION_COLOR: Record<Permission, string> = {
  Owner: primaryGreen,
  Editor: primaryGreen,
  'Read Only': appleGray
};

type SocialUser = ItemRelatedUser | UserFriend | NoteRelatedUser 

type Props = {
  item: LocalItem,
  item_user: SocialUser,
  menuContext?: string,
  height?: number
}

export const ItemSocialAction = ({ item, item_user, menuContext, height }: Props) => {
  const [loading, setLoading] = useState(false);
  const { updateItemSocial } = useTimetable();
  const { user } = useAuth();

  // We don't useMemo here as this primarily functions as a typeguard
  const isItemMember = (user: SocialUser): user is (ItemRelatedUser | NoteRelatedUser) => 
    (user as ItemRelatedUser).permission !== undefined

  const removeUser = async () => {
    if (!isItemMember(item_user)) {
      return;
    }

    setLoading(true);
    await updateItemSocial(item, item_user.id, SocialAction.Remove, item_user.permission);
    setLoading(false);
  };

  const cancelInvite = async () => {
    if (!isItemMember(item_user)) {
      return;
    }

    setLoading(true);
    await updateItemSocial(item, item_user.id, SocialAction.Cancel, item_user.permission);
    setLoading(false);
  };

  const inviteUser = async () => {
    setLoading(true);
    await updateItemSocial(item, item_user.id, SocialAction.Invite, Permission.Editor);
    setLoading(false);
  };

  const buttonTitle = useMemo(() => {
    if (isItemMember(item_user)) {
      if (item_user.invite_pending) {
        return 'Invited'
      }

      return item_user.permission
    }
    
    return 'Invite'
  }, [item_user])

  const button = (
    <ActionButton
      title={buttonTitle}
      func={isItemMember(item_user) ? () => null : inviteUser}
      color={isItemMember(item_user) && item_user.invite_pending ? white : primaryGreen}
      notPressable={isItemMember(item_user)}
      isAsync={true}
      loadingOverride={loading}
      height={height}
      textColor={isItemMember(item_user) && item_user.invite_pending ? black : white}
    />
  );

  const menu = useRef<any>();

  const hasMenu = useMemo(() => 
    (item.permission === Permission.Owner) ||
    (item_user.id === user?.id), 
    [item, item_user])

  if (isItemMember(item_user) && hasMenu) {
    return (
      <Menu
        name={`item-user-${item_user.id}-menu-${menuContext}`}
        ref={menu}
        renderer={renderers.Popover}
        rendererProps={{
          placement: 'top',
          anchorStyle: { backgroundColor: '#bababa' }
        }}
      >
        <MenuOptions
          customStyles={{ optionsContainer: styles.optionsContainer }}
        >
          {(item.permission === Permission.Owner && item_user.id !== user?.id) &&
            <MenuOption
              value={1}
              text={item_user.invite_pending ? 'Cancel' : 'Remove'}
              customStyles={{
                optionWrapper: styles.optionWrapper,
                optionText: styles.optionText
              }}
              onSelect={item_user.invite_pending ? cancelInvite : removeUser}
            />
          }
          {(item_user.id === user?.id) && 
            <Horizontal style={styles.optionSeperator} />
          }
          {(item_user.id === user?.id) &&
            <MenuOption
              value={2}
              text={'Leave'}
              customStyles={{
                optionWrapper: styles.optionWrapper,
                optionText: styles.optionText
              }}
              onSelect={removeUser}
            />
          }
        </MenuOptions>
        <MenuTrigger customStyles={{
          TriggerTouchableComponent: BouncyPressable
        }}>
          {button}
        </MenuTrigger>
      </Menu>
    );
  } else {
    return (    
      <BouncyPressable>
        {button}
      </BouncyPressable>
    )
  }
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingLeft: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.5)'
  },
  optionWrapper: { marginVertical: 4, marginHorizontal: 8, flexDirection: 'row', justifyContent: 'center' },
  optionText: { fontSize: 18, color: 'rgba(0,0,0,0.7)', fontFamily: 'Lexend' },
  optionSeperator: { marginHorizontal: 5 }
});
