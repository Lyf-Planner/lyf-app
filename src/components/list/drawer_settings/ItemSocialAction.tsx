import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { StyleSheet } from "react-native";
import {
  Permission,
  SocialAction,
  appleGray,
  primaryGreen,
} from "../../../utils/constants";
import { useMemo, useRef, useState } from "react";
import { useAuth } from "../../../authorisation/AuthProvider";
import { useItems } from "../../../hooks/useItems";
import { ActionButton } from "../../pressables/AsyncAction";
import { getItemPermission } from "../constants";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const PERMISSION_COLOR = {
  Owner: primaryGreen,
  Editor: primaryGreen,
  Invited: appleGray,
};

export const ItemSocialAction = ({ item, user_id }) => {
  const [loading, setLoading] = useState(false);
  const { updateItemSocial } = useItems();
  const { user } = useAuth();
  let permission = useMemo(
    () => item && getItemPermission(item, user_id),
    [item?.permitted_users, item?.invited_users, loading]
  );
  let myPermission = useMemo(
    () => item && getItemPermission(item, user.id),
    [item?.permitted_users, item?.invited_users]
  );
  const hasMenu = useMemo(
    () => myPermission === "Owner" && permission,
    [myPermission, permission]
  );

  const removeUser = async () => {
    setLoading(true);
    await updateItemSocial(item, user_id, SocialAction.Remove);
    setLoading(false);
  };

  const cancelInvite = async () => {
    setLoading(true);
    await updateItemSocial(item, user_id, SocialAction.Cancel);
    setLoading(false);
  };

  const inviteUser = async () => {
    setLoading(true);
    await updateItemSocial(item, user_id, SocialAction.Invite);
    setLoading(false);
  };

  const color = PERMISSION_COLOR[permission as any] || primaryGreen;
  const button = (
    <ActionButton
      title={permission || "Invite"}
      func={permission ? () => {} : inviteUser}
      icon={
        !permission && (
          // @ts-ignore
          <FontAwesome5Icon name="user-plus" size={16} color="white" />
        )
      }
      color={color}
      notPressable={hasMenu}
      loadingOverride={loading}
      textColor={permission === Permission.Invited ? "black" : "white"}
    />
  );

  const menu = useRef<any>();

  if (hasMenu)
    return (
      <Menu
        name={`item-user-${user_id}-menu`}
        ref={menu}
        renderer={renderers.Popover}
        rendererProps={{
          placement: "top",
          anchorStyle: { backgroundColor: "#bababa" },
        }}
      >
        <MenuOptions
          customStyles={{ optionsContainer: styles.optionsContainer }}
        >
          <MenuOption
            value={1}
            text={permission === Permission.Owner ? "Leave" : "Remove"}
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText,
            }}
            onSelect={
              permission === Permission.Invited ? cancelInvite : removeUser
            }
          />
        </MenuOptions>
        <MenuTrigger>{button}</MenuTrigger>
      </Menu>
    );
  else return button;
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
});
