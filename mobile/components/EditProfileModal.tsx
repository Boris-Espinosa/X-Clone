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
    
    // Función para limitar líneas en un texto
    const limitLines = (text: string, maxLines: number) => {
        const lines = text.split('\n');
        if (lines.length > maxLines) {
            return lines.slice(0, maxLines).join('\n');
        }
        return text;
    };

    
    const handleTextChange = (field: string, text: string, maxLines?: number) => {
        let processedText = text;
        
        // Si se especifica un límite de líneas, aplicarlo
        if (maxLines) {
            processedText = limitLines(text, maxLines);
        }
        
        updateFormField(field, processedText);
    };

    const handleSave = () => {
        saveProfile();
        onClose();
    }

    return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View className='flex-row justify-between items-center px-4 py-3 border-b border-b-gray-100 bg-white'>
        <TouchableOpacity onPress={onClose} className='p-2'>
            <Text className='text-blue-500 text-lg'>Cancel</Text>
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
                    numberOfLines={1}
                    placeholder='First Name'
                    placeholderTextColor={"#A0AEC0"}
                    value={formData.firstName}
                    onChangeText={(text) => handleTextChange('firstName', text, 1)}
                />
            </View>

            <View>
                <Text className='text-gray-500 text-sm mb-2'>Last Name</Text>
                <TextInput
                    className='border border-gray-200 rounded-lg px-3 py-3 text-base mb-2'
                    maxLength={30}
                    multiline
                    numberOfLines={1}
                    placeholder='Last Name'
                    placeholderTextColor={"#A0AEC0"}
                    value={formData.lastName}
                    onChangeText={(text) => handleTextChange('lastName', text, 1)}
                />
            </View>

            <View>
                <Text className='text-gray-500 text-sm mb-2'>Username</Text>
                <TextInput
                    className='border border-gray-200 rounded-lg px-3 py-3 text-base mb-2'
                    maxLength={20}
                    multiline
                    numberOfLines={1}
                    placeholder='Username'
                    placeholderTextColor={"#A0AEC0"}
                    value={formData.username}
                    onChangeText={(text) => handleTextChange('username', text, 1)}
                />
            </View>

            <View>
                <Text className='text-gray-500 text-sm mb-2'>Bio</Text>
                <TextInput
                    className='border border-gray-200 rounded-lg px-3 py-3 text-base mb-2'
                    numberOfLines={3}
                    multiline
                    maxLength={161}
                    placeholder='Bio'
                    placeholderTextColor={"#A0AEC0"}
                    value={formData.bio}
                    textAlignVertical='top'
                    onChangeText={(text) => handleTextChange('bio', text, 3)}
                />
            </View>

            <View>
                <Text className='text-gray-500 text-sm mb-2'>Location</Text>
                <TextInput
                    className='border border-gray-200 rounded-lg px-3 py-3 text-base mb-2'
                    placeholder='Location'
                    placeholderTextColor={"#A0AEC0"}
                    maxLength={40}
                    multiline
                    numberOfLines={1}
                    value={formData.location}
                    onChangeText={(text) => handleTextChange('location', text, 1)}
                />
            </View>
        </View>
      </ScrollView>
    </Modal>
  )
}

export default EditProfileModal