import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import { BouncyPressable } from '@/components/BouncyPressable';
import { Loader } from '@/components/Loader';
import { LocalItem } from '@/schema/items';
import { UserRelatedNote } from '@/schema/user';
import { SocialAction } from '@/schema/util/social';
import { useAuthStore } from '@/store/useAuthStore';
import { useNoteStore } from '@/store/useNoteStore';
import { useRootComponentStore } from '@/store/useRootComponent';
import { useTimetableStore } from '@/store/useTimetableStore';
import { black, primaryGreen, white } from '@/utils/colours';
import { SocialEntityType } from '@/utils/misc';

type Props = {
  entity: LocalItem | UserRelatedNote;
  type: SocialEntityType;
}

export const InviteHandler = ({ entity, type }: Props) => {
  const { user } = useAuthStore();
  const { updateItemSocial, removeItem } = useTimetableStore();
  const { updateNoteSocial, removeNote } = useNoteStore();
  const { updateModal } = useRootComponentStore();

  const acceptInvite = async () => {
    if (user) {
      if (type === 'item') {
        await updateItemSocial(entity as LocalItem, user.id, SocialAction.Accept, entity.permission);
      }

      if (type === 'note') {
        await updateNoteSocial(entity as UserRelatedNote, user.id, SocialAction.Accept, entity.permission);
      }
    }
  };

  const rejectInvite = async () => {
    if (user) {
      if (type === 'item') {
        await updateItemSocial(entity as LocalItem, user.id, SocialAction.Decline, entity.permission);
        await removeItem(entity as LocalItem, false);
      }

      if (type === 'note') {
        await updateNoteSocial(entity as UserRelatedNote, user.id, SocialAction.Decline, entity.permission);
        await removeNote(entity.id, false);
      }

      updateModal(null);
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
        icon={<AntDesign name="close" size={20} color="white" />}
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
          {icon}
          <Text style={styles.buttonText}>{text}</Text>
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
