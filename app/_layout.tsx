import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    Poppins: require("@/assets/fonts/Poppins-Regular.ttf"),
    OpenSans: require("@/assets/fonts/OpenSans-Regular.ttf"),
    Aclonica: require("@/assets/fonts/Aclonica-Regular.ttf"),
    Matemasie: require("@/assets/fonts/Matemasie-Regular.ttf"),
    Monoton: require("@/assets/fonts/Monoton-Regular.ttf"),
    Pacifico: require("@/assets/fonts/Pacifico-Regular.ttf"),
    RobotoM: require("@/assets/fonts/Roboto-Medium.ttf"),
    Courgette: require("@/assets/fonts/Courgette-Regular.ttf"),
    Ephesis: require("@/assets/fonts/Ephesis-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Recipe" options={{ headerShown: false }} />
      <Stack.Screen name="Category" options={{ headerShown: false }} />
      <Stack.Screen name="Signup" options={{ headerShown: false }} />
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="Passwordreset" options={{ headerShown: false }} />
      <Stack.Screen name="CreateRecipe" options={{ headerShown: false }} />
      <Stack.Screen name="Settings" />
      <Stack.Screen name="EditProfile" />
    </Stack>
  );
}
