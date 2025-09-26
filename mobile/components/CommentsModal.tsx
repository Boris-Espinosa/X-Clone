import { View, Text, Modal, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import React from 'react'
import { Post } from '@/types';
import { useComments } from '@/hooks/useComments';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Feather } from '@expo/vector-icons';

interface CommentsModalProps {
    selectedPost: Post | null;
    onClose: () => void;
}

const CommentsModal = ({ selectedPost, onClose}: CommentsModalProps) => {

    const { commentText, setCommentText, createComment, isCreatingComment } = useComments();
    const { currentUser } = useCurrentUser();

    const handleClose = () => {
        onClose()
        setCommentText("")
    }

  return (
    <Modal visible={!!selectedPost} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View className='flex-row justify-between items-center px-4 py-3 border-b border-b-gray-100 bg-white'>
        <TouchableOpacity onPress={handleClose} className='p-2'>
            <Text className='text-blue-500 text-lg'>Close</Text>
        </TouchableOpacity>
        <Text className='text-lg font-semibold'>Comments</Text>
        <View className='w-12'/>
      </View>

      {selectedPost && (
        <View className='flex-1'>
          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            <View className='p-4 border-b border-b-gray-50 bg-white'>
                <View className='flex-row'>
                    <Image
                        className='size-12 rounded-full mr-3'
                        source={{ uri: selectedPost.user.profilePicture || ""}}
                    />
                    <View className='flex-1'>
                        <View className='flex-row items-center mb-1'>
                            <Text className='font-bold text-gray-900'>{selectedPost.user.firstName.split(" ", 1)} {selectedPost.user.lastName?.split(" ", 1)}</Text>
                            <Text className='text-gray-500 ml-1'>@{selectedPost.user.username}</Text>
                        </View>

                        {selectedPost.content && (
                            <Text className='text-gray-900 text-base leading-5 mb-3'>{selectedPost.content}</Text>
                        )}
                        {selectedPost.image && (
                            <Image
                                source={{ uri: selectedPost.image }}
                                className='w-full h-48 rounded-2xl mb-3'
                            />
                        )}
                    </View>
                </View>

            </View>

            {selectedPost.comments.map((comment) => (
                <View key={comment._id} className='p-4 border-b border-b-gray-50 bg-white'>
                    <View className='flex-row'>
                        <Image
                            className='size-12 rounded-full mr-3'
                            source={{ uri: comment.user.profilePicture || ""}}
                            />
                        <View className='flex-1'>
                            <View className='flex-row items-center mb-1'>
                                <Text className='font-bold text-gray-900'>{comment.user.firstName.split(" ", 1)} {comment.user.lastName?.split(" ", 1)}</Text>
                                <Text className='text-gray-500 ml-1'>@{comment.user.username}</Text>
                            </View>
                            <Text className='text-gray-900 text-base leading-5'>{comment.content}</Text>
                        </View>
                    </View>
                </View>
                )
            )}

          </ScrollView>
          <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={100}>

            <View className='p-4'>
                <View className='flex-row'>
                    <Image
                        className='size-10 rounded-full mr-3'
                        source={{ uri: currentUser?.profilePicture || ""}}
                    />
                    <View className='flex-1 items-center justify-between flex-row'>
                        <TextInput
                            className=' flex-1 border border-gray-200 rounded-lg p-3 text-base mb-3'
                            placeholderTextColor={'#657786'}
                            placeholder="Write a comment..."
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                            />
                        <TouchableOpacity className={` ml-3 align- py-3.5 px-6 rounded-lg self-start ${
                            commentText.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
                            onPress={() => createComment(selectedPost._id)}
                        >
                            {isCreatingComment ? (
                                <ActivityIndicator color="white" size="small"/>
                            ) : (
                                <Feather name="send" size={17} color={`${commentText.trim() ? "white" : "#657786"}`}/>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </Modal>
  )
}

export default CommentsModal