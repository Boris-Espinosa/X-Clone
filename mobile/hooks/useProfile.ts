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
        
        setFormData((prev) => ({ ...prev, [field]: value.trimStart() }))
    }

    
    const cleanFormData = (data: typeof formData) => {
        return {
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            username: data.username.trim(),
            bio: data.bio.trim(),
            location: data.location.trim(),
        }
    }

    const validateFormData = (cleanedData: typeof formData) => {
        if (!cleanedData.firstName) {
            Alert.alert("Error", "First name is required")
            return false
        }
        if (!cleanedData.lastName) {
            Alert.alert("Error", "Last name is required")
            return false
        }
        if (!cleanedData.username) {
            Alert.alert("Error", "Username is required")
            return false
        }
        return true
    }

    const saveProfile = () => {
        const cleanedData = cleanFormData(formData)
        
        if (!validateFormData(cleanedData)) {
            return
        }
        
        updateProfileMutation.mutate(cleanedData)
    }

    return {
        isEditModalVisible,
        openEditModal,
        closeEditModal: () => setIsEditModalVisible(false),
        formData,
        saveProfile,
        updateFormField,
        isUpdating: updateProfileMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
    }
}
