import { useFollow } from '@/hooks/useFollow';
import { Post, User } from '@/types'
import { FormatDate, formatNumber } from '@/utils/formatters';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import ZoomPictureModal from './ZoomPictureModal';

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onDelete: (postId: string) => void;
    onComment: (post: Post) => void;
    currentUser: User;
    isLiked: boolean;
}

const PostCard = ({ currentUser, onDelete, onLike, onComment, isLiked, post }:PostCardProps) => {
    
    const isOwnPost = currentUser?._id === post.user._id;

    const { followUser, isLoading } = useFollow()

    const name = post.user.lastName?.split(" ")[0].trim() ?
        post.user.firstName.split(" ")[0].trim() + " " + post.user.lastName?.split(" ")[0].trim() :
        post.user.firstName.split(" ")[0].trim()

    const isFollowingAuthor = Array.isArray(post.user.followers) &&
        post.user.followers.some(followerId => followerId.toString() === currentUser._id.toString());

    const handleDelete = () => {
        Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(post._id),
            },
        ]);
    }

    const handleFollowToggle = () => {
        followUser(post.user.clerkId)
    }

    const [selectedImage, setSelectedImage] = useState("")
      const [isZoomModalVisible, setIsZoomModalVisible] = useState(false)
      
      const handleZoomImage = (image: string) => {
        setSelectedImage(image)
        setIsZoomModalVisible(true)
      }

    if (isLoading) return (
        <View className='items-center justify-center'>
            <ActivityIndicator size={"small"} />
        </View>
    )

  return (
    <View className='bg-white border-gray-200 border-b border-b-gray-100'>
        <View className='p-4 flex-row'>
            <TouchableOpacity
                onLongPress={() => {
                    if (typeof post.user.profilePicture != "undefined")
                    handleZoomImage(post.user.profilePicture)
            }}>
                <Image
                    source={{ uri: post.user.profilePicture }}
                    className='w-12 h-12 rounded-full mr-3'
                />
            </TouchableOpacity>

            <View className='flex-1'>
                <View className='flex-row justify-between items-cente mb-1'>
                    <View className='flex-row items-center'>
                        <Text className='font-bold text-gray-900'>{ name }</Text>
                        <Text className='text-gray-500 ml-1'> •  {FormatDate(post.createdAt)}</Text>
                    </View>
                    { isOwnPost ? (
                            <Menu>
                                <MenuTrigger
                                    customStyles={{
                                        triggerTouchable: {
                                            underlayColor: '#f0f0f0',
                                            activeOpacity: 0.7,
                                        }
                                    }}
                                >
                                    <Feather name="more-horizontal" size={18} color="#657786" />
                                </MenuTrigger>
                                <MenuOptions
                                    customStyles={{
                                        optionsContainer: {
                                            marginTop: 30,
                                            borderRadius: 8,
                                            padding: 4,
                                        }
                                    }}
                                >
                                    <MenuOption 
                                        onSelect={handleDelete}
                                    >
                                        <View className='flex-row items-center p-3'>
                                            <Feather name="trash" size={18} color="#E0245E" />
                                            <Text className='ml-3 text-red-500 font-medium'>Delete Post</Text>
                                        </View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        )
                    : isFollowingAuthor ? (
                        <Menu>
                            <MenuTrigger
                                customStyles={{
                                    triggerWrapper: {
                                        padding: 8,
                                    },
                                    triggerTouchable: {
                                        underlayColor: '#f0f0f0',
                                        activeOpacity: 0.7,
                                    }
                                }}
                            >
                                <Feather name="more-horizontal" size={18} color="#657786" />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption
                                onSelect={handleFollowToggle}
                                disabled={isLoading}
                                >
                                    <View className='flex-row items-center p-3'>
                                        <Feather name="user-minus" size={18} color="#E0245E" />
                                        <Text className='ml-3 text-red-500 font-medium'>Unfollow</Text>
                                    </View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    ) : (
                        <>
                            <View className='flex-1 my-5'/>
                            <TouchableOpacity className={`absolute flex-row items-center rounded-2xl p-1 bg-blue-500 -left-8 top-8`}
                            onPress={handleFollowToggle}
                            disabled={isLoading}
                            >
                                <Feather name="user-plus" size={10} color="white" />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {post.content && (
                    <Text className='text-gray-900 text-base leading-5 mb-3'>{post.content}</Text>
                )}
                {post.image && (
                    <TouchableOpacity onPress={() => {
                        if(typeof post.image != "undefined")
                        handleZoomImage(post.image)
                        }}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={{ uri: post.image }}
                            className='w-full h-48 rounded-lg mb-3'
                            resizeMode='cover'
                        />
                    </TouchableOpacity>
                )}

                <View className='flex-row justify-between items-center'>
                    <TouchableOpacity className='flex-row items-center'
                        onPress={() => {
                            onLike(post._id)
                        }}
                    >
                        <Feather name={isLiked ? "heart" : "heart"} size={18} color={isLiked ? "#E0245E" : "#657786"} />
                        <Text className={`ml-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}>{post.likes.length}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-row items-center' onPress={() => onComment(post)}>
                        <Feather name="message-circle" size={18} color="#657786" />
                        <Text className='ml-2 text-gray-500'>{formatNumber(post.comments?.length || 0)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-row items-center'>
                        <Feather name="repeat" size={18} color="#657786" />
                        <Text className='ml-2 text-gray-500'>0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className='flex-row items-center'>
                        <Feather name="share" size={18} color="#657786" />
                    </TouchableOpacity>

                </View>
            </View>
        </View>
        <ZoomPictureModal
            isVisible={isZoomModalVisible}
            selectedPicture={selectedImage}
            onClose={() => setIsZoomModalVisible(false)}
        />
    </View>
  )
}

export default PostCard