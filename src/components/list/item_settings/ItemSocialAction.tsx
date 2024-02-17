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
import { ActionButton } from "../../AsyncAction";
import { getItemPermission } from "../constants";

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
    [item?.permitted_users, item?.invited_users]
  );
  let myPermission = useMemo(
    () => item && getItemPermission(item, user.id),
    [item?.permitted_users, item?.invited_users]
  );

  const removeUser = async () => {
    setLoading(true);
    await updateItemSocial(
      item,
      user_id,
      permission === Permission.Invited
        ? SocialAction.Cancel
        : SocialAction.Remove
    );
    setLoading(false);
  };

  const color = PERMISSION_COLOR[permission as any];
  const button = (
    <ActionButton
      title={permission}
      func={() => {}}
      icon={null}
      color={color}
      loadingOverride={loading}
      notPressable
      textColor={permission === Permission.Invited ? "black" : "white"}
    />
  );

  const menu = useRef<any>();

  if (myPermission === "Owner")
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
          {permission === "Owner" ? (
            <MenuOption
              value={1}
              text="Leave"
              customStyles={{
                optionWrapper: styles.optionWrapper,
                optionText: styles.optionText,
              }}
              onSelect={() => removeUser()}
            />
          ) : (
            <MenuOption
              value={1}
              text="Remove"
              customStyles={{
                optionWrapper: styles.optionWrapper,
                optionText: styles.optionText,
              }}
              onSelect={() => removeUser()}
            />
          )}
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
