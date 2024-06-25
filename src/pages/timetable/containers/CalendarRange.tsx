import { BouncyPressable } from "components/pressables/BouncyPressable";
import * as Native from 'react-native';

type CalendarProps = {
  onLongPress?: () => void;
  children: JSX.Element | JSX.Element[]
}

export const CalendarRange = ({ onLongPress, children }: CalendarProps) => {
  return (
    <BouncyPressable
      style={styles.weekDateDisplayTouchable}
      onLongPress={onLongPress}
    >
      <Native.View style={styles.weekDateDisplayContainer}>
        <Native.View style={styles.weekDatePressable}>
          {children}
        </Native.View>
      </Native.View>
    </BouncyPressable>
  );
}

const styles = Native.StyleSheet.create({
  weekDateDisplayContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center'
  },
  weekDateDisplayTouchable: {
    marginTop: 16,
    marginHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10
  },
  weekDatePressable: {
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
})
