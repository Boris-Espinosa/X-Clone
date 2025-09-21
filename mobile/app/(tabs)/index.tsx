import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import LogoutButton from '@/components/LogoutButton';

const HomeScreen = () => {
  return (
    <SafeAreaView className='flex-1'>
        <LogoutButton />
      <Text>HomeScreen</Text>
    </SafeAreaView>
  )
}

export default HomeScreen