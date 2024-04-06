import { View, Text, StyleSheet } from "react-native";
import { BouncyPressable } from "../../pressables/BouncyPressable";
import { useState } from "react";
import { useAuth } from "../../../authorisation/AuthProvider";
import { useItems } from "../../../hooks/useItems";
import { SocialAction, primaryGreen } from "../../../utils/constants";
import { Loader } from "../../general/MiscComponents";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";

export const InviteHandler = ({ item }) => {
  const { user } = useAuth();
  const { updateItemSocial } = useItems();

  const acceptInvite = async () => {
    await updateItemSocial(item, user.id, SocialAction.Accept);
  };

  const rejectInvite = async () => {
    await updateItemSocial(item, user.id, SocialAction.Decline);
  };

  return (
    <View style={styles.main}>
      <InviteHandleButton
        color={primaryGreen}
        text="Accept"
        icon={<FontAwesome5Icon name="check" size={18} color="white" />}
        func={acceptInvite}
      />
      <InviteHandleButton
        color={"red"}
        text="Decline"
        icon={<AntDesign name="close" size={18} color="white" />}
        func={rejectInvite}
      />
    </View>
  );
};

const InviteHandleButton = ({ func, text, color, icon }) => {
  const [loading, setLoading] = useState(false);

  return (
    <BouncyPressable
      onPress={async () => {
        setLoading(true);
        await func();
        setLoading(false);
      }}
      containerStyle={{ flex: 1 }}
      style={[styles.pressable, { backgroundColor: color }]}
    >
      {loading ? (
        <Loader size={20} color="white" />
      ) : (
        <View style={styles.contentWrapper}>
          <Text style={styles.buttonText}>{text}</Text>
          {icon}
        </View>
      )}
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    height: 50,
    width: "100%",
    gap: 4,

    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  pressable: {
    flex: 1,
    borderRadius: 10,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
