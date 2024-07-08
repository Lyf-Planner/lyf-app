import { StyleSheet, View, Text } from 'react-native';
import { UserBanner } from './UserBanner';
import { Loader } from '../general/MiscComponents';
import { PublicUser, UserFriend } from 'schema/user';
import { ItemRelatedUser, LocalItem } from 'schema/items';
import { NoteRelatedUser } from 'schema/notes';

export enum UserListContext {
  Friends = 'Friends',
  Item = 'Item',
}

type Props = {
  users: (UserFriend | ItemRelatedUser | NoteRelatedUser)[],
  emptyText: string,
  context?: UserListContext,
  item?: LocalItem

}

export const UserList = ({
  users,
  emptyText,
  context = UserListContext.Friends,
  item
}: Props) => {
  return (
    <View style={styles.main}>
      {users.length ? (
          users.map((x) => (
            <UserBanner user={x} context={context} item={item} key={x.id} />
          ))
        ) : (
          <Text style={styles.emptyText}>{emptyText}</Text>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 50
  },
  emptyText: {
    fontSize: 18,
    marginVertical: 8,
    fontFamily: 'Inter',
    opacity: 0.7,
    fontWeight: '600'
  }
});
