import { usePosts } from '@/hooks/usePosts';
import { Post, User } from '@/types'
import { FormatDate, formatNumber } from '@/utils/formatters';
import { useUser } from '@clerk/clerk-expo';
import { Feather } from '@expo/vector-icons';
import { View, Text, Alert, Image, TouchableOpacity } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

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
    const { user } = useUser()
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
                source={{ uri: post.user._id === currentUser._id ? user?.imageUrl : post.user.profilePicture|| ""}}
                className='w-12 h-12 rounded-full mr-3'
            />

            <View className='flex-1'>
                <View className='flex-row justify-between items-cente mb-1'>
                    <View className='flex-row items-center'>
                        <Text className='font-bold text-gray-900'>{post.user.firstName.split(" ", 1)} {post.user.lastName?.split(" ", 1)}</Text>
                        <Text className='text-gray-500 ml-1'>@{post.user.username} * {FormatDate(post.createdAt)}</Text>
                    </View>
                    { isOwnPost ? (
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
                                        onSelect={() => {
                                            handleDelete()
                                            refetch()
                                        }}
                                    >
                                        <View className='flex-row items-center p-3'>
                                            <Feather name="trash" size={18} color="#E0245E" />
                                            <Text className='ml-3 text-red-500 font-medium'>Delete Post</Text>
                                        </View>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        )
                    : (
                        <View className=''>
                        <TouchableOpacity className='flex-row items-center rounded-2xl px-4 py-1 bg-blue-500'>
                            <Feather name="user-plus" size={18} color="white" />
                            <Text className='ml-2 text-white'>Follow</Text>
                        </TouchableOpacity>
                        </View>
                    )}
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