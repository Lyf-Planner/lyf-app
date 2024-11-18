import { StyleSheet, View, Text } from 'react-native';

import { UserBanner } from '@/components/UserBanner';
import { ItemRelatedUser, LocalItem } from '@/schema/items';
import { NoteRelatedUser } from '@/schema/notes';
import { UserFriend } from '@/schema/user';

export enum UserListContext {
  Friends = 'Friends',
  Item = 'Item',
}

type Props = {
  users: (UserFriend | ItemRelatedUser | NoteRelatedUser)[],
  emptyText: string | null,
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
      {users.length === 0 && emptyText !== null ? (
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
  emptyText: {
    fontFamily: 'Lexend',
    fontSize: 18,
    opacity: 0.4,
    textAlign: 'center'
  },
  main: {
    alignSelf: 'center',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    maxWidth: 400,
    minHeight: 50,
    width: '100%'
  }
});
