import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, postApi } from "@/utils/api";

export const usePosts = (username?: string) => {
    const api = useApiClient()
    const queryClient = useQueryClient()

    const { data: postsData, isLoading, error, refetch } = useQuery({
        queryKey: username? ['userPosts', username] : ['posts'],
        queryFn: () => (username ? postApi.getUserPosts(api, username) : postApi.getPosts(api)),
        select: (res) => res.data.posts,
    })

    const likePostMutation = useMutation({
        mutationFn: (postId: string) => postApi.likePost(api, postId),
        onSuccess: async() => {
            await queryClient.invalidateQueries({
                queryKey: ['posts'],
                refetchType: "active"
            })
            if (username) await queryClient.invalidateQueries({
                queryKey: ['userPosts', username],
                refetchType: "active"
            })
        }
    })

    const deletePostMutation = useMutation({
        mutationFn: (postId: string) => postApi.deletePost(api, postId),
        onSuccess: async() => {
            await queryClient.invalidateQueries({
                queryKey: ['posts'],
                refetchType: "active"
            })
            if (username) await queryClient.invalidateQueries({
                queryKey: ['userPosts', username],
                refetchType: "active"
            })
        }
    })

    const checkIsLiked = (postLikes: string[], currentUser: any) => {
        const isLiked = currentUser && postLikes.includes(currentUser._id)
        return isLiked
    }

    return {
        posts: postsData || [],
        isLoading,
        error,
        refetch,
        toggleLike: (postId: string) => likePostMutation.mutate(postId),
        deletePost: (postId: string) => deletePostMutation.mutate(postId),
        checkIsLiked,
    }
}