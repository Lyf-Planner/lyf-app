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

export const AccountInfo = () => {
  const { user, updateUser } = useAuth();

  const updateEmail = (email: string) => {
    updateUser({ ...user, details: { ...user.details, email } });
  };

  const updateName = (name: string) => {
    updateUser({ ...user, details: { ...user.details, name } });
  };

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
          <DetailsField
            fieldName={"Display Name"}
            fieldValue={
              user.details.name ? (
                <Text style={styles.detailsFieldValueText}>
                  {user.detais.name}
                </Text>
              ) : (
                <AddField func={updateName} name="Name" />
              )
            }
          />
        </View>
        <View style={styles.detailsFieldView}>
          <DetailsField
            fieldName={"Email"}
            fieldValue={
              user.details.email ? (
                <Text style={styles.detailsFieldValueText}>
                  {user.details.email}
                </Text>
              ) : (
                <AddField func={updateEmail} name="Email" />
              )
            }
          />
        </View>
      </View>
    </View>
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
      onPress={() => {
        Alert.prompt(`Add ${name}`, `Please enter your ${name} below`, func);
      }}
    >
      <View style={styles.addFieldView}>
        <Text style={styles.addFieldText}>Add {name}</Text>
        <AntDesign name="pluscircle" color="white" />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 2,
    paddingVertical: 8,
    flexDirection: "column",
    gap: 8,
  },
  detailsFieldView: { flexDirection: "row", alignItems: "center", height: 25 },
  detailsFieldNameText: { fontSize: 16, fontWeight: "500", width: 120 },
  detailsFieldValueText: {
    fontSize: 16,
    width: 150,
    flexDirection: "row",
    alignItems: "center",
  },
  detailsColumn: { flexDirection: "column", gap: 8 },

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
