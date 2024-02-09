import { DaysOfWeek, deepBlue } from "../../utils/constants";
import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { Day } from "./DayDisplay";
import { BouncyPressable } from "../../components/BouncyPressable";
import { useState } from "react";
import Entypo from "react-native-vector-icons/Entypo";

export const Routine = ({ items }) => {
  const [hide, updateHide] = useState(false);

  return (
    <View
      style={[
        styles.weekWrapper,
        {
          paddingBottom: hide && 12,
        },
      ]}
    >
      <BouncyPressable
        style={styles.weekDateDisplayTouchable}
        onPress={() => updateHide(!hide)}
      >
        <View style={styles.weekDateDisplayContainer}>
          <View style={styles.weekDatePressable}>
            <Text style={styles.weekDateText}>Every Week</Text>
            <Pressable
              onPress={() => {
                alert(
                  "Routine",
                  "Everything in your routine will be copied into your timetable each week :)"
                );
              }}
            >
              <Entypo name="info-with-circle" color={"black"} size={18} />
            </Pressable>
          </View>
        </View>
      </BouncyPressable>
      {!hide && (
        <View style={styles.weekDaysWrapperView}>
          {Object.values(DaysOfWeek).map((x) => (
            <Day
              key={x}
              day={x}
              items={items.filter((y) => y.day === x)}
              template
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  weekWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
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
    marginTop: 16,
    marginHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
  },
  weekDatePressable: {
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  weekDateText: {
    fontWeight: "600",
    color: deepBlue,
    fontSize: 18,
    fontFamily: "InterSemi",
  },
  weekDaysWrapperView: {
    flexDirection: "column",
    gap: 16,
    marginTop: 16,

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});
