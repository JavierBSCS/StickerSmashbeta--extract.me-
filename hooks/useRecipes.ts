import { supabase } from "@/database/supabase";
import { useState } from "react";
import { create } from "zustand";

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

export const useRecipeToday = create<{
  recipes: RecipeData[] | null;
  loading: boolean;
  error: string | null;
  fetchRecipe: (recom: string | null) => Promise<void>;
}>((set) => ({
  recipes: null,
  loading: false,
  error: null,
  fetchRecipe: async (recom: string | null) => {
    if (!useRecipeToday.getState().recipes && recom != null) {
      set({ loading: true });
      const { data, error } = await supabase
        .from("recipe")
        .select(
          `
        recipe_id, 
        title,
        category,
        img_url,
        author:user (
          f_name,
          l_name
        )
      `
        )
        .eq("category", recom)
        // .order('category', { ascending: false })
        .limit(5);

      if (error) {
        set({ error: "Error fetching data from database.", loading: false });
      }
      set({ recipes: data, loading: false });
    }

    if (!useRecipeToday.getState().recipes && recom === null) {
      set({ loading: true });
      const { data, error } = await supabase
        .from("recipe")
        .select(
          `
        recipe_id, 
        title,
        category,
        img_url,
        author:user (
          f_name,
          l_name
        )
      `
        )
        .limit(5);

      if (error) {
        set({ error: "Error fetching data from database.", loading: false });
      }
      set({ recipes: data, loading: false });
    }
  },
}));
