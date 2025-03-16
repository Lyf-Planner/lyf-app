import { View } from 'react-native';
import { StyleSheet } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { ItemStatus } from '@/schema/database/items';
import { NoteDbObject } from '@/schema/database/notes';
import { LocalItem } from '@/schema/items';
import { primaryGreen } from '@/utils/colours';
import { SocialEntityType } from '@/utils/misc';

type Props = {
  entity: LocalItem | NoteDbObject;
  type: SocialEntityType;
};

export const CollaborativeIcon = ({ entity, type }: Props) => {
  const backgroundColor = () => {
    if (type === 'item') {
      return (entity as LocalItem).status === ItemStatus.Done ? 'white' : primaryGreen;
    }

    if (type === 'note') {
      return 'white';
    }
  }

  const conditionalStyles = {
    collaborativeIndicator: {
      backgroundColor: backgroundColor()
    },
    iconColor: backgroundColor() === 'white' ? primaryGreen : 'white' // alternate
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
