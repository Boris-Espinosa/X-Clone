import { useState } from "react"
import { Alert } from "react-native"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useApiClient, userApi } from "@/utils/api"
import { useCurrentUser } from "./useCurrentUser"

export const useProfile = () => {
    const api = useApiClient()
    const queryClient = useQueryClient()
    const { currentUser } = useCurrentUser()
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        bio: "",
        location: "",
    })

    const updateProfileMutation = useMutation({
      mutationFn: (profileData: typeof formData) => userApi.updateProfile(api, profileData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        setIsEditModalVisible(false)
      },
    onError: (error: any) => {
        Alert.alert("Error", error?.response?.data?.message || "An error occurred while updating the profile.")
    },
    })

    const openEditModal = () => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || "",
                lastName: currentUser.lastName || "",
                username: currentUser.username || "",
                bio: currentUser.bio || "",
                location: currentUser.location || "",
            })
        }
        setIsEditModalVisible(true)
    }

    const updateFormField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return {
        isEditModalVisible,
        openEditModal,
        closeEditModal: () => setIsEditModalVisible(false),
        formData,
        saveProfile: () => updateProfileMutation.mutate(formData),
        updateFormField,
        isUpdating: updateProfileMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
    }
}
