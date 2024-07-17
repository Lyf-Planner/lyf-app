import { StyleSheet, View, Text } from 'react-native';
import { UserBanner } from './UserBanner';
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
  callback?: () => void,
  item?: LocalItem,
  menuContext?: string,
  bannerColor?: string
}

export const UserList = ({
  users,
  emptyText,
  context = UserListContext.Friends,
  callback,
  item,
  menuContext,
  bannerColor,
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
            bannerColor={bannerColor}
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
    minHeight: 50,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    marginVertical: 8,
    fontFamily: 'Inter',
    opacity: 0.7,
    fontWeight: '600'
  }
});
