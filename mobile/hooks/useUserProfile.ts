import { useQuery } from "@tanstack/react-query";
import { userApi, useApiClient } from "@/utils/api";

const useUserProfile = (targetUsername?: string) => {
    const api = useApiClient()
    
    const { data: target, isLoading, error, refetch } = useQuery({
        queryKey: ["userProfile", targetUsername],
        queryFn: async () => {
            if (!targetUsername) return null;
            const response = await userApi.getUserProfile(api, targetUsername);
            return response.data.user;
        },
        enabled: !!targetUsername,
        select: (res) => res
    })

    return { target, isLoading, error, refetch }
}

export default useUserProfile