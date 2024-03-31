import { View, StyleSheet, Text } from "react-native";
import DraggableFlatlist from "react-native-draggable-flatlist";
import { useItems } from "../../hooks/useItems";
import { primaryGreen, secondaryGreen } from "../../utils/constants";
import { SortableItem } from "./item/SortableItem";
import { BouncyPressable } from "../pressables/BouncyPressable";

export enum ListType {
  Event = "Event",
  Task = "Task",
  Item = "Item",
}

export const SortableList = ({
  items,
  doneSorting,
  badgeColor,
  badgeTextColor = "black",
  listBackgroundColor = "white",
  listWrapperStyles = {},
}) => {
  const { resortItems } = useItems();

  return (
    <View style={{ gap: 2 }}>
      <DraggableFlatlist
        containerStyle={[
          styles.listContainer,
          {
            backgroundColor: listBackgroundColor,
          },
          listWrapperStyles,
        ]}
        style={styles.flatlistInternal}
        data={items}
        onDragEnd={({ data }) => {
          resortItems(data.map((x) => x.id));
        }}
        keyExtractor={(item: any) => item.id}
        renderItem={(x: any) => {
          return (
            <SortableItem
              key={x.item.template_id || x.item.id}
              badgeColor={badgeColor}
              badgeTextColor={badgeTextColor}
              item={x.item}
              dragFunc={x.drag}
              isActive={x.isActive}
            />
          );
        }}
      />
      <DoneButton doneSorting={doneSorting} />
    </View>
  );
};

const DoneButton = ({ doneSorting }) => {
  return (
    <BouncyPressable style={styles.doneButton} onPress={doneSorting}>
      <Text style={styles.doneText}>Done</Text>
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    overflow: "visible",
    width: "100%",
    marginTop: 4,
    padding: 2,
  },
  flatlistInternal: { overflow: "visible" },
  doneButton: {
    height: 55,
    borderRadius: 10,
    backgroundColor: secondaryGreen,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    width: "100%",
    borderColor: "rgb(156 163 175)",
    borderWidth: 1,
  },
  doneText: {
    fontFamily: "InterMed",
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
  },
});
