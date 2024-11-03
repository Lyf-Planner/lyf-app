import { StyleSheet, View, Text } from 'react-native';
import { UserBanner } from 'components/UserBanner';
import { UserFriend } from 'schema/user';
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
  callback?: () => void,
  item?: LocalItem,
  menuContext?: string,
}

export const UserList = ({
  users,
  emptyText,
  context = UserListContext.Friends,
  callback,
  item,
  menuContext
}: Props) => {
  return (
    <View style={styles.main}>
      {users.length === 0 ? (
        <Text style={styles.emptyText}>{emptyText}</Text>
      ) : (
        users.map((x) => (
          <UserBanner
            user={x}
            context={context}
            callback={callback}
            item={item}
            key={x.id}
            menuContext={menuContext}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    maxWidth: 400,
    minHeight: 50,
    alignSelf: 'center'
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.4,
    fontSize: 18,
    fontFamily: 'Lexend'
  }
});
