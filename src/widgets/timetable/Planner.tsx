import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { WeekDisplay } from "./WeekDisplay";
import {
  extendByWeek,
  formatDateData,
  getStartOfCurrentWeek,
  initialiseDays,
} from "../../utils/dates";
import Entypo from "react-native-vector-icons/Entypo";
import { primaryGreen } from "../../utils/constants";
import { BouncyPressable } from "../../components/BouncyPressable";
import { Routine } from "./Routine";
import { useAuth } from "../../authorisation/AuthProvider";

export const Planner = ({ items }: any) => {
  const { user } = useAuth();
  const [updatingTemplate, setUpdatingTemplate] = useState(false);
  const [displayedWeeks, setDisplayedWeeks] = useState(initialiseDays(user));

  useEffect(() => {
    // Keep remote first_day in sync with any!
    setDisplayedWeeks(initialiseDays(user));
  }, [user.timetable.first_day]);

  const addWeek = () => setDisplayedWeeks(extendByWeek(displayedWeeks));

  console.log("Displaying days:", displayedWeeks);

  return (
    <View>
      <View style={styles.menuButtonRow}>
        <MenuButton
          selected={!updatingTemplate}
          onPress={() => setUpdatingTemplate(false)}
        >
          <Text style={styles.menuButtonText}>My Planner</Text>
        </MenuButton>
        <MenuButton
          selected={updatingTemplate}
          onPress={() => setUpdatingTemplate(true)}
        >
          <Text style={styles.menuButtonText}>Routine</Text>
          <Pressable
            style={styles.infoPressable}
            onPress={() => {
              Alert.alert(
                "Tip",
                "Items in your routine will be automatically included in each new week!"
              );
            }}
          >
            <Entypo name="info-with-circle" color={"white"} size={18} />
          </Pressable>
        </MenuButton>
      </View>

      {updatingTemplate ? (
        <Routine items={items.filter((x) => x.day && !x.date)} />
      ) : (
        <View>
          {displayedWeeks.map((x: any, i: any) => (
            <WeekDisplay
              key={x[0]}
              dates={x}
              items={items.filter((y) => x.includes(y.date) || y.day)}
            />
          ))}
        </View>
      )}

      {!updatingTemplate && (
        <View style={styles.addWeekButton}>
          <BouncyPressable
            onPress={() => addWeek()}
            style={styles.addWeekTouchable}
            useTouchableHighlight
          >
            <View style={styles.addWeekView}>
              <Entypo name="chevron-down" size={20} />
              <Text style={{ fontSize: 18 }}>Next Week</Text>
              <Entypo name="chevron-down" size={20} />
            </View>
          </BouncyPressable>
        </View>
      )}
    </View>
  );
};

const MenuButton = ({ children, onPress, selected = false }: any) => {
  return (
    <BouncyPressable
      style={styles.menuButton}
      onPress={onPress}
      containerStyle={{ flex: 1 }}
      conditionalStyles={{ borderColor: selected ? "black" : primaryGreen }}
    >
      {children}
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  menuButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    marginHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10,
  },
  menuButton: {
    backgroundColor: primaryGreen,
    flex: 1,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
  },
  infoPressable: {
    marginLeft: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  menuButtonText: { color: "white", fontSize: 20 },
  addWeekView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    gap: 5,
    padding: 15,
    width: 250,
    borderRadius: 10,
  },
  addWeekTouchable: {
    borderRadius: 10,
  },
  addWeekButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
