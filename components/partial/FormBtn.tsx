import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function FormBtn() {
  return (
    <View
      style={{
        justifyContent: "center",
        flexGrow: 1,
        padding: 30,
        paddingTop: 60
      }}
    >
      <View style={{ flexDirection: "column", gap: 8 }}>
        <Pressable
          style={[styles.form_btn, styles.fbtn_login]}
          onPress={() => router.navigate("/Login")}
          android_ripple={{
            color: "rgba(0, 0, 0, 0.1)",
            borderless: false,
          }}
        >
          <Text
            style={[styles.form_btn_text, { color: "rgba(230, 138, 0, 0.9)" }]}
          >
            Login
          </Text>
        </Pressable>
        <Pressable
          style={[styles.form_btn, styles.fbtn_signup]}
          onPress={() => router.navigate("/Signup")}
          android_ripple={{
            color: "rgba(0, 0, 0, 0.1)",
            borderless: false,
          }}
        >
          <Text style={styles.form_btn_text}>Signup</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form_btn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
  },
  form_btn_text: {
    fontFamily: "Poppins",
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
  },
  fbtn_login: {
    borderWidth: 2,
    borderColor: "rgba(230, 138, 0, 0.9)",
  },
  fbtn_signup: {
    backgroundColor: "rgba(230, 138, 0, 0.9)",
  },
});
