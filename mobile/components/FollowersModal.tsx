
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFollow } from "@/hooks/useFollow";
import { useFollowers } from "@/hooks/useFollowers";

import { User } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface followersModalProps {
    isVisible: boolean;
    isFollowersVisible: boolean;
    isFollowingVisible: boolean;
    onClose: () => void;
}

const FollowersModal = ({ isVisible, isFollowersVisible, isFollowingVisible, onClose }: followersModalProps) =>{
    const { currentUser } = useCurrentUser()
    const { followUser, isLoading: isFollowing } = useFollow()
    const { following, followers, followersCount, followingCount} = useFollowers()
    const [query, setQuery] = useState("")

    const handleUnfollowUser = (follow: User) => {
        Alert.alert("Unfollow", `Are you sure you want to unfollow ${follow.username}?`, [
            {"style": "cancel", "text": "Cancel"},
            {"text": "Yes", "style": "destructive", "onPress": () => followUser(follow.clerkId)}
        ])
    }
    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
            <ScrollView>
                <TouchableOpacity onPress={onClose} className='p-2'>
                    <Text className='text-blue-500 text-lg ml-2'>close</Text>
                </TouchableOpacity>
                <View className="border-b border-gray-100 px-4 py-3">
                    <View className='bg-gray-100 items-center flex-row rounded-full px-4 py-3'>
                        <Feather name="search" size={20} color="gray" />
                        <TextInput
                            value={query}
                            placeholder='Search'
                            className='ml-2 flex-1 text-base'
                            placeholderTextColor="#657786"
                            onChangeText={setQuery}
                        />
                    </View>
                </View>
                { isFollowersVisible ? followers && followersCount > 0 ? followers.map((follower: User) => {
                    if (follower.username.includes(query)) {
                        return (
                            <View key={follower._id} className="border-b border border-gray-50 flex-row items-center justify-between">
                                <View className="flex-row items-center ml-3">
                                    <Image
                                        source={{uri: follower.profilePicture}}
                                        className="size-14 rounded-full my-4"
                                        />
                                    <Text className="text-gray-900 font-semibold ml-2"> {follower.firstName.split(" ")[0] + " " + follower.lastName?.split(" ")[0]}
                                        <Text className="text-gray-500"> @{follower.username}</Text>
                                    </Text>
                                </View>
                                {!following.some(f => f._id === follower._id) && follower._id !== currentUser._id && (
                                    <TouchableOpacity className="mr-3" onPress={() => followUser(follower.clerkId)}>
                                        <Feather name="user-plus" size={18} color="#1DA1F2"/>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )
                    }
                }) : (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-gray-500">No followers yet</Text>
                        </View>
                    )
                 : isFollowingVisible && following && followingCount > 0 ? following.map((follow: User) => {

                     if (follow.username.includes(query)) {
                        return (
                            <View key={follow._id} className="border-b border border-gray-50 flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Image
                                        source={{uri: follow.profilePicture}}
                                        className="size-14 rounded-full my-4"
                                        />
                                    <Text className="text-gray-900 font-semibold"> {follow.firstName.split(" ")[0] + " " + follow.lastName?.split(" ")[0]}
                                        <Text className="text-gray-500"> @{follow.username}</Text>
                                    </Text>
                                </View>
                                <TouchableOpacity className="mr-3" onPress={() => {handleUnfollowUser(follow)}} disabled={isFollowing}>
                                    <Feather name="trash" size={18} color={"red"}/>
                                </TouchableOpacity>
                            </View>
                        )
                     }
                }) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500">You don&apos; follow anyone yet</Text>
                    </View>
                 )}
            </ScrollView>
        </Modal>
    )
}

export default FollowersModal