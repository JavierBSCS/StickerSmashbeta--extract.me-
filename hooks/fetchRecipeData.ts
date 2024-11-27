import { create } from "zustand";
import { supabase } from "@/database/supabase";

interface Extra {
  cook: string;
  prep: string;
  level: string;
  total: string;
  yield: string;
}

interface Author {
  f_name: string;
  l_name: string;
}

interface Info {
  title: string;
  category: string;
  author: Author;
}

interface RecipeState {
  others: [] | null;
  info: Info | null;
  nutri: string[] | undefined;
  ingredients: [] | undefined;
  directions:  [] | undefined;

  fetchRecipeInfo: (recipe_id: string | string[]) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  others: null,
  nutri: undefined,
  info: null,
  ingredients: undefined,
  directions: undefined,
  fetchRecipeInfo: async (recipe_id: string | string[]) => {
    try {
      const { data, error } = await supabase
        .from("recipe")
        .select(
          `title, category, content, author:user (
          f_name,
          l_name
        )`
        )
        .eq("recipe_id", recipe_id)
        .single();

      if (error) throw error;

      const info = {
        title: data.title,
        category: data.category,
        author: data.author,
      };

      const parseContent = JSON.parse(data.content);
      
      set({
        info: info,
        others: parseContent.other,
        nutri: parseContent.nutritions,
        ingredients: parseContent.ingredients,
        directions: parseContent.directions
      });
    } catch (error) {
      console.error("Error fetching recipe info:", error);
    }
  },
}));
