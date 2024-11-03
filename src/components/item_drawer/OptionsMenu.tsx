import { useMemo, useRef, useState } from 'react';
import { useAuth } from 'hooks/cloud/useAuth';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { StyleSheet, View } from 'react-native';
import { Horizontal } from 'components/Horizontal';
import { useTimetable } from 'hooks/cloud/useTimetable';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { LocalItem } from 'schema/items';
import { SocialAction } from 'schema/util/social';
import { Permission } from 'schema/database/items_on_users';
import { Loader } from 'components/Loader';

type Props = {
  item: LocalItem,
  closeDrawer: () => void,
}

export const OptionsMenu = ({ item, closeDrawer }: Props) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { updateItemSocial, removeItem } = useTimetable();
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

  const menu = useRef<any>();

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
        <View style={{ padding: 4 }}>
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
