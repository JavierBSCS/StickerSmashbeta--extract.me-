import { Text, View } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

const RecipeIngredients: React.FC<{ingredients: string[] | undefined}> = ({
  ingredients
})=>{ 

  return (
    <View style={{ padding: 10, flexDirection: "column", gap: 10 }}>
      <Text style={{ fontFamily: "Poppins", fontSize: 22 }}>Ingredients</Text>
      <View
        style={{
          flexDirection: "column",
          gap: 15,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        {ingredients?.map((item) => (
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
            <Feather name="check-circle" size={30} color="#e68a00" />
            <Text
              style={{
                flexWrap: "wrap",
                paddingRight: 10,
                fontFamily: "Poppins",
                fontSize: 17,
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

export default RecipeIngredients;