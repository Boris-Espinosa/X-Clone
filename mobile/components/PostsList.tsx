import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { usePosts } from '@/hooks/usePosts'
import { Post } from '@/types'
import PostCard from './PostCard'
import { useState } from 'react';
import CommentsModal from './CommentsModal'

const PostsList = ({username}: {username?: string}) => {

    const { currentUser } = useCurrentUser()
    const { posts, isLoading, error, refetch, toggleLike, deletePost, checkIsLiked } = usePosts(username)
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

    const selectedPost = selectedPostId ? posts.find((post: Post) => post._id === selectedPostId) : null;

    if (isLoading) {
        return (
            <View className='p-8 items-center'>
                <ActivityIndicator size="large" color="#1DA1F2" />
                <Text className='mt-2 text-gray-500'>Loading posts...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View className='p-8 items-center'>
                <Text className='text-gray-500'>Error loading posts. Please try again.</Text>
                <TouchableOpacity onPress={() => refetch()} className='px-4 py-2 bg-blue-500 rounded-lg mt-2'>
                    <Text className='text-white'>Retry</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (posts.length === 0) {
        return (
            <View className='p-8 items-center'>
                <Text className='text-gray-500'>No posts available. Be the first to post!</Text>
            </View>
        )
    }

  return (
    <>
      {posts.map((post: Post) => (
        <PostCard
            key={post._id}
            post={post}
            onLike={toggleLike}
            onDelete={deletePost}
            onComment={(post: Post) => setSelectedPostId(post._id)}
            currentUser={currentUser}
            isLiked={checkIsLiked(post.likes, currentUser)}
        />
      ))
      }

      <CommentsModal selectedPost={selectedPost} onClose={() => setSelectedPostId(null)}/>
        
    </>
  )
}

export default PostsList