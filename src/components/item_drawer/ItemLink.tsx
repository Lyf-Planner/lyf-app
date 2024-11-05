import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Linking
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { blackWithOpacity, blue } from 'utils/colours';
import { ItemDrawerProps } from 'utils/item';

export const HTTP_PREFIX = 'http://';
export const HTTPS_PREFIX = 'https://';

type Props = ItemDrawerProps & {
  setLinkOpen: (open: boolean) => void;
  updateSheetMinHeight: (height: number) => void;
}

export const ItemLink = ({
  item,
  updateItem,
  setLinkOpen,
  updateSheetMinHeight
}: Props) => {
  const [submitted, setSubmitted] = useState(!!item.url);
  const [localText, setText] = useState(item.url);

  function isValidHttpUrl(text: string|undefined) {
    if (!text) {
      return false;
    }

    try {
      new URL(text);
    } catch (err) {
      console.warn({ err });
      return false;
    }

    // We don't just check inclusion of http - as to allow linking to other apps
    // TODO: Review more secure approach to this
    return text.includes('://');
  }

  const uploadUrl = () => {
    if (item.invite_pending) {
      return;
    }

    let url = localText?.toLowerCase();
    // Add https if missing either http or https
    if (
      url &&
      url.slice(0, HTTP_PREFIX.length) !== HTTP_PREFIX &&
      url.slice(0, HTTPS_PREFIX.length) !== HTTPS_PREFIX
    ) {
      url = HTTPS_PREFIX + url;
    }

    updateItem(item, { url });
    if (url && isValidHttpUrl(url)) {
      setSubmitted(true);
    }
  };

  const clearField = () => updateItem(item, { url: undefined });

  return (
    <View style={styles.mainContainer}>
      <MaterialIcons name="link" size={20} />
      <Text style={styles.fieldText}>Link</Text>
      <View style={styles.inputWrapper}>
        <TouchableHighlight
          disabled={item.invite_pending}
          onPress={() => {
            clearField();
            setLinkOpen(false);
          }}
          underlayColor={'rgba(0,0,0,0.5)'}
          style={styles.closeTouchable}
        >
          <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
        </TouchableHighlight>

        {submitted ? (
          <TouchableHighlight
            style={styles.previewTouchable}
            disabled={item.invite_pending}
            underlayColor={'rgba(0,0,0,0.5)'}
            onPress={async () => {
              if (item.url && isValidHttpUrl(item.url) && await Linking.canOpenURL(item.url)) {
                await Linking.openURL(item.url);
              }
            }}
          >
            <Text style={styles.previewText}>
              {item.url}
            </Text>
          </TouchableHighlight>
        ) : (
          <TextInput
            value={localText}
            onEndEditing={() => {
              updateSheetMinHeight(100);
              uploadUrl();
            }}
            placeholder="Enter Link"
            onFocus={() => updateSheetMinHeight(700)}
            onBlur={() => updateSheetMinHeight(100)}
            returnKeyType="done"
            onChangeText={(text: string) => {
              if (item.invite_pending) {
                return;
              }

              setText(text)
            }}
            style={styles.input}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  closeTouchable: { borderRadius: 5 },
  fieldText: { fontFamily: 'Lexend', fontSize: 20 },
  input: {
    backgroundColor: blackWithOpacity(0.08),
    borderRadius: 8,
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'center',
    width: 200
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
    color: blue,
    textDecorationLine: 'underline'
  },
  previewTouchable: {
    alignItems: 'center',
    backgroundColor: blackWithOpacity(0.08),
    borderRadius: 10,
    flexDirection: 'row',
    fontSize: 16,
    height: 35,
    justifyContent: 'center',
    padding: 8,
    textAlign: 'center',
    width: 210
  }
});
