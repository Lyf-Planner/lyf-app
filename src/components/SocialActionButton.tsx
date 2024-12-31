import { useMemo, useState } from 'react';

import { ActionButton } from '@/components/ActionButton';
import { BouncyPressable } from '@/components/BouncyPressable';
import { LyfMenu } from '@/containers/LyfMenu';
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
  eventsBadgeColor,
  primaryGreen,
  white
} from '@/utils/colours';
import { isTemplate } from '@/utils/item';
import { SocialEntityType } from '@/utils/misc';

type SocialUser = ItemRelatedUser | UserFriend | NoteRelatedUser

type Props = {
  entity: LocalItem | UserRelatedNote,
  type: SocialEntityType;
  user: SocialUser,
  height?: number
}

export const SocialActionButton = ({ entity, type, user, height }: Props) => {
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

  const hasMenu = useMemo(() =>
    (entity.permission === Permission.Owner) ||
    (currentUser?.id === user?.id),
  [entity, user])

  if (isEntityMember(user) && hasMenu) {
    const menuOptions = [];

    if (entity.permission === Permission.Owner && currentUser?.id !== user?.id) {
      menuOptions.push({
        text: user.invite_pending ? 'Cancel' : 'Remove',
        onSelect: user.invite_pending ? cancelInvite : removeUser
      })
    }

    // If this is me, ensure the statement item => !template is also true so I don't leave a template instance
    if (currentUser?.id === user?.id && (type !== 'item' || !isTemplate(entity as LocalItem))) {
      menuOptions.push({
        text: 'Leave',
        onSelect: removeUser
      })
    }

    return (
      <LyfMenu
        options={menuOptions}
      >
        {button}
      </LyfMenu>
    );
  } else {
    return (
      <BouncyPressable>
        {button}
      </BouncyPressable>
    )
  }
};
