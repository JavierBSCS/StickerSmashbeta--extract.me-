import { Tabs } from "expo-router";
import React from "react";
// import Feather from "@expo/vector-icons/Feather";
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenListeners={{
        tabPress: (event) => {
          const tabName = event.target as string;
        },
      }}
      screenOptions={{
        tabBarActiveTintColor: "#333",
        headerShown: false,
        tabBarStyle: {
          paddingLeft: "16%",
          paddingRight: "16%",
          backgroundColor: "#e68a00",
          borderTopWidth: 0,
          padding: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("@/assets/icons/home.png")}
              style={{ width: 30, height: 30 }}
            />
            // <Feather
            //   name="home"
            //   size={24}
            //   color={focused ? color : "rgba(255, 255, 255, 0.9)"}
            // />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("@/assets/icons/rss.png")}
              style={{ width: 30, height: 30 }}
            />
            // <Feather
            //   name="heart"
            //   size={24}
            //   color={focused ? color : "rgba(255, 255, 255, 0.9)"}
            // />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("@/assets/icons/search.png")}
              style={{ width: 30, height: 30 }}
            />
            // <Feather
            //   name="search"
            //   size={24}
            //   color={focused ? color : "rgba(255, 255, 255, 0.9)"}
            // />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "User",
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require("@/assets/icons/user.png")}
              style={{ width: 30, height: 30 }}
            />
            // <FontAwesome5
            //   name="user-circle"
            //   size={24}
            //   color={focused ? color : "rgba(255, 255, 255, 0.9)"}
            // />
          ),
        }}
      />
    </Tabs>
  );
}
