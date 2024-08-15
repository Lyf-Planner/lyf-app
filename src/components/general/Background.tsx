import { View, Image, StyleSheet } from 'react-native';
import { LyfElement } from 'utils/abstractTypes';
import { lightGreen, primaryGreen } from 'utils/colours';

const WORLD = require('../../../assets/images/background/sams-world.png');
const TREE = require('../../../assets/images/background/tree.png');
const ROUND_TREE = require('../../../assets/images/background/roundtree.png');
const BRANCH = require('../../../assets/images/background/branch-transparent.png');

type Props = {
  children: LyfElement
}

export const Background = ({ children }: Props) => {
  return (
    <View style={styles.page}>

      <Image
        source={BRANCH}
        alt="tree"
        style={styles.branch}
        resizeMode="contain"
      />

      <Image
        source={WORLD}
        alt="world"
        style={styles.world}
        resizeMode="contain"
      />

      <Image
        source={TREE}
        alt="tree"
        style={styles.bigTree}
        resizeMode="contain"
      />
      <Image
        source={TREE}
        alt="tree"
        style={styles.smallTree}
        resizeMode="contain"
      />
      <Image
        source={ROUND_TREE}
        alt="round-tree"
        style={styles.roundTree}
        resizeMode="contain"
        resizeMethod={'resize'}
      />
      {children}
    </View>
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
    left: -350
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
    zIndex: 60,
    top: 120,
    right: -130,
    width: '80%',
    transform: [{ rotate: '70deg' }, { rotateX: '180deg' }]
  },
  world: {
    position: 'absolute',
    zIndex: 0,
    top: -100,
    right: -200,
    height: '50%'
  },
});
