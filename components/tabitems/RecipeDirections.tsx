import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

const RecipeDirections: React.FC<{directions: string[] | undefined}> = ({
  directions
})=>{ 

  return (
    <View style={{ padding: 10, flexDirection: "column", gap: 10 }}>
      <Text style={{ fontFamily: "Poppins", fontSize: 22 }}>Directions</Text>
      <View
        style={{
          flexDirection: "column",
          gap: 15,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        {directions?.map((item, index) => (
          <View
            key={item}
            style={{
              flexDirection: "row",
              gap: 10,
              paddingBottom: 15,
              borderBottomWidth: 1,
              borderColor: "#e6e6e6",
            }}
          >
            <Pressable
              style={styles.audio_btn}
              // onPress={() => readText(index + 1, item)}
              android_ripple={{
                color: "rgba(0, 0, 0, 0.1)",
                borderless: false,
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  color: "#e68a00",
                  fontFamily: "Aclonica",
                }}
              >
                {index + 1}
              </Text>
            </Pressable>
            <Text
              style={{
                fontFamily: "Poppins",
                fontSize: 16,
                flexWrap: "wrap",
                paddingRight: 40,
              }}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  audio_btn: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RecipeDirections;
