import { useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import { Loader } from '@/components/Loader';
import { UserList, UserListContext } from '@/containers/UserList';
import { LocalItem } from '@/schema/items';

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
            <Text style={styles.subtitle}>
              ( {users.length} )
            </Text>
          }

          <FontAwesome5Icon
            name={open ? 'chevron-down' : 'chevron-right'}
            style={styles.icon}
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
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eventText: { fontSize: 20, fontWeight: '500' },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },
  icon: { marginLeft: 'auto' },
  mainContainer: {
    flexDirection: 'column',
    overflow: 'visible',
    width: '100%'
  },
  pressable: { borderRadius: 10, paddingRight: 10, paddingVertical: 6 },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.4,
    textAlign: 'center'
  },
  userList: {
    maxHeight: 300,
    overflow: 'hidden',
    paddingHorizontal: 4,
    paddingVertical: 8,
    width: '100%'
  }
});
