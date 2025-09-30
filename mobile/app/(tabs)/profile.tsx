import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Feather } from '@expo/vector-icons';
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoutButton from '@/components/LogoutButton';
import { format } from 'date-fns';
import { usePosts } from '../../hooks/usePosts';
import PostsList from '@/components/PostsList';
import { useProfile } from '@/hooks/useProfile';
import EditProfileModal from '@/components/EditProfileModal';

const ProfileScreen = () => {
  const { currentUser, isLoading } = useCurrentUser()
  const insets = useSafeAreaInsets()
  const fullName = currentUser?.firstName.concat(" " + currentUser.lastName) || "User"

  const {
    posts: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching
  } = usePosts(currentUser?.username)
  const {
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    updateFormField,
    isUpdating,
    refetch: refetchProfile,
  } = useProfile();



  if(isLoading) {
    return (
      <View className='flex-1 justify-center items-center '>
        <ActivityIndicator size="large" color="#1DA1F2"/>
      </View>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={["top"]}>
      <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-100'>
        <View>
          <Text className='text-xl font-bold text-gray-900'>{fullName}</Text>
          <Text className='text-gray-500'>{userPosts.length === 0 ? "" : userPosts.length > 1 ? userPosts.length + " Posts" : userPosts.length + " Post"}</Text>
        </View>
        <LogoutButton />
      </View>

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsHorizontalScrollIndicator={false}
        refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            refetchProfile()
            refetchPosts()
          }}
          tintColor="#1DA1F2"
          colors={["#1DA1F2"]}
        />}
      >
      <Image
        className='w-full h-48 bg-gray-200'
        source={{ uri: currentUser?.bannerImage || "https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" }}
        resizeMode='cover'
      />

        <View className='px-4 pb-4 border-b border-gray-100'>
          <View className='flex-row justify-between items-end -mt-16 -mb-4'>
            <Image
              className='size-32 rounded-full border-4 border-white bg-gray-200'
              source={{ uri: currentUser?.profilePicture || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" }}
            />
            <TouchableOpacity onPress={openEditModal} className='px-6 py-2 border border-gray-300 rounded-full active:bg-gray-100'>
              <Text className='text-gray-900 font-semibold'>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View className='mt-4'>
            <View className='flex-row items-center mb-1'>
              <Text className='font-bold text-gray-900 text-xl mr-1'>{fullName}</Text>
              <Feather name="check-circle" size={16} color="#1DA1F2" />
            </View>
            <Text className='text-gray-500 text-base mb-2'>@{currentUser?.username}</Text>
            { currentUser?.bio && (
              <Text className='text-gray-900 text-base mb-2'>{currentUser.bio}</Text>
            )}
            { currentUser?.location && (
              <View className='flex-row items-center mb-1'>
                <Feather name="map-pin" size={16} color="#657786" />
                <Text className='text-gray-500 text-base ml-1'>{currentUser.location}</Text>
              </View>
            )}
            <View className='flex-row items-center'>
              <Feather name="calendar" size={16} color="#657786" />
              <Text className='text-gray-500 text-base ml-1'>Joined {format(new Date(currentUser.createdAt), "dd MMMM yyyy")}</Text>
            </View>

            <View>
              <View className='flex-row mt-3'>
                <TouchableOpacity className='mr-4'>
                  <Text className='text-gray-900 font-bold mr-1'>{currentUser.following.length}
                    <Text className='font-normal text-gray-500'> Following</Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className='text-gray-900 font-bold mr-4'>{currentUser.followers.length}
                    <Text className='font-normal text-gray-500'> Followers</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <PostsList username={currentUser?.username}/>
      </ScrollView>

      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        formData={formData}
        updateFormField={updateFormField}
        saveProfile={saveProfile}
        isUpdating={isUpdating}
      />
    </SafeAreaView>
  )
}

export default ProfileScreen