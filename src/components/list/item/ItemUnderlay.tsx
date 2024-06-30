import { ITEM_STATUS_TO_COLOR, ItemStatus } from '../constants';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { ListItem } from '../../../utils/abstractTypes';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ItemType } from 'schema/database/items';

type Props = {
  item: ListItem;
};

export const ListItemUnderlay = ({ item }: Props) => {
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
      <MaterialIcons name="edit" size={20} style={styles.editIcon} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  playIcon: { marginLeft: 12 },
  editIcon: { marginLeft: 'auto', marginRight: 11, color: 'black' },
  listHiddenBackground: {
    height: 55,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    width: '100%'
  }
});
