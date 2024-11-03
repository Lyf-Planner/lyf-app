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
import debouncer from 'signature-debouncer';
import { ItemDrawerProps } from 'utils/item';

type Props = ItemDrawerProps & {
  setLocationOpen: (open: boolean) => void;
  updateSheetMinHeight: (height: number) => void;
}

const debounceSignature = 'UpdateLocation';

export const ItemLocation = ({
  item,
  updateItem,
  setLocationOpen,
  updateSheetMinHeight
}: Props) => {
  const [location, setLocation] = useState(item.location);

  const uploadLocation = () => {
    if (item.invite_pending) {
      return;
    }

    updateItem(item, { location });
  };

  const clearField = () => updateItem(item, { location: undefined });

  return (
    <View style={styles.mainContainer}>
      <MaterialIcons name="location-pin" size={20} />
      <Text style={styles.fieldText}>Location</Text>
      <View style={styles.inputWrapper}>
        <TouchableHighlight
          onPress={() => {
            setLocation(undefined);
            clearField();
            setLocationOpen(false);
          }}
          underlayColor={'rgba(0,0,0,0.5)'}
          style={styles.closeTouchable}
        >
          <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
        </TouchableHighlight>

        <TextInput
          value={location}
          onEndEditing={() => {
            updateSheetMinHeight(100)
            uploadLocation();
          }}
          placeholder="Enter Location"
          onFocus={() => updateSheetMinHeight(700)}
          onBlur={() => updateSheetMinHeight(100)}
          returnKeyType="done"
          onChangeText={(text: string) => {
            if (item.invite_pending) {
              return;
            }

            setLocation(text);
          }}
          style={styles.input}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  closeTouchable: { borderRadius: 5 },
  fieldText: {
    fontFamily: 'Lexend',
    fontSize: 20
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    fontSize: 16,
    height: 40,
    marginLeft: 'auto',
    maxWidth: 300,
    minWidth: 150,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center'
  },
  inputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginLeft: 'auto'
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 35
  },
  previewText: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 10,
    flexDirection: 'row',
    fontSize: 16,
    height: 35,
    justifyContent: 'center',
    padding: 6,
    textAlign: 'center',
    width: '50%'
  }
});
