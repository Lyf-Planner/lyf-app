import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';

import { ActionButton } from '@/components/ActionButton';
import { BouncyPressable } from '@/components/BouncyPressable';
import { Horizontal } from '@/components/Horizontal';
import { Permission } from '@/schema/database/items_on_users';
import { ItemRelatedUser, LocalItem } from '@/schema/items';
import { NoteRelatedUser } from '@/schema/notes';
import { UserFriend } from '@/schema/user';
import { SocialAction } from '@/schema/util/social';
import { useAuthStore } from '@/store/useAuthStore';
import { useTimetableStore } from '@/store/useTimetableStore';
import {
  black,
  blackWithOpacity,
  primaryGreen,
  white
} from '@/utils/colours';

type SocialUser = ItemRelatedUser | UserFriend | NoteRelatedUser

type Props = {
  item: LocalItem,
  item_user: SocialUser,
  menuContext?: string,
  height?: number
}

export const ItemSocialAction = ({ item, item_user, menuContext, height }: Props) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { updateItemSocial } = useTimetableStore();

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

  const menu = useRef<Menu>(null);

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
  optionSeperator: { marginHorizontal: 5 },
  optionText: {
    color: blackWithOpacity(0.7),
    fontFamily: 'Lexend',
    fontSize: 18
  },
  optionWrapper: { flexDirection: 'row', justifyContent: 'center', marginHorizontal: 8, marginVertical: 4 },
  optionsContainer: {
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingLeft: 0
  }
});
