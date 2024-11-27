import { StyleSheet,Dimensions } from "react-native";
import React from "react";


import { LinearGradient } from "expo-linear-gradient";

export default function StatusBarGradient() {

  let curr_width = Dimensions.get('window').width;

  return (
    <LinearGradient
      colors={["rgba(0,0,0,0.9)", "transparent"]}
      style={{
        position: "absolute",
        width: curr_width,
        left: 0,
        top: 0,
        height: 20,
        zIndex: 2,
      }}
    />
  );
}

const styles = StyleSheet.create({});
