import { StyleSheet, View } from "react-native";
import { updateFriendship } from "../../../rest/user";
import { useAuth } from "../../../authorisation/AuthProvider";
import { FriendshipAction, primaryGreen } from "../../../utils/constants";
import { useRef, useState } from "react";
import { ActionButton } from "../../../components/AsyncAction";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { BouncyPressable } from "../../../components/BouncyPressable";
import { Loader } from "../../../components/MiscComponents";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";

export const UserAction = ({ user_id }) => {
  const { user } = useAuth();
  const friends = user.social?.friends?.find((x) => x === user_id);
  const requested = user.social?.requested?.find((x) => x === user_id);
  const requested_by = user.social?.friend_requests?.find((x) => x === user_id);
  const blocked = user.social?.blocked?.find((x) => x === user_id);

  if (friends) return <Friend user_id={user_id} />;
  else if (requested) return <Requested user_id={user_id} />;
  else if (requested_by) return <HandleRequest user_id={user_id} />;
  else if (blocked) return null;
  else return <AddFriend user_id={user_id} />;
};

export const Friend = ({ user_id }) => {
  const [loading, setLoading] = useState(false);
  const { updateUser, user } = useAuth();
  const removeFriend = async () => {
    setLoading(true);
    let social = await updateFriendship(user_id, FriendshipAction.Remove);
    social && updateUser({ ...user, social });
    setLoading(false);
  };

  const menu = useRef<any>();

  return (
    <Menu
      name="friend-menu"
      ref={menu}
      renderer={renderers.Popover}
      rendererProps={{
        placement: "top",
        anchorStyle: { backgroundColor: "#bababa" },
      }}
    >
      <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
        <MenuOption
          value={1}
          text="Remove"
          customStyles={{
            optionWrapper: styles.optionWrapper,
            optionText: styles.optionText,
          }}
          onSelect={() => removeFriend()}
        />
      </MenuOptions>
      <MenuTrigger>
        <ActionButton
          title="Friends"
          func={() => {}}
          icon={<AntDesign name="check" color="white" size={18} />}
          color={primaryGreen}
          loadingOverride={loading}
          notPressable
        />
      </MenuTrigger>
    </Menu>
  );
};

export const Requested = ({ user_id }) => {
  const [loading, setLoading] = useState(false);
  const { updateUser, user } = useAuth();
  const cancelRequest = async () => {
    setLoading(true);
    let social = await updateFriendship(user_id, FriendshipAction.Cancel);
    social && updateUser({ ...user, social });
    setLoading(false);
  };

  const menu = useRef<any>();

  return (
    <Menu
      name="friend-menu"
      ref={menu}
      renderer={renderers.Popover}
      rendererProps={{
        placement: "top",
        anchorStyle: { backgroundColor: "#bababa" },
      }}
    >
      <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
        <MenuOption
          value={1}
          text="Cancel"
          customStyles={{
            optionWrapper: styles.optionWrapper,
            optionText: styles.optionText,
          }}
          onSelect={() => cancelRequest()}
        />
      </MenuOptions>
      <MenuTrigger>
        <ActionButton
          title="Requested"
          func={() => {}}
          icon={<FontAwesome5Icon name="arrow-right" color="white" size={18} />}
          color={"rgba(0,0,0,0.5)"}
          loadingOverride={loading}
          notPressable
        />
      </MenuTrigger>
    </Menu>
  );
};

export const AddFriend = ({ user_id }) => {
  const { updateUser, user } = useAuth();
  const addFriend = async () => {
    let social = await updateFriendship(user_id, FriendshipAction.Request);
    social && updateUser({ ...user, social });
  };

  return (
    <ActionButton
      title="Add Friend"
      func={addFriend}
      icon={<FontAwesome5Icon name="plus" color="white" size={18} />}
      color={primaryGreen}
    />
  );
};

export const HandleRequest = ({ user_id }) => {
  const { updateUser, user } = useAuth();
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const acceptRequest = async () => {
    setAccepting(true);
    let social = await updateFriendship(user_id, FriendshipAction.Accept);
    social && updateUser({ ...user, social });
    setAccepting(false);
  };
  const declineRequest = async () => {
    setDeclining(true);
    let social = await updateFriendship(user_id, FriendshipAction.Decline);
    social && updateUser({ ...user, social });
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
          <Loader size={20} />
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
          <Loader size={20} />
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
  optionText: { fontSize: 18 },
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
