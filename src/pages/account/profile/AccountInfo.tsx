import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Alert,
} from "react-native";
import { useAuth } from "../../../authorisation/AuthProvider";
import { primaryGreen } from "../../../utils/constants";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { validateDisplayName } from "../../../utils/validators";

export const AccountInfo = () => {
  const { user, updateUser } = useAuth();

  return (
    <View style={styles.main}>
      <View style={styles.detailsColumn}>
        <DetailsField
          fieldName={"Username"}
          fieldValue={
            <Text style={styles.detailsFieldValueText}>{user.id}</Text>
          }
        />
        <View style={styles.detailsFieldView}>
          <NameField user={user} updateUser={updateUser} />
        </View>

        <View style={styles.detailsFieldView}>
          <EmailField user={user} updateUser={updateUser} />
        </View>
      </View>
    </View>
  );
};

export const NameField = ({ user, updateUser }) => {
  const updateName = (name: string) => {
    if (!validateDisplayName(name)) return;
    updateUser({ ...user, details: { ...user.details, name } });
  };

  return (
    <DetailsField
      fieldName={"Display Name"}
      fieldValue={
        user.details?.name ? (
          <View style={styles.occupiedFieldRow}>
            <Text style={styles.detailsFieldValueText} numberOfLines={1}>
              {user.details?.name}
            </Text>
            <TouchableHighlight
              style={styles.editPressable}
              testID="Edit-Name"
              underlayColor={"rgba(0,0,0,0.5)"}
              onPress={() => fieldPrompt(updateName, "Name")}
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

export const EmailField = ({ user, updateUser }) => {
  const updateEmail = (email: string) => {
    if (!(email.includes("@") && email.includes("."))) {
      Alert.alert("Try Again", "This is not a valid email format");
    }
    updateUser({ ...user, details: { ...user.details, email } });
  };

  return (
    <DetailsField
      fieldName={"Email"}
      fieldValue={
        user.details?.email ? (
          <View style={styles.occupiedFieldRow}>
            <Text style={styles.detailsFieldValueText} numberOfLines={1}>
              {user.details?.email}
            </Text>
            <TouchableHighlight
              style={styles.editPressable}
              testID="Edit-Email"
              underlayColor={"rgba(0,0,0,0.5)"}
              onPress={() => fieldPrompt(updateEmail, "Email")}
            >
              <MaterialIcons name="edit" size={18} />
            </TouchableHighlight>
          </View>
        ) : (
          <AddField func={updateEmail} name="Email" />
        )
      }
    />
  );
};

const DetailsField = ({ fieldName, fieldValue }) => {
  return (
    <View style={styles.detailsFieldView}>
      <Text style={styles.detailsFieldNameText}>{fieldName}</Text>
      {fieldValue}
    </View>
  );
};

const AddField = ({ func, name }) => {
  return (
    <TouchableHighlight
      style={styles.addFieldTouchable}
      onPress={() => fieldPrompt(func, name)}
    >
      <View style={styles.addFieldView}>
        <Text style={styles.addFieldText}>Add {name}</Text>
        <AntDesign name="pluscircle" color="white" />
      </View>
    </TouchableHighlight>
  );
};

const fieldPrompt = (func, name) => {
  Alert.prompt(`Add ${name}`, `Please enter your ${name} below`, func);
};

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 2,
    paddingVertical: 8,
    flexDirection: "column",
    gap: 8,
  },
  detailsFieldView: { flexDirection: "row", alignItems: "center", height: 25 },
  detailsFieldNameText: { fontSize: 16, fontFamily: "InterSemi", width: 120 },
  detailsFieldValueText: {
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  detailsColumn: { flexDirection: "column", gap: 8 },

  occupiedFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    width: 220,
  },
  editPressable: {
    marginLeft: "auto",
    padding: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
  },
  addFieldView: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: primaryGreen,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  addFieldTouchable: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  addFieldText: { color: "white" },
});
