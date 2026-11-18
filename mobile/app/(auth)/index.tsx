import { Image, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import useSocialAuth from "../../hooks/useSocialAuth";

export default function Index() {

  const { isLoadingGoogle, isLoadingApple, handleSocialAuth } = useSocialAuth();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between">
        <View className="flex-1 justify-center">
          <View className="items-center">
            <Image
              source={require("../../assets/images/auth2.png")}
              className="max-w-full"
              style={{ width: 256, height: 256 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-col gap-2">
            <TouchableOpacity
              className="flex-row bg-white items-center justify-center border border-gray-300 rounded-full py-3 px-6 w-full max-w-sm self-center"
              onPress={() => {handleSocialAuth("oauth_google", "google")}}
              disabled={isLoadingGoogle}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 2,
                paddingVertical: 12,
                paddingHorizontal: 24
              }}
              >
                {isLoadingGoogle ? (<ActivityIndicator size="small"/>) : (
                  <View className="flex-row items-center justify-center">
                    <Image
                      source={require("../../assets/images/google.png")}
                      className="mr-3"
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                      />
                    <Text className="text-black font-medium text-base" style={{ fontSize: 16 }}>Sign in with Google</Text>
                  </View>
                )}
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-row bg-white items-center justify-center border border-gray-300 rounded-full py-3 px-6 w-full max-w-sm self-center"
              onPress={() => {handleSocialAuth("oauth_apple", "apple")}}
              disabled={isLoadingApple}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 2,
                paddingVertical: 12,
                paddingHorizontal: 24
              }}
              >
                {isLoadingApple ? (<ActivityIndicator size="small"/>) : (
                  <View className="flex-row items-center justify-center">
                    <Image
                      source={require("../../assets/images/apple.png")}
                      className="mr-3"
                      style={{ width: 36, height: 36 }}
                      resizeMode="contain"
                    />
                    <Text className="text-black font-medium text-base" style={{ fontSize: 16 }}>Sign in with Apple</Text>
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
