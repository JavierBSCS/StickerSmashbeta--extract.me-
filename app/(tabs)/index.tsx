import { useEffect, useState } from "react";
import {
  ImageBackground,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

import CustomView from "@/components/themed/CustomView";
import HomeHeader from "@/components/partial/HomeHeader";
import CategoryPanel from "@/components/partial/CategoryPanel";
import RecipePanel from "@/components/partial/RecipePanel";
import { useRecipeToday } from "@/hooks/useRecipes";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import TopRatePanel from "@/components/partial/TopRatePanel";
import { useTopRating } from "@/hooks/fetchTopRated";
import { supabase } from "@/database/supabase";

interface RecipeData {
  recipe_id: string;
  recipe_title: string;
  author_name: string;
  total_rate: number;
  recipe_img: string;
  profile_pic: string;
}

export default function index() {
  const { recipes, loading, fetchRecipe, error } = useRecipeToday();
  const { fetchData, isAuth, user } = useCurrentUser();
  const { fetchTopRecipe, top_recipes } = useTopRating();

  useEffect(() => {
    fetchData();
    fetchTopRecipe();
  }, [user?.user_id]);

  useEffect(() => {
    const fetchRecom = async () => {
      if (!isAuth) return false;
      const { data, error } = await supabase.rpc("get_category_counts");
      if (data.length < 1) return false;

      fetchRecipe(data[0].category);
      return true;
    };
    fetchRecom().then((res) => {
      if (!res) {
        console.log("ok lets see");
        fetchRecipe(null);
      }
    });
  }, [user]);

  return (
    <CustomView style={{ flex: 1 }}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require("@/assets/backdrop/bg3.jpg")}
      >
        <ScrollView>
          <View style={{ width: "100%", height: 400 }}>
            <Image
              source={require("@/assets/backdrop/banner2.jpg")}
              style={{ resizeMode: "cover", width: "100%", height: 400 }}
            />
          </View>
          <View style={{ backgroundColor: "rgba(230, 138, 0, 0.8)" }}>
            <HomeHeader title="CATEGORY" />
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ flexDirection: "row", gap: 10, padding: 10 }}>
                  <CategoryPanel
                    title="MEAT"
                    category="meat"
                    imageSource={require("@/assets/category/meat.jpg")}
                  />
                  <CategoryPanel
                    title="VEGIE"
                    category="vegetable"
                    imageSource={require("@/assets/category/vegie.jpg")}
                  />
                  <CategoryPanel
                    title="DESSERT"
                    category="dessert"
                    imageSource={require("@/assets/category/dessert.jpg")}
                  />
                  <CategoryPanel
                    title="DRINKS"
                    category="beverage"
                    imageSource={require("@/assets/category/drinks.jpg")}
                  />
                </View>
              </ScrollView>
            </View>
            <HomeHeader title="TOP RATED RECIPES" />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                {!top_recipes && (
                  <ActivityIndicator
                    size="small"
                    style={{ padding: 40, justifyContent: "center" }}
                  />
                )}
                {top_recipes && (
                  <View style={{ flexDirection: "row", gap: 3, padding: 3 }}>
                    {top_recipes.map((item: any) => (
                      <TopRatePanel {...item} key={item.recipe_id} />
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
            <HomeHeader title="RECOMENDATIONS" />
            <ImageBackground source={require("@/assets/backdrop/bg3.jpg")}>
              <View style={{ backgroundColor: "rgba(230, 138, 0, 0.8)" }}>
                {!recipes && loading && (
                  <ActivityIndicator size="small" style={{ padding: 40 }} />
                )}
                {error && (
                  <Text style={{ padding: 40, fontFamily: "Poppins" }}>
                    {error}
                  </Text>
                )}
                {recipes && (
                  <View
                    style={{
                      padding: 10,
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {recipes.map((item) => (
                      <RecipePanel {...item} key={item.recipe_id} />
                    ))}
                  </View>
                )}
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
      </ImageBackground>
    </CustomView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewPager: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Add background color to make it visible
  },
});
