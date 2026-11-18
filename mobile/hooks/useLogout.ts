import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { confirmAction } from '@/utils/confirm'

export const useLogout = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleLogout = () => {
    confirmAction({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmLabel: 'Logout',
      onConfirm: async () => {
        try {
          await signOut()
          router.replace('/(auth)')
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to logout. Please try again.')
        }
      },
    })
  }
  return { handleLogout }
}
