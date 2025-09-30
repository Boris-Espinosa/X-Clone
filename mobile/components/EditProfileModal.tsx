import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React from 'react'

interface EditProfileModalProps {
    isVisible: boolean;
    onClose: () => void;
    formData: {
        firstName: string;
        lastName: string;
        username: string;
        bio: string;
        location: string;
    };
    updateFormField: (field: string, value: string) => void;
    saveProfile: () => void;
    isUpdating: boolean;
}

const EditProfileModal = ({isVisible, onClose, formData, updateFormField, saveProfile, isUpdating}: EditProfileModalProps) => {
    const handleSave = () => {
        saveProfile();
        onClose();
    }

    return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View className='flex-row justify-between items-center px-4 py-3 border-b border-b-gray-100 bg-white'>
        <TouchableOpacity onPress={onClose} className='p-2'>
            <Text className='text-blue-500 text-lg'>cancel</Text>
        </TouchableOpacity>
        <Text className='text-lg font-semibold'>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isUpdating}>
            <Text className={`text-lg ${isUpdating ? 'text-gray-400' : 'text-blue-500'}`}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1 px-4 py-6' showsVerticalScrollIndicator={false}>
        <View className='space-y-4'>
            <View>
                <Text className='text-gray-500 text-sm mb-2'>First Name</Text>
                <TextInput
                    className='border border-gray-200 rounded-lg px-3 py-3 text-base mb-2'
                    maxLength={30}
                    multiline
                    placeholder='First Name'
                    value={formData.firstName}
                    onChangeText={(text) => updateFormField('firstName', text)}
                />
            </View>

            <View>
                <Text className='text-gray-500 text-sm mb-2'>Last Name</Text>
                <TextInput
                    className='border border-gray-200 rounded-lg px-3 py-3 text-base mb-2'
                    maxLength={30}
                    multiline
                    placeholder='Last Name'
                    value={formData.lastName}
                    onChangeText={(text) => updateFormField('lastName', text)}
                />
            </View>

            <View>
                <Text className='text-gray-500 text-sm mb-2'>Username</Text>
                <TextInput
                    className='border border-gray-200 rounded-lg px-3 py-3 text-base mb-2'
                    maxLength={20}
                    multiline
                    placeholder='Username'
                    value={formData.username}
                    onChangeText={(text) => updateFormField('username', text)}
                />
            </View>

            <View>
                <Text className='text-gray-500 text-sm mb-2'>Bio</Text>
                <TextInput
                    className='border border-gray-200 rounded-lg px-3 py-3 text-base mb-2'
                    numberOfLines={3}
                    multiline
                    maxLength={200}
                    placeholder='Username'
                    value={formData.bio}
                    textAlignVertical='top'
                    onChangeText={(text) => updateFormField('bio', text)}
                />
            </View>

            <View>
                <Text className='text-gray-500 text-sm mb-2'>Location</Text>
                <TextInput
                    className='border border-gray-200 rounded-lg px-3 py-3 text-base mb-2'
                    placeholder='Username'
                    maxLength={40}
                    multiline
                    value={formData.location}
                    onChangeText={(text) => updateFormField('location', text)}
                />
            </View>
        </View>
      </ScrollView>
    </Modal>
  )
}

export default EditProfileModal