import { supabase } from "@/database/supabase";
import { create } from "zustand";

interface RecipeData {
  recipe_id: string;
  img_name: string;
  img_url: string;
}

interface PostStore {
  recipes: RecipeData[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  fetchRecipe: (user_id: string | undefined) => Promise<void>;
  loadMore: (user_id: string | undefined) => Promise<void>;
}

// Utility function to get public URL for multiple images in a single batch
const getPublicUrls = async (items: { recipe_id: string; img_url: string }[]) => {
  const paths = items.map(item => `posts_img/${item.recipe_id}/${item.img_url}`);
  
  // Get all public URLs in a single batch operation
  const { data: storageData, error: storageError } = await supabase.storage
    .from("hr_bucket")
    .createSignedUrls(paths, 60 * 60); // 1 hour expiry

  if (storageError) throw storageError;
  
  return storageData.map((item:any, index:any) => ({
    recipe_id: items[index].recipe_id,
    img_name: items[index].img_url,
    img_url: item.signedUrl,
  }));
};

const ITEMS_PER_PAGE = 9;

export const fetchPosts = create<PostStore>((set, get) => ({
  recipes: null,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,

  fetchRecipe: async (user_id: string | undefined) => {
    try {
      set({ loading: true, error: null });
      
      if (!user_id) {
        throw new Error("User ID is required");
      }

      // Get recipes with a single query
      const { data, error } = await supabase
        .from("recipe")
        .select(`recipe_id, img_url`)
        .eq("author", user_id)
        .range(0, ITEMS_PER_PAGE - 1)
        .order('created_at', { ascending: false });

      if (error) throw new Error("Error fetching data from database.");
      if (!data) {
        set({ recipes: [], hasMore: false });
        return;
      }

      // Get all public URLs in a single batch
      const updatedRecipes = await getPublicUrls(data);

      set({
        recipes: updatedRecipes,
        hasMore: data.length >= ITEMS_PER_PAGE,
        page: 1
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        recipes: null
      });
    } finally {
      set({ loading: false });
    }
  },

  loadMore: async (user_id: string | undefined) => {
    try {
      const { loading, hasMore, page, recipes } = get();
      if (loading || !hasMore || !user_id) return;

      set({ loading: true });
      const start = page * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("recipe")
        .select(`recipe_id, img_url`)
        .eq("author", user_id)
        .range(start, end)
        .order('created_at', { ascending: false });

      if (error) throw new Error("Error fetching more data.");
      if (!data || data.length === 0) {
        set({ hasMore: false });
        return;
      }

      // Get all public URLs in a single batch
      const newRecipes = await getPublicUrls(data);

      set({
        recipes: [...(recipes || []), ...newRecipes],
        hasMore: data.length === ITEMS_PER_PAGE,
        page: page + 1
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      set({ loading: false });
    }
  }
}));