import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

const useSocialAuth = () => {
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
    const [isLoadingApple, setIsLoadingApple] = useState(false);
    const { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple", provider: "google" | "apple") => {        if (provider === "google") {
            setIsLoadingGoogle(true);
        } else setIsLoadingApple(true);

        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy })
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
            }
        } catch (error) {
            console.log("Error with social auth: ", error);
            const providerName = strategy === "oauth_google" ? "Google" : "Apple";
            Alert.alert("Error", `There was an error signing in with ${providerName}. Please try again.`);
        } finally {
            if (provider === "google") {
                setIsLoadingGoogle(false);
            } else setIsLoadingApple(false);
        }    }

    return {isLoadingGoogle, isLoadingApple, handleSocialAuth}
}

export default useSocialAuth