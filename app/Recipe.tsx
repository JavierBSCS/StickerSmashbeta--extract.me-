import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import CustomView from "@/components/themed/CustomView";
import Entypo from "@expo/vector-icons/Entypo";
import RecipeHeader from "@/components/partial/RecipeHeader";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import RecipeInfo from "@/components/tabitems/RecipeInfo";
import RecipeIngredients from "@/components/tabitems/RecipeIngredients";
import RecipeDirections from "@/components/tabitems/RecipeDirections";

import { useRecipeImage } from "@/hooks/fetchImage";
import { useRecipeStore } from "@/hooks/fetchRecipeData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/database/supabase";

export default function Recipe() {
  const params = useLocalSearchParams();
  const { recipe_id, img_url } = params; // Retrieve passed parameters

  // Debugging Parameters
  console.log("Params:", params);

  const [currTab, setCurrTab] = useState<number>(0);
  const { isAuth, user } = useCurrentUser();

  const { imgUrl, fetchRecipeImage } = useRecipeImage();
  const { fetchRecipeInfo, info, others, nutri, ingredients, directions } =
    useRecipeStore();

  // Fetch image and recipe info on mount
  useEffect(() => {
    if (recipe_id && img_url) {
      fetchRecipeImage(recipe_id, img_url);
      fetchRecipeInfo(recipe_id);
    }
  }, [recipe_id, img_url]);

  // Add recommendation to the database
  useEffect(() => {
    const addRecommendation = async () => {
      if (!isAuth || !info) return;

      try {
        const { error } = await supabase.from("recommend").insert({
          user_id: user?.user_id,
          category: info?.category,
        });

        if (error) {
          console.error("Failed to add recommendation:", error);
        } else {
          console.log("Recommendation added successfully.");
        }
      } catch (err) {
        console.error("Error adding recommendation:", err);
      }
    };

    addRecommendation();
  }, [recipe_id, info, isAuth]);

  // Fallback for missing parameters
  if (!recipe_id || !img_url) {
    return (
      <CustomView>
        <Text>Recipe not found. Please go back and try again.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: "blue" }}>Go Back</Text>
        </Pressable>
      </CustomView>
    );
  }

  // Tab content based on current tab selection
  const renderTabContent = () => {
    if (currTab === 0) return <RecipeInfo others={others} nutri={nutri} />;
    if (currTab === 1) return <RecipeIngredients ingredients={ingredients} />;
    if (currTab === 2) return <RecipeDirections directions={directions} />;
    return null;
  };

  return (
    <CustomView style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backBtn}
        android_ripple={{ color: "rgba(0, 0, 0, 0.5)", radius: 17 }}
      >
        <MaterialCommunityIcons
          name="arrow-left-drop-circle"
          size={40}
          color="rgba(230, 138, 0, 0.9)"
        />
      </Pressable>

      <FlatList
        ListHeaderComponent={
          <>
            {imgUrl && (
              <Image
                source={{ uri: imgUrl }}
                style={styles.recipeImage}
              />
            )}
            <RecipeHeader
              title={info?.title}
              author={info?.author}
              recipe_id={recipe_id}
            />
            <View style={styles.tab_btn_panel}>
              <Pressable
                onPress={() => setCurrTab(0)}
                style={[
                  styles.tabButton,
                  currTab === 0 && styles.activeTab,
                ]}
                android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
              >
                <AntDesign name="infocirlceo" size={24} color="black" />
                <Text style={styles.tabText}>Info</Text>
              </Pressable>
              <Pressable
                onPress={() => setCurrTab(1)}
                style={[
                  styles.tabButton,
                  currTab === 1 && styles.activeTab,
                ]}
                android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
              >
                <Feather name="shopping-cart" size={24} color="black" />
                <Text style={styles.tabText}>Ingredients</Text>
              </Pressable>
              <Pressable
                onPress={() => setCurrTab(2)}
                style={[
                  styles.tabButton,
                  currTab === 2 && styles.activeTab,
                ]}
                android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
              >
                <Entypo name="list" size={24} color="black" />
                <Text style={styles.tabText}>Directions</Text>
              </Pressable>
            </View>
          </>
        }
        data={[renderTabContent()]}
        renderItem={({ item }) => <View style={styles.tabContent}>{item}</View>}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
      />
    </CustomView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backBtn: {
    position: "absolute",
    zIndex: 1,
    top: 30,
    left: 20,
    elevation: 5,
  },
  recipeImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  tab_btn_panel: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  tabButton: {
    alignItems: "center",
    padding: 5,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "orange",
  },
  tabText: {
    fontFamily: "Poppins",
    fontSize: 15,
    marginTop: 5,
  },
  tabContent: {
    padding: 10,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
});
