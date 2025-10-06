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
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { useState } from 'react';
import FollowersModal from '@/components/FollowersModal';

//TODO: add expand image when clicking
//TODO: add go to profile when clicking users on home screen
//TODO: add modal to show followers/following and filter by name

const ProfileScreen = () => {
  const { currentUser, isLoading } = useCurrentUser()
  const [isFollowersVisible, setIsFollowersVisible] = useState(false)
  const [isFollowingVisible, setIsFollowingVisible] = useState(false)
  const insets = useSafeAreaInsets()
  const fullName = currentUser
    ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || "User"
    : "User"
  const {
    posts: userPosts,
    refetch: refetchPosts,
    isLoading: isRefetching
  } = usePosts(currentUser?.username)
  const {
    isFollowingModalVisible,
    openfollowersModal,
    closeFollowersModal,
    changeBannerFromGallery,
    changeBannerFromCamera,
    changeProfileFromGallery,
    changeProfileFromCamera,
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    updateFormField,
    isUpdating,
    refetch: refetchProfile,
  } = useProfile();

  const [menuLayer, setMenuLayer] = useState<"main" | "banner" | "profile" | null>("main");

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
      <TouchableOpacity>
        <Image
          className='w-full h-48 bg-gray-200'
          source={{ uri: currentUser?.bannerImage || "https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" }}
          resizeMode='cover'
        />
      </TouchableOpacity>
        <View className='px-4 pb-4 border-b border-gray-100'>
          <View className='flex-row justify-between items-end -mt-16 -mb-4'>
            <TouchableOpacity>
              <Image
                className='size-32 rounded-full border-4 border-white bg-gray-200'
                source={{ uri: currentUser?.profilePicture || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" }}
              />
            </TouchableOpacity>

            <Menu onBackdropPress={() => setMenuLayer("main")} renderer={renderers.ContextMenu} style={{ position: 'absolute', left: 78, top: 2, zIndex: 10}}>
            <MenuTrigger
              customStyles={{
                triggerWrapper: {
                  backgroundColor: 'white',
                  borderRadius: 9999,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                },
                triggerTouchable: {
                  underlayColor: '#F3F4F6',
                  activeOpacity: 0.6,
                  style: {
                    borderRadius: 9999,
                  }
                }
              }}
            >
              <Feather name="edit-2" size={20} color="#1DA1F2" />
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: { marginLeft: -5, borderRadius: 10, padding: 10, marginRight: 170}, optionTouchable: { underlayColor: '#F3F4F6', activeOpacity: 0.6, style: { borderRadius: 10 }}}}>
              {menuLayer === "main" && (
              <>
                <MenuOption onSelect={() => {setMenuLayer("banner"); return false}} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                  <Feather name="image" size={20} color="#1DA1F2" />
                  <Text className='text-gray-900 text-sm font-semibold'>  Change Banner Picture</Text>
                </MenuOption>
                <MenuOption onSelect={() => {setMenuLayer("profile"); return false}} style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Feather name="user" size={20} color="#1DA1F2" />
                  <Text className='text-gray-900 text-sm font-semibold'>  Change Profile Picture</Text>
                </MenuOption>
              </>
              )}
              {menuLayer === "banner" && (
                <>
                  <MenuOption onSelect={() => {changeBannerFromCamera(); setMenuLayer("main")}} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <Feather name="camera" size={20} color="#1DA1F2" />
                    <Text className='text-gray-900 text-sm font-semibold'>  Camera</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => {changeBannerFromGallery(); setMenuLayer("main")}} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather name="image" size={20} color="#1DA1F2" />
                    <Text className='text-gray-900 text-sm font-semibold'>  Gallery</Text>
                  </MenuOption>
                </>
              )}
                
              {menuLayer === "profile" && (
                <>
                  <MenuOption onSelect={() => {changeProfileFromCamera(); setMenuLayer("main")}} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <Feather name="camera" size={20} color="#1DA1F2" />
                    <Text className='text-gray-900 text-sm font-semibold'>  Camera</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => {changeProfileFromGallery(); setMenuLayer("main")}} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Feather name="image" size={20} color="#1DA1F2" />
                    <Text className='text-gray-900 text-sm font-semibold'>  Gallery</Text>
                  </MenuOption>
                </>
              )}
            </MenuOptions>
            </Menu>

            <TouchableOpacity onPress={openEditModal} className=' -top-4 px-6 py-2 border border-gray-300 rounded-full active:bg-gray-100'>
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
                <TouchableOpacity className='mr-4' onPress={() => {
                  setIsFollowingVisible(true)
                  openfollowersModal()
                }}>
                  <Text className='text-gray-900 font-bold mr-1'>{currentUser.following.length}
                    <Text className='font-normal text-gray-500'> Following</Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setIsFollowersVisible(true)
                  openfollowersModal()
                }}>
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

      <FollowersModal
        isVisible={isFollowingModalVisible}
        isFollowingVisible={isFollowingVisible}
        isFollowersVisible={isFollowersVisible}
        onClose={() => {
          closeFollowersModal()
          setIsFollowersVisible(false)
          setIsFollowingVisible(false)
        }}
      />
    </SafeAreaView>
  )
}

export default ProfileScreen