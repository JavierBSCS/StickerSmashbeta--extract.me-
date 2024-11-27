import { create } from "zustand";
import { supabase } from "@/database/supabase";

interface RecipeState {
  imgUrl: string;
  fetchRecipeImage: (recipe_id: string | string[], imgUrl: string | string[]) => Promise<void>;
}

export const useRecipeImage = create<RecipeState>((set) => ({
  imgUrl: "",
  fetchRecipeImage: async (recipe_id: string | string[], imgUrl: string | string[]) => {
    if (recipe_id && imgUrl) {
      const imgPath = `posts_img/${recipe_id}/${imgUrl}`;
      try {
        const { data, error: storageError } = await supabase.storage
          .from("hr_bucket")
          .getPublicUrl(imgPath);
        if (storageError) throw storageError;
        set({ imgUrl: data.publicUrl });
      } catch (error) {
        console.error("Error fetching recipe info:", error);
      }
    }
  },
}));
