import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { useNotifications } from '@/hooks/useNotifications'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import NoNotifications from '@/components/NoNotifications';
import { Notification } from '@/types';
import NotificationCard from '@/components/NotificationCard';



const NotificationScreen = () => {

  const { notifications, isLoading, error, refetch, isRefetching, deleteNotification } = useNotifications()
  const insets = useSafeAreaInsets();

  if (error) {
    return (
      <View className='flex-1 justify-center items-center p-8'>
        <Text className='text-red-500'>Failed to load notifications</Text>
        <TouchableOpacity onPress={() => refetch()} className='mt-4 px-4 py-2 bg-blue-500 rounded-full'>
          <Text className='text-white'>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }
  

  return (
    <SafeAreaView className='flex-1 bg-white' edges={["top"]}>
      <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-100'>
        <Text className='text-xl font-bold text-gray-900'>Notifications</Text>
        <TouchableOpacity>
          <Feather name="settings" size={24} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#1DA1F2"
            colors={["#1DA1F2"]}
          />
        }
      >
        {isLoading ? (
          <View className='flex-1 justify-center items-center p-8'>
            <ActivityIndicator size="large" color="#1DA1F2" />
            <Text className='text-gray-500'>Loading notifications...</Text>
          </View>) : notifications.length === 0 ?(
            <NoNotifications />
          ) : (
            notifications.map((notification: Notification) => (
              <NotificationCard
              key={notification._id}
              notification={notification}
              onDelete={deleteNotification}
              />
            )
          ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default NotificationScreen