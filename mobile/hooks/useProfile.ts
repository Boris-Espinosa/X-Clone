import { useState } from "react"
import { Alert } from "react-native"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useApiClient, userApi } from "@/utils/api"
import { useCurrentUser } from "./useCurrentUser"
import { useUser } from "@clerk/clerk-expo"
import * as ImagePicker from 'expo-image-picker'

//TODO: Implement follow and unfollow functionality
//TODO: Implement profile and banner picture upload functionality


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
    const [profilePicture, setProfilePicture] = useState<string | null>(null)
    const [bannerPicture, setBannerPicture] = useState<string | null>(null)
    const { user } = useUser()
    
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

    const updateProfilePicturesMutation = useMutation({
        mutationFn: async (imageUri: string) => {
            if (profilePicture) {
                return user?.setProfileImage({ file: imageUri })
            } else if (bannerPicture) {
                return userApi.updateProfileBanner(api, { profileBanner: imageUri })
            }
            
        },
        onSuccess: () => {
            console.log("Profile picture updated successfully")
            
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
            setProfilePicture(null)
            setBannerPicture(null)
        },
        onError: (error: any) => {
            console.log("Error updating profile picture:", error)
            Alert.alert("Error", error?.response?.data?.message || "An error occurred while updating the profile pictures.")
        }
    })

    const handleChangeImage = async (useCamera: boolean = false, isProfilePicture: boolean = false) => {
            const permissionResult = useCamera
                ? await ImagePicker.requestCameraPermissionsAsync()
                : await ImagePicker.requestMediaLibraryPermissionsAsync()
    
            if (permissionResult.status !== "granted") {
                const source = useCamera ? "camera" : "photos"
                Alert.alert("Permission Denied", `Permission to access ${source} is required`)
                return
            }
            const pickerOptions = {
                allowsEditing: true,
                quality: 0.8,
                aspect: isProfilePicture ? [1, 1] as [number, number] : [16, 9] as [number, number],
                base64: true,
            }

            const result = useCamera
                ? await ImagePicker.launchCameraAsync(pickerOptions)
                : await ImagePicker.launchImageLibraryAsync({
                    ...pickerOptions,
                    mediaTypes: ["images"],
                })
    
            if (!result.canceled && result.assets[0].base64) {
                const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
                if (isProfilePicture) {
                    setProfilePicture(base64Image)
                } else {
                    setBannerPicture(base64Image)
                }
            }
    }

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

    const saveImage = () => {
        if (profilePicture) {
            updateProfilePicturesMutation.mutate(profilePicture)
        } else if (bannerPicture) {
            updateProfilePicturesMutation.mutate(bannerPicture)
        }
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
        handleChangeImage,
        saveImage,
        saveProfile,
        updateFormField,
        isUpdating: updateProfileMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
    }
}
