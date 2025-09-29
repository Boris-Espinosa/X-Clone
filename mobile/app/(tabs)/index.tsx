import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react'
import LogoutButton from '@/components/LogoutButton';
import { useUserSync } from "../../hooks/useUserSync"
import { Ionicons } from '@expo/vector-icons';
import PostComposer from '@/components/PostComposer';
import PostsList from '@/components/PostsList';
import { usePosts } from '@/hooks/usePosts';

const HomeScreen = () => {

  const { refetch: refetchPost } = usePosts()

  const [isRefetching, setIsRefetching] = useState(false)
  
  const handlePullToRefresh = async () => {
    setIsRefetching(true)
    try {
      await refetchPost()
    } finally {
      setIsRefetching(false)
    }
  }

  useUserSync()
  return (
    <SafeAreaView className='flex-1 bg-white' edges={["top"]}>
        <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-100'>
          <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
          <Text className='text-xl font-bold text-gray-900'>Home</Text>
          <LogoutButton />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handlePullToRefresh}
              tintColor="#1DA1F2"
              colors={["#1DA1F2"]}
            />
          }
        >

          <PostComposer />
          <PostsList />
        </ScrollView>
      
    </SafeAreaView>
  )
}

export default HomeScreen