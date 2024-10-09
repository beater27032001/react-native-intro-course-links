import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "center",
    gap: 5,
  },
  primaryTitle: {
    color: colors.green[300],
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryTitle: { color: colors.gray[300], fontSize: 16 },
});
