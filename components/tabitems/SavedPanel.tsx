import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function SavedPanel() {
  return (
    <View style={styles.container2}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontFamily: 'Poppins', fontSize: 20, color: '#ccc' }}>no saved recipes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container2: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 20,
  },
});
