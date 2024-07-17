import { BouncyPressable } from "components/pressables/BouncyPressable"
import { View, Text, ScrollView, StyleSheet, DimensionValue } from "react-native"
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import { UserList, UserListContext } from "./UserList"
import { UserFriend } from "schema/user"
import { eventsBadgeColor } from "utils/colours"
import { useEffect } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
        <ScrollView style={styles.userListContainer} >
          <UserList 
            users={friends}
            emptyText='' 
            context={UserListContext.Friends}
            bannerColor="white"
          />
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  userFriends: {
    width: '100%',
    minHeight: 50, 
    backgroundColor: eventsBadgeColor,
    borderRadius: 10,

    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  userFriendsPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 50,
    paddingHorizontal: 12,
  },
  pressableLeft: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendsText: {
    fontFamily: 'Lexend',
    fontSize: 16
  },
  userListContainer: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
})