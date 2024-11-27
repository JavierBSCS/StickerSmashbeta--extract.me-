import { supabase } from "@/database/supabase";
import { create } from "zustand";

interface RecipeData {
  description: string;
  recipe_id: string;
  img_name: string;
  img_url: string;
  title: string;
  author: { f_name: string; l_name: string };
  category: string;
}

interface RecipeStore {
  recipes: RecipeData[] | null;
  loading: boolean;
  error: string | null;
  fetchRecipe: () => Promise<void>;
  page: number;
  hasMore: boolean;
}

export const fetchRecipeFeed = create<RecipeStore>((set, get) => ({
  recipes: null,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  fetchRecipe: async () => {
    try {
      set({ loading: true });
      const currentPage = get().page;
      const start = (currentPage - 1) * 9;
      const end = currentPage * 9 - 1;

      const { data, error } = await supabase
        .from("recipe")
        .select(`
          recipe_id,    
          title,
          category,
          img_url,
          author:user (
            f_name,
            l_name
          )
        `)
        .range(start, end)
        .limit(9);

      if (error) {
        throw new Error("Error fetching data from database.");
      }

      if (!data) {
        set({ recipes: [], hasMore: false });
        return;
      }

      const updatedRecipes = await Promise.all(
        data.map(async (item: RecipeData) => {
          const imgPath = `posts_img/${item.recipe_id}/${item.img_url}`;
          const { data: storageData, error: storageError } = await supabase.storage
            .from("hr_bucket")
            .getPublicUrl(imgPath);

          if (storageError) {
            throw storageError;
          }

          return {
            recipe_id: item.recipe_id,
            img_name: item.img_url,
            img_url: storageData.publicUrl,
            title: item.title,
            author: item.author,
            category: item.category,
          };
        })
      );

      set((state) => ({
        recipes: state.recipes ? [...state.recipes, ...updatedRecipes] : updatedRecipes,
        hasMore: data.length === 9,
      }));

    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred", 
        loading: false 
      });
    } finally {
      set({ loading: false });
    }
  },
}));