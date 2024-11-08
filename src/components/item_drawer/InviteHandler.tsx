import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import { BouncyPressable } from '@/components/BouncyPressable';
import { Loader } from '@/components/Loader';
import { LocalItem } from '@/schema/items';
import { SocialAction } from '@/schema/util/social';
import { useTimetable } from '@/shell/cloud/useTimetable';
import { useModal } from '@/shell/overlays/useModal';
import { useAuthStore } from '@/store/useAuthStore';
import { black, primaryGreen, white } from '@/utils/colours';

type Props = {
  item: LocalItem
}

export const InviteHandler = ({ item }: Props) => {
  const { user } = useAuthStore();
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
  buttonText: {
    color: white,
    fontFamily: 'Lexend',
    fontSize: 18
  },
  contentWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center'
  },
  handleContainer: {
    flex: 1
  },
  main: {
    flexDirection: 'row',
    gap: 4,
    height: 50,
    shadowColor: black,

    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    width: '100%'
  },
  pressable: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8
  }
});
