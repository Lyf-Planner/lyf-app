import { View, Image, StyleSheet } from 'react-native';
const LOGO = require('../../../assets/images/icon.png');

// export const Tooltip = ({ id, className, children, color = "gray" }  ) => {
//   return (
//     <div className={className} data-tooltip-id={id}>
//       <FaInfoCircle color={color} />
//       <ReactTooltip id={id}>{children}</ReactTooltip>
//     </div>
//   );
// };

type Props = {
  style?: {},
  size: number
}

export const SaveTooltip = ({ style = {}, size }: Props) => {
  return (
    <View style={style}>
      <Image source={LOGO} alt="logo" style={{ width: size, height: size }} />
    </View>
  );
};

const styles = StyleSheet.create({});
