import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { offWhite } from 'utils/colours';
import { useEffect, useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ItemDrawerProps } from '../ItemDrawer';

type Props = ItemDrawerProps & {
  setDescOpen: (open: boolean) => void;
  updateSheetMinHeight: (height: number) => void;
}

export const ItemDescription = ({
  item,
  updateItem,
  setDescOpen,
  updateSheetMinHeight
}: Props) => {
  const [desc, setDesc] = useState(item.desc);

  const uploadDescription = () => {
    if (item.invite_pending) {
      return;
    }

    updateItem(item, { desc });
  };

  const clearField = () => updateItem(item, { desc: undefined });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headingContainer}>
        <MaterialIcons name="edit" size={20} />
        <Text style={styles.headingText}>Description</Text>
        <View style={styles.headerCloseWrapper}>
          <TouchableHighlight
            disabled={item.invite_pending}
            onPress={() => {
              setDescOpen(false);
              clearField();
            }}
            underlayColor={'rgba(0,0,0,0.5)'}
            style={{ borderRadius: 5 }}
          >
            <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
          </TouchableHighlight>
        </View>
      </View>

      <TextInput
        value={desc}
        onChangeText={(text: string) => {
          if (!item.invite_pending) { 
            setDesc(text)
          }
        }}
        onFocus={() => updateSheetMinHeight(800)}
        onBlur={() => {
          updateSheetMinHeight(100);
          uploadDescription();
        }}
        style={styles.itemDesc}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    gap: 8,
    zIndex: 0
  },
  headingContainer: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headingText: { fontSize: 20, fontFamily: 'Lexend' },
  headerCloseWrapper: { marginLeft: 'auto', marginRight: 10 },
  itemDesc: {
    height: 150,
    backgroundColor: offWhite,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    fontSize: 16
  },
  addDescriptionContainer: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginLeft: 'auto',
    padding: 8.75,
    position: 'relative',
    left: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  addDescriptionText: {
    fontSize: 16,
    textAlignVertical: 'center'
  }
});
