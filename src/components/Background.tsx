import { View, Image, StyleSheet } from "react-native";

const TREE = require("../../assets/images/tree.png");
const ROUND_TREE = require("../../assets/images/roundtree.png");
const BRANCH = require("../../assets/images/branch.png");

export const Background = ({ children }) => {
  return (
    <View style={styles.page}>
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
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "rgb(21, 128, 61)",
    zIndex: 0,
    flex: 1,
  },
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
    right: -40,
  },
  smallTree: {
    position: "absolute",
    bottom: 0,
    right: 50,
    height: "15%",
  },
  branch: {
    position: "absolute",
    top: 110,
    left: -130,
    width: "80%",
    transform: [{ rotate: "105deg" }],
  },
});
