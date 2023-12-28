import { DaysOfWeek, offWhite } from "../../utils/constants";
import { StyleSheet, View } from "react-native";
import { Day } from "./DayDisplay";

export const Routine = ({ items }) => {
  return (
    <View style={styles.weekWrapper}>
      <View style={styles.weekDaysWrapperView}>
        {Object.values(DaysOfWeek).map((x) => (
          <Day
            key={x}
            day={x}
            items={items.filter((y) => y.day ===  x)}
            template
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weekWrapper: {
    marginHorizontal: 16,
    marginTop: 15,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  weekDateDisplayContainer: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",
  },
  weekDateDisplayTouchable: {
    marginTop: 6,

    borderRadius: 10,
  },
  weekDatePressable: {
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: "column",
  },
  weekDateText: {
    fontWeight: "600",
    fontSize: 18,
    padding: 2,
  },
  showAllPressable: {
    backgroundColor: "rgb(21, 128, 61)",
    marginLeft: "auto",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 0.5,
  },
  showAllText: {
    color: "white",
    fontSize: 15,
  },
  weekDaysWrapperView: {
    flexDirection: "column",
    gap: 16,

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});
