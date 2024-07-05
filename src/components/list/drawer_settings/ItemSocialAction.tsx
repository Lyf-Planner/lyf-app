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
  primaryGreen
} from '../../../utils/colours';
import { useMemo, useRef, useState } from 'react';
import { useAuth } from 'providers/cloud/useAuth';
import { useTimetable } from 'providers/cloud/useTimetable';
import { ActionButton } from '../../pressables/AsyncAction';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { ItemRelatedUser, LocalItem } from '../../../schema/items';
import { ID } from '../../../schema/database/abstract';
import { Permission } from '../../../schema/database/items_on_users';
import { SocialAction } from '../../../schema/util/social';

const PERMISSION_COLOR: Record<Permission, string> = {
  Owner: primaryGreen,
  Editor: primaryGreen,
  'Read Only': appleGray
};

type Props = {
  item: LocalItem,
  item_user: ItemRelatedUser
}

export const ItemSocialAction = ({ item, item_user }: Props) => {
  const [loading, setLoading] = useState(false);
  const { updateItemSocial } = useTimetable();
  const { user } = useAuth();

  const hasMenu = useMemo(
    () => (
      !item.invite_pending && (
        item.permission === Permission.Owner || 
        item.permission === Permission.Editor
      )
    ),
    [item.permission]
  );

  const removeUser = async () => {
    setLoading(true);
    if (item.permission === Permission.Editor && item_user.permission !== Permission.ReadOnly) {
      return;
    }

    await updateItemSocial(item, item_user.id, SocialAction.Remove);
    setLoading(false);
  };

  const cancelInvite = async () => {
    setLoading(true);
    await updateItemSocial(item, item_user.id, SocialAction.Cancel);
    setLoading(false);
  };

  const inviteUser = async () => {
    setLoading(true);
    await updateItemSocial(item, item_user.id, SocialAction.Invite);
    setLoading(false);
  };

  const color = PERMISSION_COLOR[item.permission];
  const button = (
    <ActionButton
      title={item_user.permission || 'Invite'}
      func={hasMenu? () => null : inviteUser}
      icon={
        !item.permission && (
          <FontAwesome5Icon name="user-plus" size={16} color="white" />
        )
      }
      color={color}
      notPressable={hasMenu}
      loadingOverride={loading}
      textColor={item_user.invite_pending ? 'black' : 'white'}
    />
  );

  const menu = useRef<any>();

  if (hasMenu) {
    return (
      <Menu
        name={`item-user-${item_user.id}-menu`}
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
          <MenuOption
            value={1}
            text={item.permission === Permission.Owner ? 'Leave' : 'Remove'}
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText
            }}
            onSelect={item_user.invite_pending ? cancelInvite : removeUser}
          />
        </MenuOptions>
        <MenuTrigger>{button}</MenuTrigger>
      </Menu>
    );
  } else {
    return button;
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
  optionWrapper: { marginVertical: 4, marginHorizontal: 8 },
  optionText: { fontSize: 18, color: 'rgba(0,0,0,0.7)' },
  optionSeperator: { marginHorizontal: 5 }
});
