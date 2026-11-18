import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";

// Clerk redirige aquí al completar OAuth; esto cierra el flujo de WebBrowser.
WebBrowser.maybeCompleteAuthSession();

export default function SSOCallback() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    router.replace(isSignedIn ? "/(tabs)" : "/(auth)");
  }, [isLoaded, isSignedIn, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" />
    </View>
  );
}
