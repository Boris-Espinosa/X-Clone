import { usePosts } from '@/hooks/usePosts';
import { Post, User } from '@/types'
import { FormatDate, formatNumber } from '@/utils/formatters';
import { Feather } from '@expo/vector-icons';
import { View, Text, Alert, Image, TouchableOpacity } from 'react-native';

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onDelete: (postId: string) => void;
    onComment: (post: Post) => void;
    currentUser: User;
    isLiked: boolean;
}

const PostCard = ({ currentUser, onDelete, onLike, onComment, isLiked, post }:PostCardProps) => {
    const { refetch } = usePosts();
    const isOwnPost = currentUser?._id === post.user._id;

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

  return (
    <View className='bg-white border-gray-200 border-b border-b-gray-100'>
        <View className='p-4 flex-row'>
            <Image
                source={{ uri: post.user.profilePicture || ""}}
                className='w-12 h-12 rounded-full mr-3'
            />

            <View className='flex-1'>
                <View className='flex-row justify-between items-cente mb-1'>
                    <View className='flex-row items-center'>
                        <Text className='font-bold text-gray-900'>{post.user.firstName.split(" ", 1)} {post.user.lastName?.split(" ", 1)}</Text>
                        <Text className='text-gray-500 ml-1'>@{post.user.username} * {FormatDate(post.createdAt)}</Text>
                    </View>
                    { isOwnPost && (
                            <TouchableOpacity onPress={() => {
                                    handleDelete()
                                    refetch()
                                    }
                                }
                                className='p-2'
                            >
                                <Feather name="trash" size={18} color="gray" />
                            </TouchableOpacity>
                        )
                    }
                </View>

                {post.content && (
                    <Text className='text-gray-900 text-base leading-5 mb-3'>{post.content}</Text>
                )}
                {post.image && (
                    <Image
                        source={{ uri: post.image }}
                        className='w-full h-48 rounded-lg mb-3'
                        resizeMode='cover'
                    />
                )}

                <View className='flex-row justify-between items-center'>
                    <TouchableOpacity className='flex-row items-center'
                        onPress={() => {
                            onLike(post._id)
                            refetch()
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
    </View>
  )
}

export default PostCard