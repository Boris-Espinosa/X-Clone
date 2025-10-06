import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFollowers } from "@/hooks/useFollowers";
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

    const { following, followers, followersCount, followingCount} = useFollowers()
    console.log(following)
    console.log(isFollowersVisible)
    console.log(isFollowingVisible)
    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
            <ScrollView>
                <TouchableOpacity onPress={onClose} className='p-2'>
                    <Text className='text-blue-500 text-lg'>close</Text>
                </TouchableOpacity>
                { isFollowersVisible ? followers && followersCount > 0 ? followers.map((follower: User) => (
                    <View key={follower._id} className="">
                        <Text>{follower.username}</Text>
                    </View>
                )) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-500">No followers yet</Text>
                        </View>
                    )
                 : isFollowingVisible && following && followingCount > 0 ? following.map((follow: User) => {
                    
                    return (
                    <View key={follow._id}>
                        <Text>{follow.username}</Text>
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