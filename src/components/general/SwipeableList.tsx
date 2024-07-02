import { ScrollView } from "react-native-gesture-handler";
import { LyfElement } from "utils/abstractTypes";


type Props = {
  style?: object;
  containerStyle?: object;
  vertical?: object
  children: LyfElement[];
}

export const SwipeableList = ({
  style,
  containerStyle,
  vertical,
  children
}: Props) => {
  return (
    <ScrollView
      style={{
        flexDirection: 'row'
      }}
    >
      {children}
    </ScrollView>
  )
}