import { useQuery } from '@tanstack/react-query'
import { useApiClient, userApi } from '@/utils/api'

export const useCurrentUser = () => {
    const api = useApiClient()

    const { data: currentUser, isLoading, error, refetch } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => userApi.getCurrentUser(api),
        select: (res) => res.data.user,
    })

    return { currentUser, isLoading, error, refetch }
}