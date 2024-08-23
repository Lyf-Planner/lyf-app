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
import { CreationButton } from "./CreationButton"
import { useState } from "react"
import { useNotes } from "providers/cloud/useNotes"
import { NoteType } from "schema/database/notes"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { RouteParams } from "Routes"
import { BottomTabNavigationProp, BottomTabScreenProps } from "@react-navigation/bottom-tabs"

interface ButtonsLoading {
  event: boolean;
  task: boolean;
  note: boolean;
  list: boolean;
}

const defaultLoadingState: ButtonsLoading = {
  event: false,
  task: false,
  note: false,
  list: false
};

export const Create = (props: BottomTabScreenProps<RouteParams>) => {
  const { updateDrawer } = useDrawer();
  const { addItem } = useTimetable();
  const { addNote } = useNotes();
  const navigation = useNavigation<BottomTabNavigationProp<RouteParams>>();

  const [loading, setLoading] = useState<ButtonsLoading>(defaultLoadingState);

  const createItem = async (type: ItemType) => {
    setLoading({
      ...loading,
      event: type === ItemType.Event,
      task: type === ItemType.Task
    });

    const id = await addItem(type, 0, { title: `New ${type}` });

    updateDrawer(<ItemDrawer id={id} isNew/>);
    setLoading(defaultLoadingState);
  }

  const createNote = async (type: NoteType) => {
    setLoading({
      ...loading,
      list: type === NoteType.ListOnly,
      note: type === NoteType.NoteOnly
    });

    const id = await addNote(`New ${type === NoteType.ListOnly ? 'List' : 'Note'}`, type);

    navigation.jumpTo('Notes', { id });
    setLoading(defaultLoadingState);
  }

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Make New Plans!</Text>
      </View>
      <PageBackground>
        <View style={styles.creationWrapper}>
          <View style={[styles.creationRow, styles.creationRowOne]}>
            <CreationButton
              loading={loading.event}
              icon={<Entypo name="calendar" color={eventsBadgeColor} size={40} />}
              onPress={() => createItem(ItemType.Event)}
              shadowOffset={{ width: 2, height: 2 }}
              title="New Event"
            />
            <CreationButton
              loading={loading.task}
              icon={<MaterialIcons name='add-task' size={40} color={eventsBadgeColor} />}
              onPress={() => createItem(ItemType.Task)}
              shadowOffset={{ width: 4, height: 2 }}
              title="New Task"
            />
          </View>
          <View style={[styles.creationRow, styles.creationRowTwo]}>
            <CreationButton
              loading={loading.note}
              icon={<FontAwesome5 name='sticky-note' size={40} color={eventsBadgeColor} />}
              onPress={() => createNote(NoteType.NoteOnly)}
              shadowOffset={{ width: 2, height: 4 }}
              title="New Note"
            />
            <CreationButton
              loading={loading.list}
              icon={<Entypo name="list" color={eventsBadgeColor} size={44} />}
              onPress={() => createNote(NoteType.ListOnly)}
              shadowOffset={{ width: 4, height: 4 }}
              title="New List"
            />
          </View>
        </View>
      </PageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },

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
  }
})