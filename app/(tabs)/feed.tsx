import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import CustomView from "@/components/themed/CustomView";
import { fetchRecipeFeed } from "@/hooks/fetchFeed";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";

export default function Feed() {
  const { recipes, loading, error, fetchRecipe, hasMore } = fetchRecipeFeed();

  useEffect(() => {
    fetchRecipe(); // Initial fetch
  }, []);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    fetchRecipeFeed.getState().page++;
    fetchRecipe();
  };

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator style={styles.loadingIndicator} />;
    }
    return null;
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error
          ? "Failed to load recipes. Please try again later."
          : "No recipes found."}
      </Text>
    </View>
  );

  return (
    <CustomView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ padding: 20, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
        data={recipes || []}
        keyExtractor={(item, index) => `${item.recipe_id}-${index}`}
        renderItem={({ item }) => (
          <Pressable
            style={styles.main}
            onPress={() =>
              router.navigate({
                pathname: "/Recipe",
                params: { recipe_id: item.recipe_id, img_url: item.img_name },
              })
            }
          >
            <View style={styles.inner}>
              <View style={styles.authorContainer}>
                <Image
                  source={require("@/assets/icons/user.png")}
                  style={styles.userIcon}
                />
                <Text style={styles.authorName}>
                  {item.author?.f_name} {item.author?.l_name}
                </Text>
              </View>
              <Pressable>
                <Entypo name="dots-three-horizontal" size={24} color="black" />
              </Pressable>
            </View>
            <Image
              source={{ uri: item.img_url }}
              style={styles.recipeImage}
            />
            <View style={styles.recipeDetails}>
              <Text style={styles.recipeTitle}>{item.title || "Untitled"}</Text>
              <Text style={styles.recipeDescription}>
                {item.description || "No description available."}
              </Text>
            </View>
          </Pressable>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        getItemLayout={(data, index) => ({
          length: 270,
          offset: 270 * index,
          index,
        })}
      />
    </CustomView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#fff",
    flexDirection: "column",
    gap: 10,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  inner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  authorContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#333",
  },
  recipeImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeDetails: {
    paddingBottom: 10,
  },
  recipeTitle: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "600",
  },
  recipeDescription: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: "#666",
  },
  loadingIndicator: {
    padding: 10,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 50,
  },
  emptyText: {
    fontFamily: "Poppins",
    fontSize: 18,
    color: "#999",
  },
});
