import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useApiClient, userApi } from '../utils/api';
import { Alert } from "react-native";
import { useState } from "react";
import { User } from "@/types";

export const useFollow = () => {
    const api = useApiClient()
    const queryClient = useQueryClient()
    const [targetUser, setTargetUser] = useState("")

    const useFollowMutation = useMutation({
        mutationFn: async(targetUser: User) => {
            setTargetUser(targetUser.username)
            console.log("trying follow User...")
            console.log(targetUser.clerkId)
            await userApi.followUser(api, targetUser.clerkId)
            await userApi.getUserProfile(api, targetUser.username)
        },
        onSuccess: async() => {
            console.log("User followed succesfully")
            await queryClient.invalidateQueries({queryKey: ["currentUser"]})
            await queryClient.invalidateQueries({queryKey: ["userProfile", targetUser]})
            setTargetUser("")
        },
        onError: (error) => {
            setTargetUser("")
            Alert.alert("Error", error?.message || "An error ocured while trying to follow")
        }
    })
    return {
        followUser: (targetUser: User) => useFollowMutation.mutate(targetUser)
    }
}


