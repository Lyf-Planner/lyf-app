import { useMemo, useRef, useState } from 'react';
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
import { Permission } from '@/schema/database/items_on_users';
import { ItemRelatedUser, LocalItem } from '@/schema/items';
import { NoteRelatedUser } from '@/schema/notes';
import { UserFriend, UserRelatedNote } from '@/schema/user';
import { SocialAction } from '@/schema/util/social';
import { useAuthStore } from '@/store/useAuthStore';
import { useNoteStore } from '@/store/useNoteStore';
import { useTimetableStore } from '@/store/useTimetableStore';
import {
  black,
  blackWithOpacity,
  eventsBadgeColor,
  primaryGreen,
  white
} from '@/utils/colours';
import { SocialEntityType } from '@/utils/misc';

type SocialUser = ItemRelatedUser | UserFriend | NoteRelatedUser

type Props = {
  entity: LocalItem | UserRelatedNote,
  type: SocialEntityType;
  user: SocialUser,
  menuContext?: string,
  height?: number
}

export const SocialActionButton = ({ entity, type, user, menuContext, height }: Props) => {
  const { user: currentUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { updateItemSocial } = useTimetableStore();
  const { updateNoteSocial } = useNoteStore();

  // We don't useMemo here as this primarily functions as a typeguard
  const isEntityMember = (user: SocialUser): user is (ItemRelatedUser | NoteRelatedUser) =>
    (user as ItemRelatedUser).permission !== undefined

  const applyAction = async (action: SocialAction, permission: Permission) => {
    setLoading(true);

    switch (type) {
      case 'item':
        console.log('updating user social on item', action, user.id)
        await updateItemSocial(entity as LocalItem, user.id, action, permission);
        break;
      case 'note':
        console.log('updating user social on note', action, user.id)
        await updateNoteSocial(entity as UserRelatedNote, user.id, action, permission);
        break;
      default:
        console.error('Invalid social entity type', { type })
    }

    setLoading(false);
  }

  const removeUser = async () => {
    if (!isEntityMember(user)) {
      return;
    }

    applyAction(SocialAction.Remove, user.permission);
  };

  const cancelInvite = async () => {
    if (!isEntityMember(user)) {
      return;
    }

    applyAction(SocialAction.Cancel, user.permission);
  };

  const inviteUser = () => applyAction(SocialAction.Invite, Permission.Editor);

  const buttonTitle = useMemo(() => {
    if (isEntityMember(user)) {
      if (user.invite_pending) {
        return 'Invited'
      }

      return user.permission
    }

    return 'Invite'
  }, [user])

  const button = (
    <ActionButton
      title={buttonTitle}
      func={isEntityMember(user) ? () => null : inviteUser}
      color={isEntityMember(user) && user.invite_pending ? eventsBadgeColor : primaryGreen}
      notPressable={isEntityMember(user)}
      isAsync={true}
      loadingOverride={loading}
      height={height}
      textColor={isEntityMember(user) && user.invite_pending ? black : white}
    />
  );

  const menu = useRef<Menu>(null);

  const hasMenu = false; // TODO LYF-637: Ditch the react-native-popup-menu package (awful stuff lads)
  // useMemo(() =>
  //   (entity.permission === Permission.Owner) ||
  //   (currentUser?.id === user?.id),
  // [entity, user])

  if (isEntityMember(user) && hasMenu) {
    console.log('rendering menu', entity.permission === Permission.Owner && currentUser?.id !== user?.id);

    return (
      <Menu
        name={`item-user-${user.id}-menu-${menuContext}`}
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
          {(entity.permission === Permission.Owner && currentUser?.id !== user?.id) && (
            <MenuOption
              text={user.invite_pending ? 'Cancel' : 'Remove'}
              customStyles={{
                optionWrapper: styles.optionWrapper,
                optionText: styles.optionText
              }}
              onSelect={user.invite_pending ? cancelInvite : removeUser}
            />
          )}
          {(currentUser?.id === user?.id) &&
            <MenuOption
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
