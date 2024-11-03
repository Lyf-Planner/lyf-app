import { StyleSheet, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ItemStatus } from 'schema/database/items';
import { ItemType } from 'schema/database/items';
import { LocalItem } from 'schema/items';
import { ITEM_STATUS_TO_COLOR } from 'utils/item';

import { Loader } from './Loader';

type Props = {
  item: LocalItem;
  drawerLoading: boolean;
};

export const ListItemUnderlay = ({ item, drawerLoading }: Props) => {
  const gradientStart = { x: 0, y: 0 };
  const gradientEnd = { x: 1, y: 0 };
  const gradientColors = [ITEM_STATUS_TO_COLOR[ItemStatus.InProgress], 'white'];

  const conditionalStyles = {
    listHiddenBackground: {
      borderRadius: item.type !== ItemType.Task ? 5 : 15
    }
  };

  return (
    <LinearGradient
      colors={gradientColors}
      start={gradientStart}
      end={gradientEnd}
      style={[
        conditionalStyles.listHiddenBackground,
        styles.listHiddenBackground
      ]}
    >
      <FontAwesome5 name="play" size={20} style={styles.playIcon} />
      {drawerLoading ? (
        <View style={styles.editIcon}>
          <Loader size={18} />
        </View>
      ) : (
        <MaterialIcons name="edit" size={20} style={styles.editIcon} />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  editIcon: { color: black, marginLeft: 'auto', marginRight: 11 },
  listHiddenBackground: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    height: 55,
    position: 'absolute',
    width: '100%'
  },
  playIcon: { marginLeft: 12 }
});
