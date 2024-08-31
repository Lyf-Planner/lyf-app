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
import { ItemDrawerProps } from '../ItemDrawer';
import debouncer from 'signature-debouncer';

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
    <View style={[styles.mainContainer]}>
      <MaterialIcons name="location-pin" size={20} />
      <Text style={[styles.fieldText]}>Location</Text>
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
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 35
  },
  fieldText: { 
    fontSize: 20, 
    fontFamily: 'Lexend' 
  },
  inputWrapper: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  closeTouchable: { borderRadius: 5 },
  input: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    maxWidth: 300,
    minWidth: 150,
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'center',
    marginLeft: 'auto'
  },
  previewText: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 6,
    width: '50%',
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 16,
    textAlign: 'center'
  }
});
