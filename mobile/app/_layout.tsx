import { Stack } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ClerkProvider } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../global.css"
import { StatusBar } from "expo-status-bar";
import { MenuProvider } from "react-native-popup-menu";

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <MenuProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </MenuProvider>
        <StatusBar style="dark" />
      </QueryClientProvider>
    </ClerkProvider>
  )
}
