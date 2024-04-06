import { StyleSheet, View } from "react-native";
import { useAuth } from "../../../authorisation/AuthProvider";
import { FriendshipAction, primaryGreen } from "../../../utils/constants";
import { useState } from "react";
import { ActionButton } from "../../../components/pressables/AsyncAction";
import { BouncyPressable } from "../../../components/pressables/BouncyPressable";
import { Loader } from "../../../components/general/MiscComponents";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import {
  AllWidgets,
  useWidgetNavigator,
} from "../../../hooks/useWidgetNavigator";
import { useModal } from "../../../hooks/useModal";
import {
  LyfMenu,
  MenuPopoverPlacement,
  PopoverMenuOption,
} from "../../../components/menus/LyfMenu";

export const FriendAction = ({ user_id }) => {
  const { user } = useAuth();
  const { setWidget } = useWidgetNavigator();
  const { updateModal } = useModal();
  const friends = user.social?.friends?.find((x) => x === user_id);
  const requested = user.social?.requested?.find((x) => x === user_id);
  const requested_by = user.social?.requests?.find((x) => x === user_id);
  const blocked = user.social?.blocked?.find((x) => x === user_id);

  if (user_id === user.id)
    return (
      <ActionButton
        title="You"
        func={() => {
          setWidget(AllWidgets.Account);
          updateModal(null);
        }}
        icon={null}
        color={primaryGreen}
      />
    );
  else if (friends) return <Friend user_id={user_id} />;
  else if (requested) return <Requested user_id={user_id} />;
  else if (requested_by) return <HandleRequest user_id={user_id} />;
  else if (blocked) return null;
  else return <AddFriend user_id={user_id} />;
};

export const Friend = ({ user_id }) => {
  const [loading, setLoading] = useState(false);
  const { updateFriendship } = useAuth();
  const removeFriend = async () => {
    setLoading(true);
    await updateFriendship(user_id, FriendshipAction.Remove);
    setLoading(false);
  };

  const menuOptions: PopoverMenuOption[] = [
    {
      text: "❌ Remove",
      onSelect: () => removeFriend(),
    },
  ];

  return (
    <LyfMenu
      options={menuOptions}
      placement={MenuPopoverPlacement.Top}
      name={`requested-menu-${user_id}`}
    >
      <ActionButton
        title="Friends"
        func={() => {}}
        icon={<AntDesign name="check" color="white" size={20} />}
        color={primaryGreen}
        loadingOverride={loading}
        notPressable
      />
    </LyfMenu>
  );
};

export const Requested = ({ user_id }) => {
  const [loading, setLoading] = useState(false);
  const { updateFriendship } = useAuth();
  const cancelRequest = async () => {
    setLoading(true);
    await updateFriendship(user_id, FriendshipAction.Cancel);
    setLoading(false);
  };

  const menuOptions: PopoverMenuOption[] = [
    {
      text: "❌ Cancel",
      onSelect: () => cancelRequest(),
    },
  ];

  return (
    <LyfMenu
      options={menuOptions}
      placement={MenuPopoverPlacement.Top}
      name={`requested-menu-${user_id}`}
    >
      <ActionButton
        title="Sent"
        func={() => {}}
        icon={<FontAwesome5Icon name="arrow-right" color="white" size={18} />}
        color={"rgba(0,0,0,0.5)"}
        loadingOverride={loading}
        notPressable
      />
    </LyfMenu>
  );
};

export const AddFriend = ({ user_id }) => {
  const { updateFriendship } = useAuth();
  const addFriend = async () => {
    await updateFriendship(user_id, FriendshipAction.Request);
  };

  return (
    <ActionButton
      title="Add"
      func={addFriend}
      icon={<FontAwesome5Icon name="plus" color="white" size={18} />}
      color={primaryGreen}
    />
  );
};

export const HandleRequest = ({ user_id }) => {
  const { updateFriendship } = useAuth();
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const acceptRequest = async () => {
    setAccepting(true);
    await updateFriendship(user_id, FriendshipAction.Accept);
    setAccepting(false);
  };
  const declineRequest = async () => {
    setDeclining(true);
    await updateFriendship(user_id, FriendshipAction.Decline);
    setDeclining(false);
  };

  return (
    <View style={styles.handleRequestMain}>
      <BouncyPressable
        containerStyle={styles.handleRequestPressableContainer}
        style={[
          styles.handleRequestPressable,
          { backgroundColor: primaryGreen },
        ]}
        onPress={acceptRequest}
      >
        {accepting ? (
          <Loader size={20} color="white" />
        ) : (
          <FontAwesome5Icon name="plus" color="white" size={18} />
        )}
      </BouncyPressable>
      <BouncyPressable
        containerStyle={styles.handleRequestPressableContainer}
        style={[styles.handleRequestPressable, { backgroundColor: "red" }]}
        onPress={declineRequest}
      >
        {declining ? (
          <Loader size={20} color="white" />
        ) : (
          <Entypo name="cross" color="white" size={24} />
        )}
      </BouncyPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    paddingLeft: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.5)",
  },
  optionWrapper: { marginVertical: 4, marginHorizontal: 8 },
  optionText: { fontSize: 18, color: "rgba(0,0,0,0.7)" },
  optionSeperator: { marginHorizontal: 5 },

  handleRequestMain: { flexDirection: "row", gap: 4, height: "100%" },
  handleRequestPressable: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  handleRequestPressableContainer: { flex: 1, height: "100%" },
});
