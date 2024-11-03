import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Alert,
  Platform
} from 'react-native';

import { DetailsField } from 'components/profile/DetailsField';
import { NameField } from 'components/profile/NameField';
import { useAuth } from 'hooks/cloud/useAuth';

export const AccountInfo = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <View style={styles.main}>
      <View style={styles.detailsColumn}>
        <DetailsField
          fieldName={'Username'}
          fieldValue={
            <Text style={styles.detailsFieldValueText}>{user.id}</Text>
          }
        />
        <View style={styles.detailsFieldView}>
          <NameField />
        </View>

      </View>
    </View>
  );
};

export const fieldPrompt = (func: (data: string) => void, name: string) => {
  if (Platform.OS === 'web') {
    const result = prompt(`Please enter your ${name} below`);
    if (result) {
      func(result);
    }
  }

  Alert.prompt(`Add ${name}`, `Please enter your ${name} below`, func);
};

const styles = StyleSheet.create({
  detailsColumn: { flexDirection: 'column', gap: 8 },
  detailsFieldNameText: { color: white, fontFamily: 'InterSemi', fontSize: 16, width: 120 },
  detailsFieldValueText: {
    alignItems: 'center',
    color: white,
    flexDirection: 'row',
    fontSize: 16
  },
  detailsFieldView: { alignItems: 'center', flexDirection: 'row', height: 25 },
  main: {
    flexDirection: 'column',
    gap: 8,
    paddingHorizontal: 2,
    paddingVertical: 8
  }
});
