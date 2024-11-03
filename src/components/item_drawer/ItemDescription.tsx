import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { offWhite } from 'utils/colours';
import { ItemDrawerProps } from 'utils/item';

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
  addDescriptionContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    flexDirection: 'row',
    left: 10,
    marginLeft: 'auto',
    padding: 8.75,
    position: 'relative'
  },
  addDescriptionText: {
    fontSize: 16,
    textAlignVertical: 'center'
  },
  headerCloseWrapper: { marginLeft: 'auto', marginRight: 10 },
  headingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 35
  },
  headingText: { fontFamily: 'Lexend', fontSize: 20 },
  itemDesc: {
    backgroundColor: offWhite,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    height: 150,
    padding: 8
  },
  mainContainer: {
    flexDirection: 'column',
    gap: 8,
    zIndex: 0
  }
});
