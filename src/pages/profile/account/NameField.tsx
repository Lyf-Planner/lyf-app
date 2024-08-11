import { useAuth } from "providers/cloud/useAuth";
import { validateDisplayName } from "utils/validators";
import { DetailsField } from "pages/profile/account/DetailsField";
import { View, Text, StyleSheet } from "react-native";
import { TouchableHighlight } from 'react-native-gesture-handler'
import { AddField } from "pages/profile/account/AddField";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { fieldPrompt } from "pages/profile/account/AccountInfo";

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
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white'
  },

  occupiedFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 220,
    gap: 8
  },
  editPressable: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 4
  },
})