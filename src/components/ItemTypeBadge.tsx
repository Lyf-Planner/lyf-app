import { StyleSheet, Text } from 'react-native';

import { BouncyPressable } from '@/components/BouncyPressable';
import { ItemType } from '@/schema/database/items';
import { eventsBadgeColor } from '@/utils/colours';

type Props = {
  fixType?: boolean;
  flex?: boolean;
  fontSize?: number;
  style: object;
  type: ItemType;
  onPress: () => void;
}

export const ItemTypeBadge = ({ fixType = false, flex = false, fontSize = 16, style, type, onPress }: Props) => {
  const conditionalStyles = {
    typeBadge: {
      backgroundColor: type === ItemType.Event ? eventsBadgeColor : 'white',
      ...style
    },
    typeBadgePressable: {
      height: flex ? '100%' : 'auto',
      width: flex ? '100%' : 'auto'
    },
    typeText: {
      fontSize
    }
  }

  return (
    <BouncyPressable
      containerStyle={[
        styles.typeBadge,
        conditionalStyles.typeBadge
      ]}
      disabled={fixType}
      style={[
        styles.typeBadgePressable,
        conditionalStyles.typeBadgePressable
      ]}
      onPress={onPress}
    >
      <Text style={styles.typeText}>{type}</Text>
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  typeBadge: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  typeBadgePressable: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  typeText: {
    fontFamily: 'Lexend',
    textAlign: 'center'
  }
});
