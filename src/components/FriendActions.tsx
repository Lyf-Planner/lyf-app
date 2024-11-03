import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from 'components/ActionButton';
import { BouncyPressable } from 'components/BouncyPressable';
import { Loader } from 'components/Loader';
import {
  LyfMenu,
  MenuPopoverPlacement,
  PopoverMenuOption
} from 'containers/LyfMenu';
import { useAuth } from 'hooks/cloud/useAuth';
import { useFriends } from 'hooks/cloud/useFriends';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { UserFriend } from 'schema/user';
import { FriendshipAction, hasBlock, hasFriendship, hasIncomingRequest, hasOutgoingBFFRequest, hasOutgoingRequest } from 'schema/util/social';
import { black, inProgressColor, deepBlue, eventsBadgeColor, primaryGreen, white } from 'utils/colours';

type Props = {
  friend: UserFriend,
  callback?: () => void,
  height?: number
}

export const FriendAction = ({ friend, callback, height }: Props) => {
  const { user } = useAuth();
  const { friends, loading, reload } = useFriends();

  useEffect(() => {
    if (loading) {
      reload();
    }
  })

  if (!user) {
    return null;
  }

  if (friend.id === user.id) {
    return (
      <ActionButton
        title="You"
        func={() => null}
        isAsync={false}
        color={primaryGreen}
        textColor={white}
        height={height}
      />
    );
  }

  if (loading) {
    return (
      <ActionButton
        title="Loading"
        func={() => null}
        isAsync={false}
        color={primaryGreen}
        textColor={white}
        height={height}
        loadingOverride
      />
    )
  }

  const isFriends = friends.some((x) => x.id === friend.id && hasFriendship(x))
  const isOutgoing = friends.some((x) => x.id === friend.id && hasOutgoingRequest(user.id, x))
  const isBffOutgoing = friends.some((x) => x.id === friend.id && hasOutgoingBFFRequest(user.id, x))
  const isIncoming = friends.some((x) => x.id === friend.id && hasIncomingRequest(user.id, x))
  const isBlocked = friends.some((x) => x.id === friend.id && hasBlock(x))

  if (isFriends) {
    return <Friend friend={friend} height={height} />;
  } else if (isOutgoing) {
    return <Requested friend={friend} height={height} />;
  } else if (isIncoming) {
    return <HandleRequest friend={friend} height={height} />;
  } else if (isBlocked) {
    return null;
  } else {
    return <AddFriend friend={friend} height={height} />;
  }
};

export const Friend = ({ friend, callback, height }: Props) => {
  const [loading, setLoading] = useState(false);
  const { updateFriendship } = useFriends();
  const removeFriend = async () => {
    setLoading(true);
    await updateFriendship(friend.id, FriendshipAction.Remove);
    callback && callback();
    setLoading(false);
  };

  const menuOptions: PopoverMenuOption[] = [
    {
      text: 'Remove',
      onSelect: () => removeFriend()
    }
  ];

  return (
    <LyfMenu
      options={menuOptions}
      placement={MenuPopoverPlacement.Top}
      name={`requested-menu-${friend.id}`}
    >
      <ActionButton
        title="Friends"
        func={() => null}
        isAsync={false}
        color={primaryGreen}
        textColor={white}
        loadingOverride={loading}
        height={height}
        notPressable
      />
    </LyfMenu>
  );
};

export const Requested = ({ friend, callback, height }: Props) => {
  const [loading, setLoading] = useState(false);
  const { updateFriendship } = useFriends();
  const cancelRequest = async () => {
    setLoading(true);
    await updateFriendship(friend.id, FriendshipAction.Cancel);
    callback && callback();
    setLoading(false);
  };

  const menuOptions: PopoverMenuOption[] = [
    {
      text: 'Cancel',
      onSelect: () => cancelRequest()
    }
  ];

  return (
    <LyfMenu
      options={menuOptions}
      placement={MenuPopoverPlacement.Top}
      name={`requested-menu-${friend.id}`}
    >
      <ActionButton
        title="Pending"
        func={() => null}
        isAsync={false}
        color={eventsBadgeColor}
        textColor={black}
        loadingOverride={loading}
        height={height}
        notPressable
      />
    </LyfMenu>
  );
};

export const AddFriend = ({ friend, callback, height }: Props) => {
  const { updateFriendship } = useFriends();
  const addFriend = async () => {
    await updateFriendship(friend.id, FriendshipAction.Request);
    callback && callback();
  };

  return (
    <ActionButton
      title="Add +"
      func={addFriend}
      isAsync={true}
      color={inProgressColor}
      textColor={deepBlue}
      height={height}
    />
  );
};

export const HandleRequest = ({ friend, callback, height }: Props) => {
  const { updateFriendship } = useFriends();
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const acceptRequest = async () => {
    setAccepting(true);
    await updateFriendship(friend.id, FriendshipAction.Accept);
    callback && callback();
    setAccepting(false);
  };
  const declineRequest = async () => {
    setDeclining(true);
    await updateFriendship(friend.id, FriendshipAction.Decline);
    callback && callback();
    setDeclining(false);
  };

  return (
    <View style={[styles.handleRequestMain, { height }]}>
      <BouncyPressable
        containerStyle={styles.handleRequestPressableContainer}
        style={[
          styles.handleRequestPressable,
          { backgroundColor: primaryGreen }
        ]}
        onPress={acceptRequest}
      >
        {accepting ? (
          <Loader size={20} color="white" />
        ) : (
          <FontAwesome5Icon name="plus" color="white" size={18} />
        )}
      </BouncyPressable>
      <BouncyPressable
        containerStyle={styles.handleRequestPressableContainer}
        style={[styles.handleRequestPressable, { backgroundColor: 'red' }]}
        onPress={declineRequest}
      >
        {declining ? (
          <Loader size={20} color="white" />
        ) : (
          <Entypo name="cross" color="white" size={24} />
        )}
      </BouncyPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  handleRequestMain: { flexDirection: 'row', gap: 4, height: '100%' },
  handleRequestPressable: {
    alignItems: 'center',
    borderRadius: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10
  },
  handleRequestPressableContainer: { flex: 1, height: '100%' },
  optionSeperator: { marginHorizontal: 5 },

  optionText: { color: 'rgba(0,0,0,0.7)', fontSize: 18 },
  optionWrapper: { marginHorizontal: 8, marginVertical: 4 },
  optionsContainer: {
    borderColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    borderWidth: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingLeft: 0
  }
});
