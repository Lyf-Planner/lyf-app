import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

import { fieldPrompt } from 'components/profile/AccountInfo';
import { AddField } from 'components/profile/AddField';
import { DetailsField } from 'components/profile/DetailsField';
import { useAuth } from 'hooks/cloud/useAuth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { validateDisplayName } from 'utils/validators';

export const NameField = () => {
  const { user, updateUser } = useAuth();

  const updateName = (name: string) => {
    if (!validateDisplayName(name)) {
      return;
    }

    updateUser({ display_name: name });
  };

  return (
    <DetailsField
      fieldName={'Display Name'}
      fieldValue={
        user?.display_name ? (
          <View style={styles.occupiedFieldRow}>
            <Text style={styles.detailsFieldValueText} numberOfLines={1}>
              {user.display_name}
            </Text>
            <TouchableHighlight
              style={styles.editPressable}
              testID="Edit-Name"
              underlayColor={'rgba(0,0,0,0.5)'}
              onPress={() => fieldPrompt(updateName, 'Name')}
            >
              <MaterialIcons name="edit" size={18} />
            </TouchableHighlight>
          </View>
        ) : (
          <AddField func={updateName} name="Name" />
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  detailsFieldValueText: {
    alignItems: 'center',
    color: white,
    flexDirection: 'row',
    fontSize: 16
  },

  editPressable: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 4,
    padding: 4
  },
  occupiedFieldRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    width: 220
  }
})
