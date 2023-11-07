import { View, Text, Alert } from "react-native";
import { Dropdown } from "../../../components/Dropdown";
import { useAuth } from "../../../authorisation/AuthProvider";
import { TouchableHighlight } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import { primaryGreen } from "../../../utils/constants";

export const ProfileDropdown = () => {
  const { data, updateData } = useAuth();
  const updateEmail = (email: string) => {
    updateData({ ...data, email });
  };

  return (
    <Dropdown
      name="My Account"
      touchableHightlightExtraStyles={{ paddingLeft: 2 }}
      extraStyles={{ paddingLeft: 2 }}
      boldTitle
    >
      <View style={{ flexDirection: "column", gap: 4 }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 25 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500", width: 100 }}>
            Username{" "}
          </Text>
          <Text style={{ fontSize: 16 }}>{data.user_id}</Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 25 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500", width: 100 }}>
            Premium{" "}
          </Text>
          <Text
            style={{
              fontSize: 16,
              opacity: data.premium?.enabled ? 1 : 0.5,
              width: 100,
            }}
          >
            {data.premium?.enabled ? "Activated" : "Not activated"}
          </Text>
        </View>
        <View
          style={{ flexDirection: "row", alignItems: "center", height: 25 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "500", width: 100 }}>
            Email{" "}
          </Text>
          <Text
            style={{ fontSize: 16, opacity: data.email ? 1 : 0.5, width: 150 }}
          >
            {data.email || "N/A"}
          </Text>
          {!data.email && <AddEmail func={updateEmail} />}
        </View>
      </View>
    </Dropdown>
  );
};

const AddEmail = ({ func }: any) => {
  return (
    <TouchableHighlight
      style={{ borderRadius: 10 }}
      onPress={() => {
        Alert.prompt("Add Email", "Please enter your email below", func);
      }}
    >
      <View
        style={{
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 10,
          backgroundColor: primaryGreen,
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Add Email</Text>
        <AntDesign name="pluscircle" color="white" />
      </View>
    </TouchableHighlight>
  );
};
