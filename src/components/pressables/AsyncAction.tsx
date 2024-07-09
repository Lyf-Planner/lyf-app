import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Loader } from '../general/MiscComponents';
import { BouncyPressable } from './BouncyPressable';

type Props = {
  color: string,
  title: string, 
  func: () => void,
  textColor?: string,
  loadingOverride?: boolean,
  notPressable?: boolean
}

export const ActionButton = ({
  color,
  title,
  func,
  textColor = 'white',
  loadingOverride = false,
  notPressable = false
}: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <BouncyPressable
      style={[styles.actionButtonMain, { backgroundColor: color }]}
      disabled={notPressable}
      onPress={async () => {
        setLoading(true);
        await func();
        setLoading(false);
      }}
    >
      {loading || loadingOverride ? (
        <Loader size={20} color={textColor} />
      ) : (
        <View style={styles.contentWrapper}>
          <Text style={[styles.actionButtonText, { color: textColor }]}>
            {title}
          </Text>
        </View>
      )}
    </BouncyPressable>
  );
};

const styles = StyleSheet.create({
  actionButtonMain: {
    padding: 8,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  contentWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Lexend'
  }
});
