import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Dashboard() {
  const { user } = useCurrentUser();

  return (
    <View
      style={{
        justifyContent: "center",
        flexGrow: 1,
        padding: 15,
        gap: 20,
        paddingTop: 50,
      }}
    >
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <View style={{ width: 100, height: 100 }}>
          <Image
            source={require("@/assets/category/meat.jpg")}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </View>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 30 }}>
            <View
              style={{
                flexDirection: "column",
                gap: 5,
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "RobotoM", fontSize: 20 }}>10</Text>
              <Text style={{ fontFamily: "Poppins" }}>posts</Text>
            </View>
            <View
              style={{ flexDirection: "column", gap: 5, alignItems: "center" }}
            >
              <Text style={{ fontFamily: "RobotoM", fontSize: 20 }}>13</Text>
              <Text style={{ fontFamily: "Poppins" }}>followers</Text>
            </View>
            <View
              style={{ flexDirection: "column", gap: 5, alignItems: "center" }}
            >
              <Text style={{ fontFamily: "RobotoM", fontSize: 20 }}>2</Text>
              <Text style={{ fontFamily: "Poppins" }}>following</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "column" }}>
        <Text style={{ fontFamily: "RobotoM", fontSize: 20 }}>
          {user?.f_name} {user?.l_name}
        </Text>
        <Text style={{ fontFamily: "Poppins" }}>{ user?.email }</Text>
      </View>
      <Text style={{ flexWrap: "wrap", fontFamily: "Poppins" }}>
        {user?.bio}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
