import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

interface Info {
  others: string[] | null,
  nutri: string[] | undefined
}

const RecipeInfo: React.FC<Info> = ({
  others,
  nutri
})=>{ 
  
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        {/* <Text style={[styles.text_style]}>level: {others?.level}</Text>
        <View style={{ flexDirection: "column", gap: 12 }}>
          <Text style={[styles.text_style]}>cook: {others?.cook}</Text>
          <Text style={[styles.text_style]}>prep: {others?.prep}</Text>
        </View>
        <View style={{ flexDirection: "column", gap: 12 }}>
          <Text style={[styles.text_style]}>total: {others?.total}</Text>
          <Text style={[styles.text_style]}>yield: {others?.yield}</Text>
        </View> */}
      </View>
      <Text
        style={{
          fontFamily: "RobotoM",
          fontSize: 20,
          backgroundColor: "#ccc",
          padding: 10,
        }}
      >
        NUTRITIONS
      </Text>
      <View style={{ flexDirection: "column", padding: 10, gap: 5 }}>
        {nutri &&
          nutri.map((info, index) => {
            const parts = info.split(":");
            const label = parts[0].trim();
            const value = parts[1].trim();

            return (
              <View key={index} style={[styles._nutri]}>
                <Text
                  style={{
                    color: "#666",
                    fontSize: 16,
                    fontFamily: "Poppins",
                  }}
                >
                  {label}
                </Text>
                <Text
                  style={{ color: "#666", fontFamily: "RobotoM", fontSize: 18 }}
                >
                  {value}
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text_style: {
    fontFamily: "OpenSans",
    fontSize: 16,
  },
  _nutri: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.1)",
    padding: 10,
  },
  _nutri_text: {
    padding: 5,
  },
});

export default RecipeInfo;
