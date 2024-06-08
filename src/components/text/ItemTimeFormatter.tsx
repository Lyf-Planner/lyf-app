import { StyleSheet, Text } from 'react-native';
import { ListItem } from '../../utils/abstractTypes';
import { ListItemType } from '../list/constants';
import { TwentyFourHourToAMPM } from '../../utils/dates';
import { useMemo } from 'react';

type Props = {
  item: ListItem;
  textColor: string;
};

export const ItemTimeFormatter = ({ item, textColor }: Props) => {
  const getTimeText = () => {
    if (item.end_time && item.time) {
      const amPmSlicePosition = -2;

      const potentialTime = TwentyFourHourToAMPM(item.time);
      const endTime = TwentyFourHourToAMPM(item.end_time);

      // Remove AMPM from time to save space, if it's the same as the end time
      const sameAMPM =
        potentialTime.slice(amPmSlicePosition) ===
        endTime.slice(amPmSlicePosition);
      const time = sameAMPM
        ? TwentyFourHourToAMPM(item.time, false)
        : potentialTime;

      return `${time}-${endTime}`;
    } else if (item.time) {
      const time = TwentyFourHourToAMPM(item.time);
      return time;
    } else {
      return;
    }
  };

  const timeText = useMemo(() => getTimeText(), [item]);

  const conditionalStyles = {
    listItemTimeText: {
      color: textColor,
      fontFamily: item.type !== ListItemType.Task ? 'InterMed' : 'Inter'
    }
  };

  return (
    <Text
      adjustsFontSizeToFit={true}
      numberOfLines={1}
      style={[styles.listItemTimeText, conditionalStyles.listItemTimeText]}
    >
      {timeText}
    </Text>
  );
};

const styles = StyleSheet.create({
  listItemTimeText: {
    padding: 2,
    marginLeft: 12
  }
});
