import { View, Image, StyleSheet } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
const LOGO = require("../../../assets/images/icon.png");

// export const Tooltip = ({ id, className, children, color = "gray" }  ) => {
//   return (
//     <div className={className} data-tooltip-id={id}>
//       <FaInfoCircle color={color} />
//       <ReactTooltip id={id}>{children}</ReactTooltip>
//     </div>
//   );
// };

export const SaveTooltip = ({ style = {}, size }) => {
  return (
    <View style={style}>
      <Image source={LOGO} alt="logo" style={{ width: size, height: size }} />
    </View>
  );
};

export const PremiumIcon = ({ size = 30 }) => {
  // @ts-ignore
  return <SimpleLineIcons name="diamond" size={size} color={"#2fdce1"} />;
};

const styles = StyleSheet.create({});
