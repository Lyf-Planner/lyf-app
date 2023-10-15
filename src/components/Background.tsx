import { View, Image, ScrollView, StyleSheet } from "react-native";

const TREE = require("../../assets/images/tree.png");
const ROUND_TREE = require("../../assets/images/roundtree.png");
const BRANCH = require("../../assets/images/branch.png");

export const Background = ({ children }: any) => {
  return (
    <View className="bg-green-700 z-0 flex-auto">
      <Image
        source={TREE}
        alt="tree"
        style={styles.bigTree}
        resizeMode="contain"
      />
      <Image
        source={BRANCH}
        alt="tree"
        style={styles.branch}
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
        resizeMethod={"resize"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  roundTree: {
    position: "absolute",
    height: "35%",
    bottom: 0,
    right: -30,

  },
  bigTree: {
    position: "absolute",
    height: "30%",
    bottom: -10,
    right: -20,
  },
  smallTree: {
    position: "absolute",
    bottom: 0,
    right: 80,
    height: "15%",
  },
  branch: {
    position: "absolute",
    top: 125,
    right: -110, 
    width: "80%",
    transform: [{ rotate: "70deg" }, { scaleY: -1 }],
  },
});
