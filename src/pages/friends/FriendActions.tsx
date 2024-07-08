import { StyleSheet, View } from 'react-native';
import { useAuth } from 'providers/cloud/useAuth';
import { primaryGreen } from 'utils/colours';
import { useState } from 'react';
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
  friend: UserFriend
}

export const FriendAction = ({ friend }: Props) => {
  const { user } = useAuth();
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
        icon={null}
        color={primaryGreen}
      />
    );
  }

  const friends = hasFriendship(friend);
  const outgoing = hasOutgoingRequest(user.id, friend);
  const bff_outgoing = hasOutgoingBFFRequest(user.id, friend)
  const incoming = hasIncomingRequest(user.id, friend);
  const blocked = hasBlock(friend);

  if (friends) {
    return <Friend friend={friend} />;
  } else if (outgoing) {
    return <Requested friend={friend} />;
  } else if (incoming) {
    return <HandleRequest friend={friend} />;
  } else if (blocked) {
    return null;
  } else {
    return <AddFriend friend={friend} />;
  }
};

export const Friend = ({ friend }: Props) => {
  const [loading, setLoading] = useState(false);
  const { updateFriendship } = useFriends();
  const removeFriend = async () => {
    setLoading(true);
    await updateFriendship(friend.id, FriendshipAction.Remove);
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
        icon={<AntDesign name="check" color="white" size={20} />}
        color={primaryGreen}
        loadingOverride={loading}
        notPressable
      />
    </LyfMenu>
  );
};

export const Requested = ({ friend }: Props) => {
  const [loading, setLoading] = useState(false);
  const { updateFriendship } = useFriends();
  const cancelRequest = async () => {
    setLoading(true);
    await updateFriendship(friend.id, FriendshipAction.Cancel);
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
        title="Sent"
        func={() => {}}
        icon={<FontAwesome5Icon name="arrow-right" color="white" size={18} />}
        color={'rgba(0,0,0,0.5)'}
        loadingOverride={loading}
        notPressable
      />
    </LyfMenu>
  );
};

export const AddFriend = ({ friend }: Props) => {
  const { updateFriendship } = useFriends();
  const addFriend = async () => {
    await updateFriendship(friend.id, FriendshipAction.Request);
  };

  return (
    <ActionButton
      title="Add"
      func={addFriend}
      icon={<FontAwesome5Icon name="plus" color="white" size={18} />}
      color={primaryGreen}
    />
  );
};

export const HandleRequest = ({ friend }: Props) => {
  const { updateFriendship } = useFriends();
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const acceptRequest = async () => {
    setAccepting(true);
    await updateFriendship(friend.id, FriendshipAction.Accept);
    setAccepting(false);
  };
  const declineRequest = async () => {
    setDeclining(true);
    await updateFriendship(friend.id, FriendshipAction.Decline);
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
