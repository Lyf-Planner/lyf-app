import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { BouncyPressable } from 'components/BouncyPressable';
import { Loader } from 'components/Loader';

type Props = {
  color: string,
  title: string,
  func: () => Promise<unknown> | unknown,
  isAsync: boolean
  textColor?: string,
  loadingOverride?: boolean,
  notPressable?: boolean,
  height?: number
}

export const ActionButton = ({
  color,
  title,
  func,
  isAsync,
  textColor = 'white',
  loadingOverride = false,
  notPressable = false,
  height
}: Props) => {
  const [loading, setLoading] = useState(false);

  return (
    <BouncyPressable
      style={[styles.actionButtonMain, { backgroundColor: color, height }]}
      disabled={notPressable}
      onPress={async () => {
        if (isAsync) {
          setLoading(true);
          await func();
          setLoading(false);
        } else {
          func();
        }
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
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
    minHeight: 40,
    padding: 4,
    width: '100%'
  },
  actionButtonText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    fontWeight: '400'
  },
  contentWrapper: { alignItems: 'center', flexDirection: 'row', gap: 8 }
});
