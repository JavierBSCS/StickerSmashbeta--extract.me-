import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { supabase } from "@/database/supabase";

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

const RecipePanel: React.FC<RecipeData> = ({
  recipe_id,
  title,
  author,
  category,
  img_url,
}) => {

  const [imgUrl, setImgUrl] = useState<string>();

  useEffect(() => {
    const fetchRecipePic = async () => {
      const imgPath = `posts_img/${recipe_id}/${img_url}`;
      try {
        const { data, error: storageError } = await supabase.storage
          .from("hr_bucket")
          .getPublicUrl(imgPath);
        if (storageError) throw storageError;

        setImgUrl(data.publicUrl);
      } catch (error) {
        console.error("Error fetching recipe info:", error);
      }
    };
    fetchRecipePic();
  }, []);

  return (
    <Pressable
      android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
      style={styles.rp_panel}
      key={recipe_id}
      onPress={() =>
        router.navigate({
          pathname: "/Recipe",
          params: { recipe_id, img_url },
        })
      }
    >
      {!imgUrl && <ActivityIndicator size="small" />}
      {imgUrl && (
        <Image
          source={{ uri: imgUrl }}
          resizeMode="cover"
          alt="dish"
          style={{
            width: 65,
            height: 70,
            borderRadius: 10,
          }}
        />
      )}
      <View style={styles.rp_info}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.rp_title}>
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#333", fontFamily: "Poppins", fontSize: 13 }}>
            by {author.f_name} {author.l_name}
          </Text>
          <Text style={styles.category_title}>{category}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  rp_panel: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#333",
    gap: 10,
    borderRadius: 10,
    overflow: "scroll",
    padding: 5,
    elevation: 10,
    width: "100%",
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: "rgba(0, 0, 0, .4)",
  },
  rp_info: {
    flex: 1,
    flexDirection: "column",
  },
  rp_title: {
    fontFamily: "Aclonica",
    fontSize: 18,
    color: "#333",
    width: "100%",
  },
  rp_desc: {
    fontFamily: "Poppins",
    color: "#fff",
    width: "80%",
    fontSize: 13,
  },
  rp_like_btn: {
    padding: 10,
  },
  category_title: {
    borderRadius: 5,
    padding: 2,
    paddingLeft: 5,
    paddingRight: 5,
    color: "#e68a00",
    fontFamily: "RobotoM",
  },
});

export default RecipePanel;
