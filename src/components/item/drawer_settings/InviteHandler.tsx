import { View, Text, StyleSheet } from 'react-native';
import { BouncyPressable } from '../../pressables/BouncyPressable';
import { useState } from 'react';
import { useAuth } from 'providers/cloud/useAuth';
import { useTimetable } from 'providers/cloud/useTimetable';
import { primaryGreen } from '../../../utils/colours';
import { Loader } from '../../general/MiscComponents';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { LocalItem } from 'schema/items';
import { SocialAction } from 'schema/util/social';
import { useModal } from 'providers/overlays/useModal';

type Props = {
  item: LocalItem
}

export const InviteHandler = ({ item }: Props) => {
  const { user } = useAuth();
  const { updateItemSocial, removeItem } = useTimetable();
  const { updateModal } = useModal();

  const acceptInvite = async () => {
    if (user) {
      await updateItemSocial(item, user.id, SocialAction.Accept, item.permission);
    }
  };

  const rejectInvite = async () => {
    if (user) {
      await updateItemSocial(item, user.id, SocialAction.Decline, item.permission);
      await removeItem(item, false);
      updateModal(undefined);
    }
  };

  return (
    <View style={styles.main}>
      <InviteHandleButton
        color={primaryGreen}
        text="Accept"
        icon={<FontAwesome5Icon name="check" size={18} color="white" />}
        func={acceptInvite}
      />
      <InviteHandleButton
        color={'red'}
        text="Decline"
        icon={<AntDesign name="close" size={18} color="white" />}
        func={rejectInvite}
      />
    </View>
  );
};

type HandleProps = {
  func: () => Promise<void>;
  text: string;
  color: string;
  icon: JSX.Element;
}

const InviteHandleButton = ({ func, text, color, icon }: HandleProps) => {
  const [loading, setLoading] = useState(false);

  const pressWithLoading = async () => {
    setLoading(true);
    await func();
    setLoading(false);
  }

  return (
    <BouncyPressable
      onPress={pressWithLoading}
      containerStyle={styles.handleContainer}
      style={[styles.pressable, { backgroundColor: color }]}
    >
      {loading ? (
        <Loader size={20} color="white" />
      ) : (
        <View style={styles.contentWrapper}>
          <Text style={styles.buttonText}>{text}</Text>
          {icon}
        </View>
      )}
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    gap: 4,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  pressable: {
    flex: 1,
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  handleContainer: { 
    flex: 1 
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Lexend' 
  }
});
