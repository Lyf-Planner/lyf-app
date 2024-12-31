import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { Loader } from '@/components/Loader';
import { LyfMenu } from '@/containers/LyfMenu';
import { Permission } from '@/schema/database/items_on_users';
import { LocalItem } from '@/schema/items';
import { SocialAction } from '@/schema/util/social';
import { useAuthStore } from '@/store/useAuthStore';
import { useTimetableStore } from '@/store/useTimetableStore';
import { isTemplate } from '@/utils/item';

type Props = {
  item: LocalItem,
  closeDrawer: () => void,
}

export const OptionsMenu = ({ item, closeDrawer }: Props) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { updateItemSocial, removeItem } = useTimetableStore();

  if (!user) {
    return null;
  }

  const leaveItem = async () => {
    setLoading(true);
    closeDrawer();
    await updateItemSocial(item, user.id, SocialAction.Remove, item.permission);
    setLoading(false);
  };

  const menuOptions = []

  if (!isTemplate(item)) {
    menuOptions.push({
      text: 'Leave',
      onSelect: () => leaveItem()
    })
  }

  // Only offer deletion when permitted
  if (item.permission !== Permission.ReadOnly && !item.invite_pending) {
    menuOptions.push({
      text: 'Delete',
      onSelect: async () => {
        setLoading(true);
        await removeItem(item);
      }
    })
  }

  return (
    <LyfMenu
      options={menuOptions}
    >
      <View style={styles.triggerWrapper}>
        {loading ? (
          <Loader color="white" size={20} />
        ) : (
          <SimpleLineIcons name="options-vertical" color="white" size={20} />
        )}
      </View>
    </LyfMenu>
  );
};

const styles = StyleSheet.create({
  triggerWrapper: { padding: 4 }
});
