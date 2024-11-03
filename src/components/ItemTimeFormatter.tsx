import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { LocalItem } from 'schema/items';
import { TwentyFourHourToAMPM } from 'utils/dates';

type Props = {
  item: LocalItem;
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
      fontSize: 15
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
    marginLeft: 12,
    padding: 2
  }
});
