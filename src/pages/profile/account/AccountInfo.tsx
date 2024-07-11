import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Alert
} from 'react-native';
import { useAuth } from 'providers/cloud/useAuth';
import { DetailsField } from 'pages/profile/account/DetailsField';
import { NameField } from 'pages/profile/account/NameField';

export const AccountInfo = () => {
  const { user, updateUser } = useAuth();

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
  detailsFieldNameText: { fontSize: 16, fontFamily: 'InterSemi', width: 120 },
  detailsFieldValueText: {
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailsColumn: { flexDirection: 'column', gap: 8 },
});
