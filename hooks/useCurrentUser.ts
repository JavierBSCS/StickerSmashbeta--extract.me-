import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/database/supabase";
import { useEffect } from "react";
import { Platform } from "react-native";

interface UserData {
  user_id: string;
  email: string;
  f_name: string;
  l_name: string;
  profile: string;
  status: string;
  role: string;
  bio: string;
}

export const useDataStore = create<{
  user: UserData | null;
  loading: boolean;
  isAuth: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (userData: UserData) => void;
}>((set) => ({
  user: null,
  isAuth: false,
  loading: false,
  error: null,
  fetchData: async () => {
    //let result = await SecureStore.getItemAsync("user"); 
   let result = await AsyncStorage.getItem("user");

    if (result) {
      set({ loading: true });

      const { data, error } = await supabase
        .from("user")
        .select("user_id, email, f_name, l_name, profile, status, role, bio")
        .eq("user_id", result);

      if (error) {
        console.error("Error fetching user:", error);
        set({ error: error.message }); // Set the error message
      } else if (data.length > 0) {
        set({ loading: false, isAuth: true, user: data[0] });
      }
    } else {
      set({ loading: false, isAuth: false, user: null });
    }
  },
  logout: async () => {
    set({ isAuth: false, loading: false, user: null }); 
    await SecureStore.deleteItemAsync("user"); 
  },
  updateUserData: (userData: UserData) => {
    set({ user: userData }); // Update the user data in the store
  },
}));

interface UserProfileStore {
  profile: string | null;
  fetchProfile: () => Promise<void>;
}

export const useUserProfileStore = create<UserProfileStore>((set) => ({
  profile: null,
  fetchProfile: async () => {
    const { user } = useDataStore.getState(); // Get the user from useDataStore

    if (user) {
      const imgPath = `userprofiles/${user.user_id}/${user.profile}`;
      try {
        const { data, error: storageError } = await supabase.storage
          .from("hr_bucket")
          .getPublicUrl(imgPath);
        if (storageError) {
          console.error("Error fetching image URL:", storageError);
        } else {
          set({ profile: data.publicUrl });
        }
      } catch (error) {
        console.error("Error during image URL retrieval:", error);
      }
    }
  },
}));

export function useCurrentUser() {
  const { profile, fetchProfile } = useUserProfileStore();
  const { user, updateUserData, logout, isAuth, fetchData } = useDataStore();

  useEffect(() => {
    const subscription = supabase
      .channel("userUpdates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user" },
        (payload: any) => {
          if (payload.new.user_id === user?.user_id) {
            const newUser: UserData = {
              user_id: payload.new.user_id,
              email: payload.new.email,
              f_name: payload.new.f_name,
              l_name: payload.new.l_name,
              profile: payload.new.profile,
              status: payload.new.status,
              role: payload.new.role,
              bio: payload.new.bio,
            };
            updateUserData(newUser);
          }
        }
      )
      .subscribe();

    fetchData();
    if (user) {
      fetchProfile();
    }
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuth, profile, user, updateUserData, logout, fetchData };
}
