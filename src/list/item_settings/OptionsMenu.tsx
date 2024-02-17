import { useRef, useState } from "react";
import { useAuth } from "../../authorisation/AuthProvider";
import { SocialAction } from "../../utils/constants";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { StyleSheet, View } from "react-native";
import { Horizontal, Loader } from "../../components/MiscComponents";
import { useItems } from "../../hooks/useItems";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

export const OptionsMenu = ({ item }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { updateItemSocial, removeItem } = useItems();
  const permission = item.permitted_users.find(
    (x) => x.user_id === user.id
  )?.permissions;

  const leaveItem = async () => {
    setLoading(true);
    await updateItemSocial(item, user.id, SocialAction.Remove);
    setLoading(false);
  };

  const menu = useRef<any>();

  return (
    <Menu
      name="item-options-menu"
      ref={menu}
      renderer={renderers.Popover}
      rendererProps={{
        placement: "top",
        anchorStyle: { backgroundColor: "#bababa" },
      }}
    >
      <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
        {!(permission === "Owner" && item.permitted_users.length === 1) && (
          <MenuOption
            value={1}
            text="Leave"
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText,
            }}
            onSelect={() => leaveItem()}
          />
        )}
        {permission === "Owner" && (
          <Horizontal style={styles.optionSeperator} />
        )}
        {permission === "Owner" && (
          <MenuOption
            value={1}
            text="Delete"
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText,
            }}
            onSelect={async () => {
              setLoading(true);
              await removeItem(item);
            }}
          />
        )}
      </MenuOptions>
      <MenuTrigger>
        <View style={{ padding: 4 }}>
          {loading ? (
            <Loader color="white" size={20} />
          ) : (
            <SimpleLineIcons name="options-vertical" color="white" size={20} />
          )}
        </View>
      </MenuTrigger>
    </Menu>
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
});
