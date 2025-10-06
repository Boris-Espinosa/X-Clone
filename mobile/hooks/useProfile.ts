import { useState } from "react"
import { Alert, Platform } from "react-native"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useApiClient, userApi } from "@/utils/api"
import { useCurrentUser } from "./useCurrentUser"
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator';

//TODO: Implement follow and unfollow functionality


export const useProfile = () => {
    const api = useApiClient()
    const queryClient = useQueryClient()
    const { currentUser } = useCurrentUser()
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [isFollowingModalVisible, setIsFollowingModalVisible] = useState(false)
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

    const updateProfilePicturesMutation = useMutation({
        mutationFn: async ({ imageUri, isProfile }: { imageUri: string; isProfile: boolean }) => {

            const formData = new FormData()
            const uriParts = imageUri.split('.')
            const fileType = uriParts[uriParts.length - 1].toLowerCase()
            
            const mimeTypeMap: Record<string, string> = {
                png: 'image/png',
                gif: 'image/gif',
                webp: 'image/webp',
            }
            const mimeType = mimeTypeMap[fileType] || 'image/jpeg'

            if (isProfile) {
                console.log("Updating profile picture...")
                
                formData.append('profileImage', {
                    uri: imageUri,
                    name: `profileImage.${fileType}`,
                    type: mimeType,
                } as any)

                return userApi.updateProfilePicture(api, formData)
            } else {
                console.log("Updating banner picture...")
                
                formData.append('bannerImage', {
                    uri: imageUri,
                    name: `bannerImage.${fileType}`,
                    type: mimeType,
                } as any)
                
                return userApi.updateProfileBanner(api, formData)
            }
        },
        onSuccess: () => {
            console.log("Profile picture updated successfully")
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
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
                aspect: isProfilePicture ? [1, 1] as [number, number] : [2, 1] as [number, number],
                base64: false,
            }

            const result = useCamera
                ? await ImagePicker.launchCameraAsync(pickerOptions)
                : await ImagePicker.launchImageLibraryAsync({
                    ...pickerOptions,
                    mediaTypes: ["images"],
                })
    
            if (!result.canceled && result.assets[0].uri) {
                if (Platform.OS === 'ios' && !isProfilePicture) {
                    const imageContext = ImageManipulator.ImageManipulator.manipulate(result.assets[0].uri)
                    imageContext.crop({ originX: 0, originY: 0, width: result.assets[0].width, height: result.assets[0].height / 2 })
                    imageContext.resize({ width: 1000, height: 500 })
                    const image = await imageContext.renderAsync()
                    const imageUri= await image.saveAsync({
                        format: ImageManipulator.SaveFormat.JPEG,
                        compress: 0.8,
                    })
                    updateProfilePicturesMutation.mutate({ imageUri: imageUri.uri, isProfile: false })
                } else {
                    if (isProfilePicture) {
                        updateProfilePicturesMutation.mutate({ imageUri: result.assets[0].uri, isProfile: true })
                    } else {
                        updateProfilePicturesMutation.mutate({ imageUri: result.assets[0].uri, isProfile: false })
                    }
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

    const openfollowersModal = () => {
        if(currentUser) {
            console.log("trying open modal")
            setIsFollowingModalVisible(true)
        }
    }

    const getFollowersMutation = useMutation({
        mutationFn: (userId: string) => userApi.getUserById(api, userId),
        onSuccess: async() => {
            queryClient.invalidateQueries({queryKey: ["currentUser"], refetchType: "active"})
        }
    })

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
        getFollowers: (userId: string) => getFollowersMutation.mutate(userId),
        openfollowersModal,
        closeFollowersModal: () => setIsFollowingModalVisible(false),
        isFollowingModalVisible,
        isEditModalVisible,
        openEditModal,
        closeEditModal: () => setIsEditModalVisible(false),
        formData,
        saveProfile,
        updateFormField,
        isUpdating: updateProfileMutation.isPending,
        refetch: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
        changeBannerFromGallery: () => handleChangeImage(false, false),
        changeBannerFromCamera: () => handleChangeImage(true, false),
        changeProfileFromGallery: () => handleChangeImage(false, true),
        changeProfileFromCamera: () => handleChangeImage(true, true),
    }
}
