import {useState} from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useApiClient } from '../utils/api'

const useCreatePost = () => {
    const [content, setContent] = useState('')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const api = useApiClient()
    const queryClient = useQueryClient()

    const createPostMutation = useMutation({
        mutationFn: async(data: {content: string; imageUri?: string}) => {
            const formData = new FormData()

            if (data.content) formData.append('content', data.content)

            if (data.imageUri) {
                const uriParts = data.imageUri.split('.')
                const fileType = uriParts[uriParts.length - 1].toLowerCase()

                const mimeTypeMap: Record<string, string> = {
                    png: 'image/png',
                    gif: 'image/gif',
                    webp: 'image/webp',
                }
                const mimeType = mimeTypeMap[fileType] || 'image/jpeg'

                formData.append('image', {
                    uri: data.imageUri,
                    name: `image.${fileType}`,
                    type: mimeType,
                } as any)
            }
            return api.post("/posts", formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
        },
        onSuccess: () => {
            setContent('')
            setSelectedImage(null)
            queryClient.invalidateQueries({queryKey: ['posts']})
            Alert.alert('Success', 'Post created successfully!')
        },
        onError: (error) => {
            Alert.alert('Error', 'Failed to create post. Please try again.')
            console.error('Create post failed:', error)
        },
    })

    const handleImagePicker = async (useCamera: boolean = false) => {
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
            quality: 0.7,
            aspect: [16, 9] as [number, number],
        }

        const result = useCamera
            ? await ImagePicker.launchCameraAsync(pickerOptions)
            : await ImagePicker.launchImageLibraryAsync({
                ...pickerOptions,
                mediaTypes: ["images"],
            })

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri)
            }
        }

        const createPost = () => {
            if (!content.trim() && !selectedImage) {
                Alert.alert('Validation Error', 'Post content or image is required.')
                return
            }

            const postData: {content: string; imageUri?: string} = {
                content: content.trim()
            }

            if (selectedImage) {
                postData.imageUri = selectedImage
            }

            createPostMutation.mutate(postData)
        }

        return {
            content,
            setContent,
            selectedImage,
            isCreating: createPostMutation.isPending,
            pickImageFromGallery: () => handleImagePicker(false),
            takePhoto: () => handleImagePicker(true),
            removeImage: () => setSelectedImage(null),
            createPost,
        }
    
}
export default useCreatePost