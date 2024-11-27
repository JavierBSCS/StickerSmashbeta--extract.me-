import {
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import * as SecureStore from "expo-secure-store";

export default function SettingMenu() {
  const { isAuth, logout } = useCurrentUser();


  return (
    <View style={styles.container2}>
      {isAuth && (
        <>
          <Pressable
            onPress={() => router.navigate("/CreateRecipe")}
            style={styles.setting_nav}
            android_ripple={{
              color: "rgba(0, 0, 0, 0.1)",
              borderless: false,
            }}
          >
            <Image
              source={require("@/assets/icons/create.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text style={{ fontFamily: "Poppins", fontSize: 20 }}>
              Create Recipe
            </Text>
          </Pressable>
          <Pressable
            style={styles.setting_nav}
            android_ripple={{
              color: "rgba(0, 0, 0, 0.1)",
              borderless: false,
            }}
          >
            <Image
              source={require("@/assets/icons/photos.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text style={{ fontFamily: "Poppins", fontSize: 20 }}>Posts</Text>
          </Pressable>
          <Pressable
            style={styles.setting_nav}
            android_ripple={{
              color: "rgba(0, 0, 0, 0.1)",
              borderless: false,
            }}
          >
            <Image
              source={require("@/assets/icons/heart.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text style={{ fontFamily: "Poppins", fontSize: 20 }}>Saved</Text>
          </Pressable>

        </>
      )}
      <Pressable
        onPress={() => router.navigate("/Settings")}
        style={styles.setting_nav}
        android_ripple={{
          color: "rgba(0, 0, 0, 0.1)",
          borderless: false,
        }}
      >
        <Image
          source={require("@/assets/icons/cogwheel.png")}
          style={{ width: 30, height: 30 }}
        />
        <Text style={{ fontFamily: "Poppins", fontSize: 20 }}>Settings</Text>
      </Pressable>
      <Pressable
        onPress={() => router.navigate("/About")}
        style={styles.setting_nav}
        android_ripple={{
          color: "rgba(0, 0, 0, 0.1)",
          borderless: false,
        }}
      >
        <Image
          source={require("@/assets/icons/info.png")}
          style={{ width: 30, height: 30 }}
        />
        <Text style={{ fontFamily: "Poppins", fontSize: 20 }}>About</Text>
      </Pressable>
      <Pressable
        onPress={() => BackHandler.exitApp()}
        style={styles.setting_nav}
        android_ripple={{
          color: "rgba(0, 0, 0, 0.1)",
          borderless: false,
        }}
      >
        <Image
          source={require("@/assets/icons/shutdown.png")}
          style={{ width: 30, height: 30 }}
        />
        <Text style={{ fontFamily: "Poppins", fontSize: 20 }}>Quit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container2: {
    padding: 10,
    flexDirection: "column",
    gap: 4,
    borderColor: "#ccc",
    paddingTop: 20,
  },

  setting_nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "rgba(230, 138, 0, 0.1)",
    borderRadius: 10,
  },
});
