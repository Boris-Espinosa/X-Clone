import React from "react";
import { Platform, Text, View } from "react-native";
import { Stack } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ClerkProvider } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { MenuProvider } from "react-native-popup-menu";
import "../global.css";

const queryClient = new QueryClient()

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) throw new Error("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY no está definida");

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 justify-center items-center bg-white p-4">
          <Text className="text-base text-gray-900 text-center">
            Algo salió mal. Recarga la página e inténtalo de nuevo.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Web: mantiene el ancho de móvil y lo centra en pantallas grandes.
const WEB_CONTAINER_STYLE = {
  flex: 1,
  width: "100%",
  maxWidth: 480,
  marginHorizontal: "auto",
} as const;

export default function RootLayout() {
  const screens = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <QueryClientProvider client={queryClient}>
          <MenuProvider>
            {Platform.OS === "web" ? (
              <View style={WEB_CONTAINER_STYLE}>{screens}</View>
            ) : (
              screens
            )}
          </MenuProvider>
          <StatusBar style="dark" />
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  )
}
