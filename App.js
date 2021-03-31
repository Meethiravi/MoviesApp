import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
// import { useDeviceOrientation } from "@react-native-community/hooks";

export default function App() {
  // const { landscape } = useDeviceOrientation();
  return (
    <SafeAreaView style={styles.container}>
      <Text>MoviesApp</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // height: landscape ? "100%" : "30%",
    alignItems: "center",
    justifyContent: "center",
  },
});
