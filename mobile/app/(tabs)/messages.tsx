import { View, Text, Alert, TouchableOpacity, TextInput, ScrollView, Image, Modal, Platform } from 'react-native';
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONVERSATIONS, ConversationType } from '@/data/conversations';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const MessageScreen = () => {
  const insests  = useSafeAreaInsets()
  const [searchText, setSearchText] = useState('')
  const [conversationsList, setConversationsList] = useState(CONVERSATIONS)
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')

  const deleteConversation = (id: number) => {
    Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
        setConversationsList((prev) => prev.filter(convo => convo.id !== id))
      }}
    ])
  }

  const openConversation = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  }

  const closeConversation = () => {
    setSelectedConversation(null);
    setIsChatOpen(false);
    setNewMessage('');
  }

  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      setConversationsList((prev) =>
        prev.map((convo) =>
        convo.id === selectedConversation.id
        ? {...convo, lastMessage: newMessage, time: "now"}
        : convo
        )
      )
      setNewMessage('');
      Alert.alert("Message Sent", `Your message has been sent to ${selectedConversation.user.name}`);
    }
  }


  return (
    <SafeAreaView className='flex-1 bg-white' edges={["top"]}>
      <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
        <Text className='text-xl font-bold text-gray-900'>Messages</Text>
        <TouchableOpacity>
          <Feather name="edit-2" size={20} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      <View className='px-4 py-3 border-b border-gray-100'>
        <View className='bg-gray-100 items-center flex-row rounded-full px-4 py-3'>
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder='Search Direct Messages'
            className='ml-3 flex-1 text-base'
            placeholderTextColor="#657786"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insests.bottom }}
      >
        {conversationsList.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            className='flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50'
            onPress={() => openConversation(conversation)}
            onLongPress={() => deleteConversation(conversation.id)}
          >
            <Image
              source={{ uri: conversation.user.avatar }}
              className='size-12 rounded-full mr-3'
            />
            <View className='flex-1'>
              <View className='flex-row justify-between items-center mb-1'>
                <View className='flex-row items-center'>
                  <Text className='font-semibold text-gray-900'>{conversation.user.name}</Text>
                { conversation.user.verified && (
                  <Feather name="check-circle" size={16} color="#1DA1F2" className='ml-1' />
                )}
                <Text className='text-gray-500 ml-2'>@{conversation.user.username}</Text>
                </View>
                <Text className='text-sm text-gray-500'>{conversation.time}</Text>
              </View>
              <Text className='text-sm text-gray-500' numberOfLines={1}>{conversation.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className='px-4 py-2 border-t border-gray-100 bg-gray-50'>
        <Text className='text-center text-xs text-gray-500'>
          Tap to open a conversation, long press to delete.
        </Text>
      </View>

      <Modal visible={isChatOpen} animationType="slide" presentationStyle='pageSheet'>
        {selectedConversation && (
          <SafeAreaView className='flex-1'>
            <KeyboardAwareScrollView
              className='flex-1'
              enableOnAndroid={true}
              enableAutomaticScroll={true}
              contentContainerStyle={{ flexGrow: 1 }}
            >
            <View className='flex-row items-center px-4 py-3 border-b border-gray-100'>
              <TouchableOpacity onPress={closeConversation} className='mr-3'>
                <Feather name="arrow-left" size={24} color="#1DA1F2"/>
              </TouchableOpacity>
              <Image
                source={{ uri: selectedConversation.user.avatar }}
                className='size-10 rounded-full mr-3'
              />
              <View className='flex-1'>
                <View className='flex-row items-center'>
                  <Text className='font-semibold text-gray-900 mr-1'>
                    {selectedConversation.user.name}
                  </Text>
                  { selectedConversation.user.verified && (
                    <Feather name="check-circle" size={16} color="#1DA1F2" />
                  )}
                </View>
                <Text className='text-gray-500'>@{selectedConversation.user.username}</Text>
              </View>
            </View>

            <ScrollView className='flex-1 px-4 py-4'>
              <View className='mb-4'>
                <Text className='text-center text-sm text-gray-500 px-4'>
                  This is the beggining of your direct message history with {selectedConversation.user.name}.
                </Text>

                {selectedConversation.messages.map((msg) => (
                  <View
                    key={msg.id}
                    className={`mb-3 flex-row ${msg.fromUser ? 'justify-end' : ''}`}
                  >
                    {!msg.fromUser && (
                      <Image
                        source={{ uri: selectedConversation.user.avatar }}
                        className='size-8 rounded-full mr-2'
                      />
                    )}
                    <View className={`flex-1 ${msg.fromUser ? 'items-end' : ''}`}>
                      <View
                        className={`rounded-2xl px-4 py-3 max-w-xs ${
                          msg.fromUser ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      >
                        <Text className={`${msg.fromUser ? 'text-white' : 'text-gray-900'}`}>
                          {msg.text}
                        </Text>
                      </View>
                      <Text className='text-xs text-gray-400 mt-1'>{msg.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View className='flex-row items-center px-4 py-3 border-t border-gray-100'>
              <View className='flex-1 mr-3 flex-row items-center bg-gray-100 rounded-3xl px-4 py-1'>
                <TextInput
                  placeholder='Type a message'
                  className='flex-1 text-base pb-2'
                  placeholderTextColor={"#657786"}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
              </View>
              <TouchableOpacity
                className='size-10 items-center justify-center rounded-full'
                onPress={sendMessage}
                disabled={!newMessage.trim()}>
                <Feather
                  name="send"
                  size={20}
                  color={newMessage.trim() ? "#1DA1F2" : "#AAB8C2"}
                />
              </TouchableOpacity>
            </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  )
}

//TODO: implement real messaging functionality with backend

export default MessageScreen