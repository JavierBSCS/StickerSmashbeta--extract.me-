import { Image, Pressable, Text } from "react-native";
import React from "react";
import { router } from "expo-router";

interface RecipeData {
  recipe_id: string;
  img_name: string;
  img_url: string;
}

const UserPostItem: React.FC<RecipeData> = ({ recipe_id, img_name, img_url }) => {
  
  return (
    <Pressable
      onPress={() => {
        router.navigate({
          pathname: "/Recipe",
          params: { recipe_id, img_url:img_name },
        });
      }}
    >
      {img_url && (

        <Image
          resizeMode="cover"
          style={{
            width: 100,
            height: 100,
          }}
          source={{
            uri: img_url,
          }}
        />
      )}
    </Pressable>
  );
};
1;

export default UserPostItem;
