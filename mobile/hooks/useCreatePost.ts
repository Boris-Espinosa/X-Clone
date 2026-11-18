import {useState} from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useApiClient } from '../utils/api'

const useCreatePost = () => {
    const [content, setContent] = useState('')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const api = useApiClient()
    const queryClient = useQueryClient()

    const createPostMutation = useMutation({
        mutationFn: async (data: {content: string; imageUri?: string}) => {
            const formData = new FormData()

            if (data.content) formData.append('content', data.content)
            if (data.content.includes("#")) {
                let hashtags: string[] | null= []
                hashtags = data.content.match(/#\w+/g)
                if (hashtags) {
                    for (let i = 0; i < hashtags.length; i++) {
                        hashtags[i] = hashtags[i].toLowerCase()
                    }
                    formData.append('hashtags', JSON.stringify(hashtags))
                }
            }
            if (data.imageUri) {
                if (Platform.OS === 'web') {
                    // El navegador no entiende { uri, name, type }: necesita un Blob real.
                    const blob = await fetch(data.imageUri).then((r) => r.blob())
                    formData.append('image', blob, `image.${blob.type.split('/')[1] || 'jpeg'}`)
                } else {
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
            }
            // Sin Content-Type manual: el navegador/xhr pone el boundary.
            return api.post("/posts", formData)
        },
        onSuccess: () => {
            setContent('')
            setSelectedImage(null)
            queryClient.invalidateQueries({queryKey: ['posts']})
            Alert.alert('Success', 'Post created successfully!')
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create post. Please try again.'
            Alert.alert('Error', message)
            console.error('API Error:', message)
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
            quality: 0.8,
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