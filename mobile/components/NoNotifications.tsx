import { View, Text } from 'react-native'
import { Feather } from '@expo/vector-icons';

const NoNotifications = () => {
  return (
    <View className='flex-1 justify-center items-center px-4' style={{ minHeight: 400 }}>
        <View className='items-center'>
            <Feather name="bell-off" size={80} color="#657786" />
            <Text className='text-gray-500 text-center mt-4'>No notifications found</Text>
        </View>
    </View>
  )
}

export default NoNotifications