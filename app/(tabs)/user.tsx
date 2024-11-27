import {
  StyleSheet,
  Text,
  View,
  // ImageBackground,
  Pressable,
  Image,
  ScrollView,
  // BackHandler,
  // ScrollView,
} from "react-native";
import React, { useState } from "react";

// import { router } from "expo-router";
import CustomView from "@/components/themed/CustomView";
import Dashboard from "@/components/partial/Dashboard";
import FormBtn from "@/components/partial/FormBtn";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import * as SecureStore from "expo-secure-store";
import SettingMenu from "@/components/tabitems/SettingMenu";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import PostPanel from "@/components/tabitems/PostPanel";
// import SavedPanel from "@/components/tabitems/SavedPanel";

export default function user() {
  const { isAuth, logout } = useCurrentUser();

  const handleLogout = async () => {
    await AsyncStorage.setItem("user"," ");
    logout();
  };

  return (
    <CustomView style={{ flex: 1, flexDirection: "column", gap: 10 }}>
      <ScrollView>
        <View style={{ flexDirection: "column" }}>
          {isAuth && <Dashboard />}
          {!isAuth && <FormBtn />}
        </View>
        <View style={{ flexDirection: "row", padding: 15, gap: 5 }}>
          <Pressable
            onPress={() => router.navigate("/EditProfile")}
            style={styles.setting_nav}
            android_ripple={{
              color: "rgba(0, 0, 0, 0.1)",
              borderless: false,
            }}
          >
            <Text style={{ fontFamily: "Poppins", fontSize: 15, textAlign: 'center' }}>
              edit profile
            </Text>
          </Pressable>
          <Pressable
            onPress={handleLogout}
            style={styles.setting_nav}
            android_ripple={{
              color: "rgba(0, 0, 0, 0.1)",
              borderless: false,
            }}
          >
            <Text style={{ fontFamily: "Poppins", fontSize: 15, textAlign: 'center' }}>logout</Text>
          </Pressable>
        </View>
        <SettingMenu />
      </ScrollView>
    </CustomView>
  );
}

const styles = StyleSheet.create({
  setting_nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 5,
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
});
