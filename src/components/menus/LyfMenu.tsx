import { useRef } from "react";
import { StyleSheet } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import { BouncyPressable } from "../pressables/BouncyPressable";

export type LyfMenuProps = {
  name: string;
  placement: MenuPopoverPlacement;
  children: JSX.Element;
  options: PopoverMenuOption[];
};

export type PopoverMenuOption = {
  text: string;
  key: string;
  onSelect: () => void;
};

export enum MenuPopoverPlacement {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
  Auto = "auto",
}

export const LyfMenu = (props: LyfMenuProps) => {
  const menu = useRef<Menu>();
  const rendererProps = {
    placement: props.placement,
    anchorStyle: { backgroundColor: "#bababa" },
  };

  return (
    <Menu
      name={props.name}
      ref={menu}
      renderer={renderers.Popover}
      rendererProps={rendererProps}
    >
      <MenuOptions
        customStyles={{
          optionsContainer: styles.optionsContainer,
          optionsWrapper: styles.optionsWrapper,
        }}
      >
        {props.options.map((option, i) => (
          <MenuOption
            value={i}
            key={option.key}
            text={option.text}
            customStyles={{
              optionWrapper: styles.optionWrapper,
              optionText: styles.optionText,
            }}
            onSelect={option.onSelect}
          />
        ))}
      </MenuOptions>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: BouncyPressable,
        }}
      >
        {props.children}
      </MenuTrigger>
    </Menu>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "column",
    paddingLeft: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.5)",
  },
  optionsWrapper: { marginVertical: 4 },
  optionWrapper: { marginVertical: 4, marginHorizontal: 8 },
  optionText: { fontSize: 18, color: "rgba(0,0,0,0.7)", textAlign: "right" },
  optionSeperator: { marginHorizontal: 5 },
});
