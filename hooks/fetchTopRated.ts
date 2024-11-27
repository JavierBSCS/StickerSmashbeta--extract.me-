import { supabase } from "@/database/supabase";
import { create } from "zustand";

interface RecipeData {
  recipe_id: string;
  recipe_title: string;
  author: string;
  total_rate: number;
  img_url: string;
  profile_pic: string;
}

export const useTopRating = create<{
  top_recipes: RecipeData[] | null;
  loading: boolean;
  error: string | null;
  fetchTopRecipe: () => Promise<void>;
}>((set) => ({
  top_recipes: null,
  loading: false,
  error: null,
  fetchTopRecipe: async () => {
    if (!useTopRating.getState().top_recipes) {
      set({ loading: true });
      const { data, error } = await supabase.rpc("get_average_ratings", {});
      if (error) {
        console.error("Error fetching average ratings:", error);
        return;
      }

      // console.log("amtte: ",data)

      set({ top_recipes: data, loading: false });
    }
  },
}));
