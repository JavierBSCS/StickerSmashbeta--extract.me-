import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/database/supabase";

import { Image, View, Text, Pressable, StyleSheet } from "react-native";
import { decode } from "base64-arraybuffer";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface ImageUploadProps {
  recipe_id: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ recipe_id }) => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>();
  const [uploading, setUploading] = useState(false);

  const handleImageSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setFile(result.assets[0].base64);
      }
    } catch (error) {
      console.error("Image selection error:", error);
    }
  };

  useEffect(() => {
    const handleImageUpload = async () => {
      setUploading(true);
      console.log("LLL", recipe_id);
      if (!file || recipe_id == null) {
        setUploading(false);
        return;
      }
      console.log("LLL enter");
      const fileName = `${Date.now()}_${image?.split("/").pop()}`;

      try {
        const { data, error } = await supabase.storage
          .from("hr_bucket")
          .upload(`posts_img/${recipe_id}/${fileName}`, decode(file!), {
            contentType: `image/${fileName.split(".").pop()}`,
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.log("my err: ", error);
        }

        const { error_recipe } = await supabase
          .from("recipe")
          .update({ img_url: fileName })
          .eq("recipe_id", recipe_id);

        if (error_recipe) {
          console.log("error:", error_recipe);
          return setUploading(false);
        }

        setImage("");
        setFile("");
        setUploading(false);
        console.log("status: 200");
      } catch (error) {
        console.error("Upload error:", error);
        setUploading(false);
      }
    };
    handleImageUpload();
  }, [recipe_id]);

  return (
    <View style={{ flexDirection: "column", gap: 20 }}>
      <View
        style={{
          flexDirection: "column",
          gap: 5,
          alignItems: "center",
        }}
      >
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 300, borderRadius: 20 }}
          />
        )}
        {!image && (
          <Pressable onPress={handleImageSelection} style={styles.select_img}>
            <FontAwesome name="plus-square" size={100} color="#666" />
          </Pressable>
        )}
      </View>

      {image && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "green",
              flexGrow: 1,
              padding: 5,
              borderRadius: 5,
            }}
            onPress={() => {
              setImage("");
              setFile("");
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Poppins",
                textAlign: "center",
              }}
            >
              cancel
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  select_img: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ImageUpload;
