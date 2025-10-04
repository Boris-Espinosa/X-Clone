import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from '@/utils/api';
import { Alert } from "react-native";

export const useFollow = () => {
    const api = useApiClient();
    const queryClient = useQueryClient();

    const followMutation = useMutation({
        mutationFn: (targetClerkId: string) => {
            console.log('🎯 Following user with clerkId:', targetClerkId);
            return userApi.followUser(api, targetClerkId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['posts'],
                refetchType: 'active'
            });
            await queryClient.invalidateQueries({
                queryKey: ['currentUser'],
                refetchType: 'active'
            });
            await queryClient.invalidateQueries({
                queryKey: ['userPosts'],
                refetchType: 'active'
            });
        },
        onError: (error: any) => {
            Alert.alert(
                'Error',
                error?.response?.data?.error || 'Failed to follow/unfollow user'
            );
        },
    });

    return {
        followUser: followMutation.mutate,
        isLoading: followMutation.isPending,
    };
};


