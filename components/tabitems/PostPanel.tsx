import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useCallback } from "react";
import { fetchPosts } from "@/hooks/fetchPosts"; // Fetch posts hook
import { useCurrentUser } from "@/hooks/useCurrentUser"; // User hook
import UserPostItem from "../partial/UserPostItem";

// Define the type for the recipe data
interface Recipe {
  recipe_id: string;
  img_name: string;
  img_url: string;
}

// Grid layout calculations
const numColumns = 1;
const spacing = 2;
const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;

export default function PostPanel() {
  const { user } = useCurrentUser();
  const { recipes, fetchRecipe, loading, hasMore, loadMore } = fetchPosts();

  // Initial fetch
  useEffect(() => {
    if (user?.user_id) {
      fetchRecipe(user.user_id);
    }
  }, [user?.user_id]);

  // Memoized handlers to prevent unnecessary re-renders
  const renderItem = useCallback(
    ({ item }: { item: Recipe }) => (
      <UserPostItem
        recipe_id={item.recipe_id}
        img_name={item.img_name}
        img_url={item.img_url}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item: Recipe) => item.recipe_id, []);

  const loadUserRecipes = useCallback(() => {
    if (!loading && hasMore && user?.user_id) {
      loadMore(user.user_id);
    }
  }, [loading, hasMore, user?.user_id]);

  return (
    <View style={styles.container2}>
      <FlatList
        data={recipes || []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        onEndReached={loadUserRecipes}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={9}
        windowSize={5}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        ListFooterComponent={
          loading && recipes?.length ? (
            <ActivityIndicator style={styles.loader} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing,
  },
  container2: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    height: "100%",
  },
  row: {
    gap: spacing,
    marginBottom: spacing,
  },
  item: {
    width: itemWidth,
    height: itemWidth,
    backgroundColor: "#f0f0f0",
  },
  loader: {
    padding: 10,
  },
});
