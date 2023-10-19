import { View, Image, StyleSheet } from "react-native";

const LOGO = require("../../src/assets/icon.png");

// export const Tooltip = ({ id, className, children, color = "gray" }: any) => {
//   return (
//     <div className={className} data-tooltip-id={id}>
//       <FaInfoCircle color={color} />
//       <ReactTooltip id={id}>{children}</ReactTooltip>
//     </div>
//   );
// };

export const SaveTooltip = ({ lastSave, id, className }: any) => {
  return (
    <View data-tooltip-id={id}>
      <Image source={LOGO} alt="logo" />
    </View>
  );
};

const styles = StyleSheet.create({

})

