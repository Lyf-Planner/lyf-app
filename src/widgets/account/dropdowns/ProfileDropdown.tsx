import { View, Text, Alert, StyleSheet } from "react-native";
import { SettingDropdown } from "../../../components/SettingDropdown";
import { useAuth } from "../../../authorisation/AuthProvider";
import { TouchableHighlight } from "react-native-gesture-handler";
import { primaryGreen } from "../../../utils/constants";
import { SettingsDropdowns } from "../AccountDropdowns";

import AntDesign from "react-native-vector-icons/AntDesign";

export const ProfileDropdown = ({ settingOpen, setOpen }) => {
  const { data, updateData } = useAuth();
  const updateEmail = (email: string) => {
    updateData({ ...data, email });
  };

  return (
    <SettingDropdown
      name="My Account"
      touchableHightlightExtraStyles={{ paddingLeft: 2 }}
      boldTitle
      open={settingOpen === SettingsDropdowns.Profile}
      onPress={() => setOpen(SettingsDropdowns.Profile)}
    >
      <View style={styles.detailsColumn}>
        <DetailsField
          fieldName={"Username"}
          fieldNull={!data.user_id}
          fieldValue={data.user_id}
        />
        <DetailsField
          fieldName={"Premium"}
          fieldNull={!data.premium?.enabled}
          fieldValue={data.premium?.enabled ? "Activated" : "Not activated"}
        />
        <View style={styles.detailsFieldView}>
          <DetailsField
            fieldName={"Email"}
            fieldNull={!data.email}
            fieldValue={data.email || "N/A"}
          />
          {!data.email && <AddEmail func={updateEmail} />}
        </View>
      </View>
    </SettingDropdown>
  );
};

const DetailsField = ({ fieldName, fieldValue, fieldNull }) => {
  const opacityStyle = { opacity: fieldNull ? 0.5 : 1 };

  return (
    <View style={styles.detailsFieldView}>
      <Text style={styles.detailsFieldNameText}>{fieldName}</Text>
      <Text style={[styles.detailsFieldValueText, opacityStyle]}>
        {fieldValue}
      </Text>
    </View>
  );
};

const AddEmail = ({ func }: any) => {
  return (
    <TouchableHighlight
      style={styles.addEmailTouchable}
      onPress={() => {
        Alert.prompt("Add Email", "Please enter your email below", func);
      }}
    >
      <View style={styles.addEmailView}>
        <Text style={styles.addEmailText}>Add Email</Text>
        <AntDesign name="pluscircle" color="white" />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  detailsFieldView: { flexDirection: "row", alignItems: "center", height: 25 },
  detailsFieldNameText: { fontSize: 16, fontWeight: "500", width: 100 },
  detailsFieldValueText: { fontSize: 16, width: 150 },
  detailsColumn: { flexDirection: "column", gap: 4 },

  addEmailView: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: primaryGreen,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  addEmailTouchable: { borderRadius: 10 },
  addEmailText: { color: "white" },
});
