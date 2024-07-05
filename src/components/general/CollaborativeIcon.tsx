import { View } from 'react-native';
import { ListItem } from '../../utils/abstractTypes';
import { StyleSheet } from 'react-native';
import { primaryGreen } from 'utils/colours';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ItemStatus } from 'schema/database/items';

type Props = {
  item: ListItem;
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
    borderRadius: 30,
    aspectRatio: 1,
    width: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
