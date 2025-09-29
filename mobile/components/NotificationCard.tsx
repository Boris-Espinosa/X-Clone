import { View, Text, Alert, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Notification } from '@/types';
import { Feather } from '@expo/vector-icons';
import { FormatDate } from '@/utils/formatters';


interface NotificationCardProps {
    notification: Notification;
    onDelete: (notificationId: string) => void;
}

const NotificationCard = ({ onDelete, notification }: NotificationCardProps) => {

    const getNotificationText = () => {
        const name = `${notification.from.firstName} ${notification.from.lastName}`;
        switch (notification.type) {
            case 'like':
                return `${name}liked your post.`;
            case 'comment':
                return `${name}commented on your post.`;
            case 'follow':
                return `${name}started following you.`;
            default:
                return 'You have a new notification.';
        }
    }

    const getNotificationIcon = () => {
        switch (notification.type) {
            case 'like': return <Feather name="heart" size={20} color="#E0245E" />;
            case 'comment': return <Feather name="message-circle" size={20} color="#1DA1F2" />;
            case 'follow': return <Feather name="user-plus" size={20} color="#17BF63" />;
            default: return <Feather name="bell" size={20} color="#657786" />;
        }
    }

    const handleDelete = () => {
        Alert.alert("Delete Notification", "Are you sure you want to delete this notification?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => onDelete(notification._id) }
        ])
    }

  return (
    <View className='border-b border-gray-100 bg-white'>
        <View className='p-4 flex-row'>
            <View className='relative mr-3'>
                <Image
                    source={{ uri: notification.from.profilePicture || "" }}
                    className='size-12 rounded-full'
                />

                <View className='relative -bottom-1 -right-1 size-6 bg-white items-center justify-center'>
                    {getNotificationIcon()}
                </View>
            </View>

            <View className='flex-1'>
                <View className='flex-row justify-between items-start mb-1'>
                    <View className='flex-1'>
                        <Text className='text-gray-900 text-base leading-5'>{getNotificationText()}</Text>
                        {notification.comment?.content && (
                            <View className='flex-row mr-3'>
                                <View className='bg-blue-50 p-3 rounded-lg mt-1 flex-row'>
                                    <Text className='text-gray-700' numberOfLines={3}>{notification.comment.content}</Text>
                                </View>
                                <View className='flex-1' />
                            </View>
                        )}
                        <Text className='text-gray-500 text-sm mt-1'>{FormatDate(notification.createdAt)} Ago</Text>
                    </View>
                </View>
            </View>
                {notification.post?.image && (
                    <Image
                        source={{ uri: notification.post.image || "" }}
                        className='size-16 rounded-lg mt-2'
                        resizeMode='cover'
                    />
                )}
                    <TouchableOpacity onPress={() => handleDelete()} className='ml-3 mt-1'>
                        <Feather name="trash-2" size={16} color="#E0245E" />
                    </TouchableOpacity>
        </View>
    </View>
  )
}

export default NotificationCard