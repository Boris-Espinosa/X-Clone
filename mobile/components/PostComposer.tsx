import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import useCreatePost from '../hooks/useCreatePost'
import { useUser } from '@clerk/clerk-expo'
import {  } from 'expo-image'
import { Feather } from '@expo/vector-icons';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const PostComposer = () => {

    const {
        content,
        setContent,
        selectedImage,
        isCreating,
        pickImageFromGallery,
        takePhoto,
        removeImage,
        createPost,
    } = useCreatePost()

    const { currentUser, isLoading } = useCurrentUser()
    const { user } = useUser()

    if (isLoading) return (
        <View className='items-center justify-center'>
            <ActivityIndicator size={"large"} />
        </View>
    )

  return (
    <View className='p-4 border-b border-gray-100 bg-white'>
        <View className='flex-row'>
            <Image source={{ uri: currentUser.profilePicture || user?.imageUrl }} className='w-12 h-12 rounded-full mr-3' />
            <View className='flex-1'>
                <TextInput
                    className='text-gray-900 text-lg'
                    placeholder='What&apos;s happening?'
                    placeholderTextColor={'#657786'}
                    multiline
                    maxLength={280}
                    value={content}
                    onChangeText={setContent}
                />
            </View>
        </View>
        {selectedImage && (
            <View className='mt-3 ml-15'>
                <View className='relative'>
                    <Image
                        source={{ uri: selectedImage }}
                        className='w-full h-48 rounded-lg'
                        resizeMode='cover'
                    />
                    <TouchableOpacity
                        className='absolute top-2 right-2 bg-black bg-opacity-60 rounded-full w-8 h-8 items-center justify-center'
                        onPress={removeImage}
                    >
                        <Feather name="x" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        )}

        <View className='flex-row justify-between items-center mt-3'>
            <View className='flex-row'>
                <TouchableOpacity onPress={pickImageFromGallery} className='mr-4'>
                    <Feather name="image" size={20} color="#1DA1F2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto} className='mr-4'>
                    <Feather name="camera" size={20} color="#1DA1F2" />
                </TouchableOpacity>
            </View> 
            <View className='flex-row items-center'>
                { content.length > 0 && (
                        <Text className={`text-sm mr-3 ${content.length > 260 ? "text-red-500" : "text-gray-500"}`}>
                            {content.length}/280
                        </Text>
                    )
                }
            
                <TouchableOpacity
                    className={`bg-blue-500 rounded-full px-4 py-2 ${isCreating ? 'opacity-50' : ''} disabled:opacity-50`}
                    onPress={createPost}
                    disabled={isCreating || (!content.trim() && !selectedImage)}
                >
                    { isCreating ? (
                        <ActivityIndicator color="white" size={"small"}/>
                        ) : (
                        <Text className='text-white font-semibold'>Post</Text>
                        )
                    }
                    
                </TouchableOpacity>
            </View>
        </View>

    </View>
  )
}

export default PostComposer