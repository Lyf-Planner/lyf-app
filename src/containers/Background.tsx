import { branch, roundTree, tree, world } from 'assets/images';
import { View, Image, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
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
  page: {
    backgroundColor: primaryGreen,
    zIndex: 0,
    flex: 1,
    width: '100%'
  },
  roundTree: {
    position: 'absolute',
    height: '35%',
    bottom: 0,
    left: Platform.OS === 'web' ? -300 : -350
  },
  bigTree: {
    position: 'absolute',
    zIndex: 40,
    height: '30%',
    bottom: -10,
    right: -40
  },
  smallTree: {
    position: 'absolute',
    zIndex: 50,
    bottom: 0,
    right: 50,
    height: '15%'
  },
  branch: {
    position: 'absolute',
    zIndex: 5,
    top: 120,
    right: Platform.OS === 'web' ? undefined : -130,
    left: Platform.OS === 'web' ? '55%' : undefined,
    width: '80%',
    transform: [{ rotate: '70deg' }, { rotateX: '180deg' }]
  },
  world: {
    position: 'absolute',
    zIndex: 0,
    top: -100,
    left: Platform.OS === 'web' ? undefined : -550,
    right: Platform.OS === 'web' ? '50%' : undefined,
    height: Platform.OS === 'web' ? '60%' : '50%'
  },
});
