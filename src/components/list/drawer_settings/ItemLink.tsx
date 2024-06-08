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

export const HTTP_PREFIX = 'http://';
export const HTTPS_PREFIX = 'https://';

export const ItemLink = ({
  item,
  updateItem,
  setLinkOpen,
  invited,
  updateSheetMinHeight
}) => {
  const [submitted, setSubmitted] = useState(!!item.url);
  const [localText, setText] = useState(item.url);

  function isValidHttpUrl(string) {
    let url: URL | undefined;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
  }

  const updateUrl = (url) => {
    url = url?.toLowerCase();
    // Add https if missing either http or https
    if (
      url &&
      url.slice(0, HTTP_PREFIX.length) !== HTTP_PREFIX &&
      url.slice(0, HTTPS_PREFIX.length) !== HTTPS_PREFIX
    ) {
      url = HTTPS_PREFIX + url;
    }

    if (invited) {
      return;
    }
    updateItem({ ...item, url });
    if (url && isValidHttpUrl(url)) {
      setSubmitted(true);
    }
  };

  return (
    <View style={[styles.mainContainer]}>
      <MaterialIcons name="link" size={20} />
      <Text style={[styles.fieldText]}>Link</Text>
      <View style={styles.inputWrapper}>
        <TouchableHighlight
          onPress={() => {
            updateUrl(null);
            setLinkOpen(false);
          }}
          underlayColor={'rgba(0,0,0,0.5)'}
          style={styles.closeTouchable}
        >
          <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
        </TouchableHighlight>
        {submitted ? (
          <TouchableHighlight
            style={styles.previewText}
            underlayColor={'rgba(0,0,0,0.5)'}
            onPress={() => {
              if (isValidHttpUrl(item.url) && Linking.canOpenURL(item.url)) {
                Linking.openURL(item.url);
              }
            }}
          >
            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
              {item.url}
            </Text>
          </TouchableHighlight>
        ) : (
          <TextInput
            value={localText}
            onEndEditing={() => {
              updateSheetMinHeight(100);
              updateUrl(localText);
            }}
            placeholder="Type Link"
            onFocus={() => updateSheetMinHeight(700)}
            onBlur={() => updateSheetMinHeight(100)}
            returnKeyType="done"
            onChangeText={!invited && setText}
            style={styles.input}
          />
        )}
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
  fieldText: { fontSize: 20, fontWeight: '500', fontFamily: 'InterSemi' },
  inputWrapper: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  closeTouchable: { borderRadius: 5 },
  input: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 6,
    width: 200,
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'center'
  },
  previewText: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 8,
    width: 210,
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 16,
    textAlign: 'center'
  }
});
