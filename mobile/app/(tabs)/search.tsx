import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';
import PostsList from '@/components/PostsList';
import { useCurrentUser } from '@/hooks/useCurrentUser';


//TODO: Implement search functionality and trending topics fetching from an API
const SearchScreen = () => {
    const { currentUser } = useCurrentUser()
    const { checkIsLiked, posts, refetch, deletePost, isLoading, toggleLike } =  usePosts()

    const TRENDING_TOPICS = [
    { topic: '#React_Native', tweets: '120K'},
    { topic: '#Expo', tweets: '80K' },
    { topic: '#JavaScript', tweets: '200K' },
    { topic: '#TypeScript', tweets: '150K' },
    { topic: '#Mobile_Development', tweets: '90K' },
    ]

    const [searchFor, setSearchFor] = useState("")
  return (
    <SafeAreaView className='flex-1 bg-white'>

      <View className='px-4 py-3 border-b border-gray-100'>
        <View className='bg-gray-100 items-center flex-row rounded-full px-4 py-3'>
            <Feather name="search" size={20} color="gray" />
            <TextInput
                value={searchFor}
                onChangeText={setSearchFor}
                placeholder='Search'
                className='ml-2 flex-1 text-base'
                placeholderTextColor="#657786"
            />
        </View>
      </View>

      <ScrollView className='flex-1' showsHorizontalScrollIndicator={false}>
        <View className='px-4 py-3'>
            <Text className='text-xl font-bold mb-3'>Trends for you</Text>
            { searchFor === "" ? TRENDING_TOPICS.map((item, index) => (
                <TouchableOpacity key={index} className='py-3 border-b border-gray-100'>
                    <Text className='text-gray-500 text-sm'>Trending</Text>
                    <Text className='text-base font-semibold'>{item.topic}</Text>
                    <Text className='text-gray-500 text-sm'>{item.tweets} Tweets</Text>
                </TouchableOpacity>
            )) : posts.map((post: Post) => {
              console.log(post.hashtags.includes(searchFor))
              if (post.hashtags.includes(searchFor)) {

                return(
                  <PostCard 
                    key={post._id}
                    currentUser={currentUser}
                    isLiked={false}
                    onComment={() => {}}
                    onDelete={deletePost}
                    onLike={toggleLike}
                    post={post}
                  />
                )
              }
            })}
            
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SearchScreen