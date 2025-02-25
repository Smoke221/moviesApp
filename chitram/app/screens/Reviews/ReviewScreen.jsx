import colors from "@/app/theme/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReviewsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚀</Text>
      <Text style={styles.title}>Coming Soon...</Text>
      <Text style={styles.subtitle}>We're working on something awesome. Stay tuned!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 20,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: "center",
  },
});
