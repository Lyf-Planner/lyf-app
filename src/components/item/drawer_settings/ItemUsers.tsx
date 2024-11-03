import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { UserList, UserListContext } from '../../users/UserList';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { LocalItem } from 'schema/items';
import { useTimetable } from 'hooks/cloud/useTimetable';
import { Loader } from 'components/general/MiscComponents';

type Props = {
  item: LocalItem,
  loading: boolean,
  closeDrawer: () => void 
}

export const ItemUsers = ({ item, loading, closeDrawer }: Props) => {
  const [open, setOpen] = useState(false);
  const users = useMemo(
    () => item.relations.users || [], [item]
  );

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={styles.pressable}

      >
        <View style={styles.header}>
          {loading ? (
            <Loader size={20} />
          ) : (
            <FontAwesome5Icon name="users" size={16} />
          )}
          <Text style={styles.eventText}>Users</Text>
          {!loading &&
            <Text style={[styles.subtitle, { fontSize: 16 }]}>
              ( {users.length} )
            </Text>
          }

          <FontAwesome5Icon
            name={open ? 'chevron-down' : 'chevron-right'}
            style={{ marginLeft: 'auto' }}
            size={16}
          />          
        </View>
      </TouchableOpacity>

      {open && (
        <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
          <UserList
            users={users}
            emptyText={loading ? 'Fetching item users...' : 'No users on this item :)'}
            context={UserListContext.Item}
            item={item}
            callback={closeDrawer}
            menuContext='in-item'
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    width: '100%',
    overflow: 'visible'
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    alignItems: 'center'
  },
  pressable: { paddingRight: 10, paddingVertical: 6, borderRadius: 10 },
  eventText: { fontSize: 20, fontWeight: '500' },
  subtitle: {
    textAlign: 'center',
    opacity: 0.4,
    fontWeight: '600',
    fontSize: 15
  },
  userList: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    overflow: 'hidden',
    maxHeight: 300,
    width: '100%',
  }
});
