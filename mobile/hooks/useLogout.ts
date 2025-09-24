import { useClerk } from '@clerk/clerk-expo'
import { Alert } from 'react-native'

export const useLogout = () => {
  const { signOut } = useClerk()

  const handleLogout = () => {
    Alert.alert('Logout', "Are you sure you want to logout?", [
      { text: 'Cancel', style: 'cancel'},
      { text: 'Logout', style: 'destructive', onPress: async () => {
        try {
          await signOut()
        } catch (error) {
          Alert.alert('Error', 'Failed to logout. Please try again.')
        }
      }}
    ])
  }
  return { handleLogout }
}