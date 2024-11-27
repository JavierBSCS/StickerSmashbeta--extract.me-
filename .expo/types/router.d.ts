/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/feed` | `/(tabs)/search` | `/(tabs)/user` | `/About` | `/Category` | `/CreateRecipe` | `/EditProfile` | `/Login` | `/Passwordreset` | `/Recipe` | `/Settings` | `/Signup` | `/_sitemap` | `/feed` | `/search` | `/user`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
