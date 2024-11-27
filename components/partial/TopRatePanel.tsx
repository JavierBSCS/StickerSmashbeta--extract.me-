import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "@/database/supabase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AirbnbRating } from "react-native-ratings";

// Define the RecipeData interface
interface RecipeData {
  recipe_id: string;
  recipe_title: string;
  author_name: string;
  total_rate: number;
  recipe_img: string;
  profile_pic: string;
}

// Update TopRatePanel to accept a `recipe` prop
const TopRatePanel: React.FC<RecipeData> = ({
  recipe_id,
  recipe_title,
  author_name,
  total_rate,
  recipe_img,
  profile_pic,
}) => {
  const [recipeImg, setRecipeImg] = useState<string>();

  useEffect(() => {
    const fetchImgUrl = async () => {
      const imgPath = `posts_img/${recipe_id}/${recipe_img}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("hr_bucket")
        .getPublicUrl(imgPath);

      if (storageError) {
        throw storageError;
      }
      setRecipeImg(storageData.publicUrl);
    };
    fetchImgUrl();
  }, [recipe_id]);

  return (
    <View
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 10,
        padding: 0,
        flexDirection: "column",
        flex: 1,
      }}
    >
      
      <View>
        {recipeImg && (
          <Image
            source={{ uri: recipeImg }}
            style={{
              width: "100%",
              height: 200,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: 2,
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <MaterialCommunityIcons name="medal" size={24} color="gold" />
            <Text style={{ fontFamily: "RobotoM", fontSize: 20 }}>
              {recipe_title}
            </Text>
          </View>
          <View>
            <Text style={{ fontFamily: "Poppins" }}>by {author_name}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: 'space-between',
              gap: 8,
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 5,
              borderRadius: 50,
              borderRightWidth: 1,
              borderBottomWidth: 1,
              borderColor: "rgba(0, 0, 0, .4)",
              elevation: 2,
              width: '100%',
              paddingLeft: 10,
              paddingRight: 10
            }}
          >
            <AirbnbRating
              count={4}
              defaultRating={total_rate}
              size={20}
              showRating={false}
            />
            <Text
              style={{
                fontFamily: "Poppins",
                fontSize: 15,
                alignSelf: "center",
              }}
            >
              {total_rate.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TopRatePanel;
