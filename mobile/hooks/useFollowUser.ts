import { useQuery } from "@tanstack/react-query";
import { userApi, useApiClient } from "@/utils/api";

export const useFollowUser = (targetUsername: string) => {
    const api = useApiClient()

    const { data: targetUser, isLoading, error, refetch} = useQuery({
        queryKey: ["userProfile/", targetUsername],
        queryFn: () => userApi.getUserProfile(api, targetUsername),
        select: (res) => res.data.user.followers
    })
    return { targetUser }
}