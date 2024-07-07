import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { useAuth } from 'providers/cloud/useAuth';
import { useNotifications } from 'providers/cloud/useNotifications';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ItemDrawerProps } from '../ItemDrawer';

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

    if (minsOverride === null) {
      updateItem(item, { notification_mins: undefined });
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
        style={[
          styles.notifyText,
          { fontWeight: enabled && item.time ? '500' : '400' }
        ]}
      >
        Notify Me
      </Text>

      {!!mins && (
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
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 10,
    height: 35
  },
  notifyText: { fontSize: 20, fontWeight: '500', fontFamily: 'InterSemi' },
  minutesInputWrapper: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  closeTouchable: { borderRadius: 5 },
  minutesInput: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 6,
    width: 45,
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'center'
  },
  minsBeforeText: { fontSize: 18, fontWeight: '200' }
});
