import { View } from 'react-native';
import { StyleSheet } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { ItemStatus } from '@/schema/database/items';
import { LocalItem } from '@/schema/items';
import { primaryGreen } from '@/utils/colours';

type Props = {
  item: LocalItem;
};

export const CollaborativeIcon = ({ item }: Props) => {
  const conditionalStyles = {
    collaborativeIndicator: {
      backgroundColor: item.status === ItemStatus.Done ? 'white' : primaryGreen
    },
    iconColor: item.status === ItemStatus.Done ? primaryGreen : 'white'
  };

  return (
    <View
      style={[
        styles.collaborativeIndicator,
        conditionalStyles.collaborativeIndicator
      ]}
    >
      <FontAwesome5
        name="users"
        size={16}
        color={conditionalStyles.iconColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  collaborativeIndicator: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 32
  }
});
