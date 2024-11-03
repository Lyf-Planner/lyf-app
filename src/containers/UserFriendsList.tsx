import { useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, DimensionValue } from 'react-native'

import { BouncyPressable } from 'components/BouncyPressable'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { UserFriend } from 'schema/user'
import { eventsBadgeColor } from 'utils/colours'

import { UserList, UserListContext } from './UserList'

type Props = {
  friends: UserFriend[],
  open: boolean,
  setOpen: (open: boolean) => void,
  maxHeight: number,
}

export const UserFriendsList = ({ friends, open, setOpen, maxHeight }: Props) => {
  const chevronAngle = useSharedValue(0);
  const chevronRotationAnimation = useAnimatedStyle(() => ({
    transform: [{
      rotateZ: withTiming(`${chevronAngle.value}deg`, { duration: 200 })
    }]
  }));

  useEffect(() => {
    chevronAngle.value = open ? 90 : 0;
  }, [open]);

  const conditionalStyles = {
    userFriends: {
      maxHeight,
      height: open ? maxHeight : 'auto' as DimensionValue
    }
  }

  return (
    <View style={[styles.userFriends, conditionalStyles.userFriends]}>
      <BouncyPressable
        style={styles.userFriendsPressable}
        onPress={() => setOpen(!open)}
      >
        <FontAwesome5
          name="users"
          size={18}
          color="black"
        />
        <Text style={styles.friendsText}>{friends.length} Friends</Text>
        <View style={styles.pressableLeft}>
          <Animated.View style={chevronRotationAnimation}>
            <Entypo name="chevron-right" size={25} />
          </Animated.View>
        </View>
      </BouncyPressable>

      {open && (
        <ScrollView style={styles.userListContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.friendsListPadding}>
            <UserList
              users={friends}
              emptyText=''
              context={UserListContext.Friends}
            />
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  friendsListPadding: {
    paddingBottom: 10
  },
  friendsText: {
    fontFamily: 'Lexend',
    fontSize: 16
  },
  pressableLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 'auto'
  },
  userFriends: {
    backgroundColor: eventsBadgeColor,
    borderRadius: 10,
    minHeight: 50,
    shadowColor: 'black',

    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    width: '100%'
  },
  userFriendsPressable: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 50,
    paddingHorizontal: 12
  },
  userListContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2
  }
})
