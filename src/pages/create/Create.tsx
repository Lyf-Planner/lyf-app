import { PageBackground } from "components/general/PageBackground"
import { ItemDrawer } from "components/list/ItemDrawer"
import { inProgressColor } from "components/list/constants"
import { BouncyPressable } from "components/pressables/BouncyPressable"
import { useTimetable } from "providers/cloud/useTimetable"
import { useDrawer } from "providers/overlays/useDrawer"
import { StyleSheet, View, Text } from "react-native"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { ItemType } from "schema/database/items"
import { deepBlueOpacity, eventsBadgeColor, primaryGreen, white } from "utils/colours"


export const Create = () => {
  const { updateDrawer } = useDrawer();
  const { addItem } = useTimetable();

  const createItem = (type: ItemType) => {
    const id = addItem(type, 0, { title: `New ${type}` });

    updateDrawer(<ItemDrawer id={id}/>);
  }

  const createNote = () => {

  }

  const createList = () => {

  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Make New Plans!</Text>
      </View>
      <PageBackground>
        <View style={styles.creationWrapper}>
          <View style={[styles.creationRow, styles.creationRowOne]}>
            <BouncyPressable 
              style={styles.creationButton}
              onPress={() => createItem(ItemType.Event)}
              useTouchableHighlight
            >
              <>
                <Entypo name="calendar" color={eventsBadgeColor} size={40} />
                <Text style={styles.typeText}>New Event</Text>
              </>
            </BouncyPressable>
            <BouncyPressable 
              style={styles.creationButton}
              onPress={() => createItem(ItemType.Task)}
              useTouchableHighlight
            >
              <>
                <MaterialIcons name='add-task' size={40} color={eventsBadgeColor} />
                <Text style={styles.typeText}>New Task</Text>
              </>
            </BouncyPressable>
          </View>
          <View style={[styles.creationRow, styles.creationRowTwo]}>
            <BouncyPressable style={styles.creationButton} useTouchableHighlight>
              <>
                <FontAwesome5 name='sticky-note' size={40} color={eventsBadgeColor} />
                <Text style={styles.typeText}>New Note</Text>
              </>
            </BouncyPressable>
            <BouncyPressable style={styles.creationButton} useTouchableHighlight>
              <>
                <Entypo name="list" color={eventsBadgeColor} size={44} />
                <Text style={styles.typeText}>New List</Text>
              </>
            </BouncyPressable>
          </View>
        </View>
      </PageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    zIndex: 50,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
    paddingHorizontal: 16,

    backgroundColor: primaryGreen, 
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  headerText: {
    fontSize: 22, 
    color: white, 
    fontFamily: "Lexend", 
    fontWeight: '400',
  },

  creationWrapper: {
    flex: 1
  },
  creationRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 50,
  },
  creationRowOne: {
    top: 100
  },
  creationRowTwo: {
    top: 275
  },

  creationButton: {
    backgroundColor: deepBlueOpacity(0.9),
    borderRadius: 40,
    height: 125,
    width: 125,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  typeText: {
    fontFamily: 'Lexend',
    color: white,
    fontSize: 16
  }
})