import { StyleSheet, View } from 'react-native';
import { useAuth } from 'providers/cloud/useAuth';
import { black, darkCyan, eventsBadgeColor, primaryGreen, secondaryGreen, white } from 'utils/colours';
import { useMemo, useState } from 'react';
import { ActionButton } from '../../components/pressables/AsyncAction';
import { BouncyPressable } from '../../components/pressables/BouncyPressable';
import { Loader } from '../../components/general/MiscComponents';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { useModal } from 'providers/overlays/useModal';
import {
  LyfMenu,
  MenuPopoverPlacement,
  PopoverMenuOption
} from '../../components/menus/LyfMenu';
import { UserFriend } from '../../schema/user';
import { FriendshipAction, hasBlock, hasFriendship, hasIncomingRequest, hasOutgoingBFFRequest, hasOutgoingRequest } from '../../schema/util/social';
import { routes } from 'Routes';
import { useNavigation } from '@react-navigation/native';
import { useFriends } from 'providers/cloud/useFriends';

type Props = {
  friend: UserFriend,
  callback?: () => void
}

export const FriendAction = ({ friend, callback }: Props) => {
  const { user } = useAuth();
  const { friends } = useFriends();
  if (!user) {
    return null;
  }
  
  const { updateModal } = useModal();

  if (friend.id === user.id) {
    return (
      <ActionButton
        title="You"
        func={() => {
          useNavigation().navigate(routes.profile.label as never) // TODO: Fix this (RN 0.65> bug), anticipate fix!
          updateModal(undefined);
        }}
        color={white}
        textColor={black}
      />
    );
  }

  const isFriends = friends.some((x) => x.id === friend.id && hasFriendship(x))
  const isOutgoing = friends.some((x) => x.id === friend.id && hasOutgoingRequest(user.id, x))
  const isBffOutgoing = friends.some((x) => x.id === friend.id && hasOutgoingBFFRequest(user.id, x))
  const isIncoming = friends.some((x) => x.id === friend.id && hasIncomingRequest(user.id, x))
  const isBlocked = friends.some((x) => x.id === friend.id && hasBlock(x))

  if (isFriends) {
    return <Friend friend={friend} />;
  } else if (isOutgoing) {
    return <Requested friend={friend} />;
  } else if (isIncoming) {
    return <HandleRequest friend={friend} />;
  } else if (isBlocked) {
    return null;
  } else {
    return <AddFriend friend={friend} />;
  }
};

export const Friend = ({ friend, callback }: Props) => {
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
      text: '❌ Remove',
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
        func={() => {}}
        color={primaryGreen}
        textColor={white}
        loadingOverride={loading}
        notPressable
      />
    </LyfMenu>
  );
};

export const Requested = ({ friend, callback }: Props) => {
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
      text: '❌ Cancel',
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
        title="Requested"
        func={() => {}}
        color={eventsBadgeColor}
        textColor={black}
        loadingOverride={loading}
        notPressable
      />
    </LyfMenu>
  );
};

export const AddFriend = ({ friend, callback }: Props) => {
  const { updateFriendship } = useFriends();
  const addFriend = async () => {
    await updateFriendship(friend.id, FriendshipAction.Request);
    callback && callback();
  };

  return (
    <ActionButton
      title="Add +"
      func={addFriend}
      color={primaryGreen}
      textColor={white}
    />
  );
};

export const HandleRequest = ({ friend, callback }: Props) => {
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
    <View style={styles.handleRequestMain}>
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
  optionsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingLeft: 0,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.5)'
  },
  optionWrapper: { marginVertical: 4, marginHorizontal: 8 },
  optionText: { fontSize: 18, color: 'rgba(0,0,0,0.7)' },
  optionSeperator: { marginHorizontal: 5 },

  handleRequestMain: { flexDirection: 'row', gap: 4, height: '100%' },
  handleRequestPressable: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  handleRequestPressableContainer: { flex: 1, height: '100%' }
});
