import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Loader } from "../general/MiscComponents";
import { BouncyPressable } from "./BouncyPressable";

export const ActionButton = ({
  color,
  icon,
  title,
  func,
  textColor = "white",
  loadingOverride = false,
  notPressable = false,
}) => {
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
          {icon}
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
    width: "100%",
    height: "100%",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  contentWrapper: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
