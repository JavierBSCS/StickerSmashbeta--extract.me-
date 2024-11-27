import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/database/supabase";
import RecipePanel from "@/components/partial/RecipePanel";
import CustomView from "@/components/themed/CustomView";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface Author {
  f_name: string;
  l_name: string;
}

interface RecipeData {
  recipe_id: string;
  title: string;
  author: Author;
  category: string;
  img_url: string;
}

export default function Category() {
  const params = useLocalSearchParams();
  const { category } = params;

  const [recipes, setRecipes] = useState<RecipeData[]>();

  useEffect(() => {
    const fetchRecipeCategory = async () => {
      const { data, error } = await supabase
        .from("recipe")
        .select(
          `
        recipe_id, 
        title,
        category,
        img_url,
        author:user (
          f_name,
          l_name
        )
        `
        )
        .eq("category", category);

      // console.log(data);
      setRecipes(data);

      if (error) console.log(error);
    };
    fetchRecipeCategory();
  }, [category]);

  return (
    <CustomView style={{ flex: 1 }}>
      <ImageBackground source={require("@/assets/backdrop/bg3.jpg")}>
        <ScrollView
          style={{
            height: "100%",
            padding: 15,
            paddingTop: 30,
            backgroundColor: "rgba(230, 138, 0, 0.5)",
          }}
        >
          <View style={{ flexDirection: "column", gap: 30 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Pressable onPress={()=> router.back()}>
                <MaterialCommunityIcons
                  name="arrow-left-drop-circle"
                  size={40}
                  color="rgba(230, 138, 0, 0.9)"
                />
              </Pressable>
              <Text
                style={{
                  fontFamily: "Pacifico",
                  fontSize: 30,
                  color: "#fff",
                }}
              >
                {category}
              </Text>
            </View>
            {!recipes && <ActivityIndicator size="large"/>}
            <View style={{ flexDirection: "column", gap: 3 }}>
              {recipes &&
                recipes.map((item) => (
                  <RecipePanel {...item} key={item.recipe_id} />
                ))}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </CustomView>
  );
}

const styles = StyleSheet.create({});
