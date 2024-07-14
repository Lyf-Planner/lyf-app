import { StyleSheet, View, Text } from 'react-native';
import { UserBanner } from './UserBanner';
import { Loader, PageLoader } from '../general/MiscComponents';
import { PublicUser, UserFriend } from 'schema/user';
import { ItemRelatedUser, LocalItem } from 'schema/items';
import { NoteRelatedUser } from 'schema/notes';
import { useMemo } from 'react';

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
  menuContext?: string
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
