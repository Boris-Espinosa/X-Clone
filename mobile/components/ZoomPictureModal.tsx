import { View, Modal, Image, TouchableOpacity, useWindowDimensions } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context"
import { Feather } from '@expo/vector-icons'

interface ZoomPictureModalProps {
    selectedPicture: string | null;
    isVisible: boolean;
    onClose: () => void;
}

const ZoomPictureModal = ({selectedPicture, isVisible, onClose}: ZoomPictureModalProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  if (!selectedPicture) return null;

  return (
      <Modal visible={isVisible} animationType="fade" transparent={true} onRequestClose={onClose} statusBarTranslucent={true}>
        <View className='flex-1 bg-black/90'>
            <SafeAreaView edges={["top", "bottom"]} className='flex-1'>
                <View className='flex-row justify-between items-center px-4 py-3'>
                    <View className='w-12' />
                    <TouchableOpacity
                        onPress={onClose}
                        className='bg-white/10 p-2 rounded-full'
                    >
                        <Feather name="x" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className='items-center justify-center flex-1 px-4'>
                    <Image
                        source={{uri: selectedPicture}}
                        style={{
                            width: screenWidth - 32,
                            height: screenHeight * 0.7
                        }}
                        resizeMode="contain"
                    />
                </View>
            </SafeAreaView>
        </View>
      </Modal>
  )
}

export default ZoomPictureModal