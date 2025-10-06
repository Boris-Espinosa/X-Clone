import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useProfile } from "@/hooks/useProfile";
import { User } from "@/types";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface followersModalProps {
    isVisible: boolean;
    isFollowersVisible: boolean;
    isFollowingVisible: boolean;
    onClose: () => void;
}

const FollowersModal = ({ isVisible, isFollowersVisible, isFollowingVisible, onClose }: followersModalProps) =>{

    const { currentUser } = useCurrentUser()
    console.log(isFollowersVisible)
    console.log(isFollowingVisible)

    const { getFollowers } = useProfile()

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
            <ScrollView>
                <TouchableOpacity onPress={onClose} className='p-2'>
                    <Text className='text-blue-500 text-lg'>close</Text>
                </TouchableOpacity>
                { isFollowersVisible ? currentUser.followers && currentUser.followers.length > 0 ? currentUser.followers.map((follower: string) => (
                    <View key={follower}>
                        <Text>{follower}</Text>
                    </View>
                )) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-500">No followers yet</Text>
                        </View>
                    )
                 : isFollowingVisible && currentUser.following && currentUser.following.length > 0 ? currentUser.following.map((following: string) => {
                    
                    const user= getFollowers(following)
                    console.log(user)
                    return (
                    <View key={following}>
                        <Text>{following}</Text>
                    </View>
                 )}) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500">You don&apos; follow anyone yet</Text>
                    </View>
                 )}
            </ScrollView>
        </Modal>
    )
}

export default FollowersModal