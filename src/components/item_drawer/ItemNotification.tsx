import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import { useAuth } from 'hooks/cloud/useAuth';
import { useNotifications } from 'hooks/cloud/useNotifications';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ItemDrawerProps } from 'utils/item';

type Props = ItemDrawerProps & {
  updateSheetMinHeight: (height: number) => void
}

export const ItemNotification = ({
  item,
  updateItem,
  updateSheetMinHeight
}: Props) => {
  const { enabled } = useNotifications();
  const [mins, setMins] = useState(`${item.notification_mins}`);

  const uploadMinutesFromInput = (minsOverride?: string | null) => {
    if (item.invite_pending) {
      return;
    }

    if (minsOverride === null || mins === '') {
      updateItem(item, { notification_mins: undefined });
      updateSheetMinHeight(100)
      return;
    }

    let parsed = minsOverride || mins;
    if (parsed) {
      parsed = parsed.replace(/[^0-9]/g, '');

      if (!parsed) {
        parsed = '0';
      }
    }

    setMins(parsed);
    updateItem(item, { notification_mins: parseInt(parsed) });
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { opacity: enabled && item.time ? 1 : 0.3 }
      ]}
    >
      <MaterialIcons name="notifications-active" size={20} />
      <Text
        style={styles.notifyText}
      >
        Notify Me
      </Text>

      {!!item.notification_mins && (
        <View style={styles.minutesInputWrapper}>
          <TouchableHighlight
            onPress={() => {
              setMins('');
              uploadMinutesFromInput(null)
            }}
            underlayColor={'rgba(0,0,0,0.5)'}
            style={styles.closeTouchable}
          >
            <Entypo name="cross" color="rgba(0,0,0,0.2)" size={20} />
          </TouchableHighlight>
          <TextInput
            value={mins}
            onEndEditing={() => uploadMinutesFromInput()}
            onFocus={() => updateSheetMinHeight(700)}
            onBlur={() => updateSheetMinHeight(100)}
            returnKeyType="done"
            keyboardType="numeric"
            onChangeText={(text: string) => {
              if (item.invite_pending) {
                return;
              }

              setMins(text)
            }}
            style={styles.minutesInput}
          />
          <Text style={styles.minsBeforeText}>mins before</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  closeTouchable: { borderRadius: 5 },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 35,
    paddingRight: 10
  },
  minsBeforeText: { fontSize: 18, fontWeight: '200' },
  minutesInput: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    fontSize: 16,
    padding: 6,
    textAlign: 'center',
    width: 45
  },
  minutesInputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginLeft: 'auto'
  },
  notifyText: { fontFamily: 'Lexend', fontSize: 20 }
});
