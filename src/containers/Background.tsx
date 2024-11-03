import { View, Image, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';

import { branch, roundTree, tree, world } from 'assets/images';
import { LyfElement } from 'utils/abstractTypes';
import { lightGreen, primaryGreen } from 'utils/colours';

type Props = {
  children: LyfElement
}

export const Background = ({ children }: Props) => {
  const background = (
    <View style={styles.page}>
      <Image
        source={branch}
        alt="tree"
        style={styles.branch}
        resizeMode="contain"
      />

      <Image
        source={world}
        alt="world"
        style={styles.world}
        resizeMode="contain"
      />

      <Image
        source={tree}
        alt="tree"
        style={styles.bigTree}
        resizeMode="contain"
      />
      <Image
        source={tree}
        alt="tree"
        style={styles.smallTree}
        resizeMode="contain"
      />
      <Image
        source={roundTree}
        alt="round-tree"
        style={styles.roundTree}
        resizeMode="contain"
        resizeMethod={'resize'}
      />
      {children}
    </View>
  );

  // On web, wrapping with a TouchableWithoutFeedback
  // Prevents the text boxes from being typable (they keyboard is dismissed immediately)
  if (Platform.OS === 'web') {
    return background;
  }

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => Keyboard.dismiss()}
    >
      {background}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  bigTree: {
    bottom: -10,
    height: '30%',
    position: 'absolute',
    right: -40,
    zIndex: 40
  },
  branch: {
    left: Platform.OS === 'web' ? '55%' : undefined,
    position: 'absolute',
    right: Platform.OS === 'web' ? undefined : -130,
    top: 120,
    transform: [{ rotate: '70deg' }, { rotateX: '180deg' }],
    width: '80%',
    zIndex: 5
  },
  page: {
    backgroundColor: primaryGreen,
    flex: 1,
    width: '100%',
    zIndex: 0
  },
  roundTree: {
    bottom: 0,
    height: '35%',
    left: Platform.OS === 'web' ? -300 : -350,
    position: 'absolute'
  },
  smallTree: {
    bottom: 0,
    height: '15%',
    position: 'absolute',
    right: 50,
    zIndex: 50
  },
  world: {
    height: Platform.OS === 'web' ? '60%' : '50%',
    left: Platform.OS === 'web' ? undefined : -550,
    position: 'absolute',
    right: Platform.OS === 'web' ? '50%' : undefined,
    top: -100,
    zIndex: 0
  }
});
