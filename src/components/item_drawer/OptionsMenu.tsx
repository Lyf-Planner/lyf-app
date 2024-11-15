import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { Horizontal } from '@/components/Horizontal';
import { Loader } from '@/components/Loader';
import { Permission } from '@/schema/database/items_on_users';
import { LocalItem } from '@/schema/items';
import { SocialAction } from '@/schema/util/social';
import { useAuthStore } from '@/store/useAuthStore';
import { useTimetableStore } from '@/store/useTimetableStore';
import { blackWithOpacity } from '@/utils/colours';

type Props = {
  item: LocalItem,
  closeDrawer: () => void,
}

export const OptionsMenu = ({ item, closeDrawer }: Props) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { updateItemSocial, removeItem } = useTimetableStore();
  const menuName = useMemo(
    () => `item-options-${item.id}-${item.show_in_upcoming}`,
    []
  );

  if (!user) {
    return null;
  }

  const leaveItem = async () => {
    setLoading(true);
    closeDrawer();
    await updateItemSocial(item, user.id, SocialAction.Remove, item.permission);
    setLoading(false);
  };

  const menu = useRef<Menu>(null);

  return (
    <Menu
      name={menuName}
      ref={menu}
      renderer={renderers.Popover}
      rendererProps={{
        placement: 'top',
        anchorStyle: { backgroundColor: '#bababa' }
      }}
    >
      <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
        {(item.permission !== Permission.Owner || item.collaborative) && (
          <MenuOption
            value={1}
            text="Leave"
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText
            }}
            onSelect={() => leaveItem()}
          />
        )}
        {item.permission === 'Owner' && (
          <Horizontal style={styles.optionSeperator} />
        )}
        {item.permission === 'Owner' && (
          <MenuOption
            value={1}
            text="Delete"
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText
            }}
            onSelect={async () => {
              setLoading(true);
              await removeItem(item);
            }}
          />
        )}
      </MenuOptions>
      <MenuTrigger>
        <View style={styles.triggerWrapper}>
          {loading ? (
            <Loader color="white" size={20} />
          ) : (
            <SimpleLineIcons name="options-vertical" color="white" size={20} />
          )}
        </View>
      </MenuTrigger>
    </Menu>
  );
};

const styles = StyleSheet.create({
  optionSeperator: { marginHorizontal: 5 },
  optionText: { color: blackWithOpacity(0.7), fontSize: 18 },
  optionWrapper: { marginHorizontal: 8, marginVertical: 4 },
  optionsContainer: {
    borderColor: blackWithOpacity(0.5),
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingLeft: 0
  },
  triggerWrapper: { padding: 4 }
});
