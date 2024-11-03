import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Alert,
  Platform
} from 'react-native';
import { useAuth } from 'hooks/cloud/useAuth';
import { DetailsField } from 'components/profile/DetailsField';
import { NameField } from 'components/profile/NameField';

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
  main: {
    paddingHorizontal: 2,
    paddingVertical: 8,
    flexDirection: 'column',
    gap: 8
  },
  detailsFieldView: { flexDirection: 'row', alignItems: 'center', height: 25 },
  detailsFieldNameText: { fontSize: 16, fontFamily: 'InterSemi', width: 120, color: 'white' },
  detailsFieldValueText: {
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white',
  },
  detailsColumn: { flexDirection: 'column', gap: 8 },
});
