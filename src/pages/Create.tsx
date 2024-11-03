import { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RouteParams } from 'Routes'
import { CreationButton } from 'components/CreationButton'
import { ItemDrawer } from 'containers/ItemDrawer'
import { PageBackground } from 'containers/PageBackground'
import { useNotes } from 'hooks/cloud/useNotes'
import { useTimetable } from 'hooks/cloud/useTimetable'
import { useDrawer } from 'hooks/overlays/useDrawer'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { ItemType } from 'schema/database/items'
import { NoteType } from 'schema/database/notes'
import { deepBlueOpacity, eventsBadgeColor, primaryGreen, white } from 'utils/colours'
import { formatDateData } from 'utils/dates'

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

    const id = await addItem(type, 0, { title: `New ${type}`, date: formatDateData(new Date()) });

    navigation.jumpTo('Timetable');
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
        <Text style={styles.headerText}>Create New Plans!</Text>
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
  creationRow: {
    flexDirection: 'row',
    gap: 50,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    width: '100%'
  },

  creationRowOne: {
    top: 100
  },
  creationRowTwo: {
    top: 275
  },

  creationWrapper: {
    flex: 1
  },
  header: {
    alignItems: 'center',
    backgroundColor: primaryGreen,
    flexDirection: 'row',
    gap: 12,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: 'black',

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    zIndex: 50
  },
  headerText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 22,
    fontWeight: '400'
  },
  main: {
    flex: 1
  }
})
