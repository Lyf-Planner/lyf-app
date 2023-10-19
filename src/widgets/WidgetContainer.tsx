import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SaveTooltip } from "../components/Tooltip";
import { Timetable } from "./TimetableWidget";
import { useAuth } from "../authorisation/AuthProvider";

export enum Widgets {
  Timetable = "Timetable",
  Notes = "Notes",
}

export const WidgetContainer = () => {
  const [selected, updateSelected] = useState<any>(Widgets.Timetable);
  const { updateData, data } = useAuth();

  const updateTimetable = (timetable: any) =>
    updateData({ ...data, timetable });
  const updateNotes = (notes: any) => updateData({ ...data, notes });

  const WIDGETS = {
    Timetable: (
      <Timetable timetable={data.timetable} updateTimetable={updateTimetable} />
    ),
  };

  return (
    <View style={styles.container}></View>
    // <div className="max-widget-width bg-white p-4 border-2 border-gray-700 rounded-lg mx-auto flex flex-col">
    //   <div className="flex flex-row gap-2">
    //     {Object.keys(Widgets).map((x) => (
    //       <button
    //         className={`font-bold text-2xl rounded-xl py-2 px-4 ${
    //           selected === x ? "bg-black text-white" : "hover:underline"
    //         }`}
    //         onClick={() => updateSelected(x)}
    //       >
    //         {x}
    //       </button>
    //     ))}

    //     <button
    //       className="text-black ml-auto my-auto mr-4"
    //       onClick={() => logout()}
    //     >
    //       {saving ? (
    //         <div className="my-auto font-bold">Saving...</div>
    //       ) : (
    //         <SaveTooltip lastSave={lastSave} id="save-info" />
    //       )}
    //     </button>
    //   </div>
    //   <hr className="my-3 rounded-3xl border-2 border-black" />
    //   {WIDGETS[selected as Widgets]}
    // </div>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 800,
    width: "100%",
    padding: 8,
    flex: 1,
    backgroundColor: "white",
  },
});
