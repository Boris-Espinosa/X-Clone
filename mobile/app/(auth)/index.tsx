import { Image, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import useSocialAuth from "../hooks/useSocialAuth";

export default function Index() {

  const { isLoadingGoogle, isLoadingApple, handleSocialAuth } = useSocialAuth();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between">
        <View className="flex-1 justify-center">
          <View className="items-center">
            <Image
              source={require("../../assets/images/auth2.png")}
              className="size-96"
              resizeMode="contain"
            />
          </View>

          <View className="flex-col gap-2">
            <TouchableOpacity
              className="flex-row bg-white items-center justify-center border border-gray-300 rounded-full py-3 px-6"
              onPress={() => {handleSocialAuth("oauth_google", "google")}}
              disabled={isLoadingGoogle}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 2
              }}
              >
                {isLoadingGoogle ? (<ActivityIndicator size="small"/>) : (
                  <View className="flex-row items-center justify-center">
                    <Image
                      source={require("../../assets/images/google.png")}
                      className="size-10 mr-3"
                      resizeMode="contain"
                      />
                    <Text className="text-black font-medium text-base">Sign in with Google</Text>
                  </View>
                )}
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-row bg-white items-center justify-center border border-gray-300 rounded-full py-3 px-6"
              onPress={() => {handleSocialAuth("oauth_apple", "apple")}}
              disabled={isLoadingApple}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 2
              }}
              >
                {isLoadingApple ? (<ActivityIndicator size="small"/>) : (
                  <View className="flex-row items-center justify-center">
                    <Image
                      source={require("../../assets/images/apple.png")}
                      className="size-9 mr-3"
                      resizeMode="contain"
                    />
                    <Text className="text-black font-medium text-base">Sign in with Apple</Text>
                  </View>
                )}
            </TouchableOpacity>
          </View>
          
          <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
            By signing up, you agree to our <Text className="text-blue-500">Terms</Text>
            {", "}
            <Text className="text-blue-500">Privacy Policy</Text>
            {", and "}
            <Text className="text-blue-500">Cookies Use</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}
