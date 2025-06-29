import {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppStatusBar from '../../components/AppStatusBar';
import Colors from '../../utilities/constants/colors';
import {PrevWhite, Send} from '../../assets/svg';
import {Typography} from '../../utilities/constants/constant.style';
import DropShadow from 'react-native-drop-shadow';
import {DEFAULT_LANGUAGE} from '../../utilities';
import {useTranslation} from 'react-i18next';
import AppTextInput from '../../components/AppTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {getAllFCMTokens} from '../../utilities/fcmTokenManager';
import {SendMessageNotifications} from '../../utilities/notificationService';
import io from 'socket.io-client';
import {
  getOneChat,
  getMessages,
  sendMessage,
  markMessagesAsSeen,
  createChat,
} from '../../redux/features/chat/chatThunks';
import { clearCurrentChat } from '../../redux/features/chat/chatSlice';
import {
  selectCurrentChat,
  selectAllMessages,
} from '../../redux/features/chat/chatSelectors';
import {
  selectAuthUserId,
  selectUserDetails,
} from '../../redux/features/auth/authSelectors';
import {EnvConfig} from '../../config/envConfig';
import {fetchUserInfo} from '../../redux/features/auth/authThunks';

const Message = ({message, isSender, senderName = '', time = ''}) => (
  <View style={styles.messageWrapper}>
    {!isSender && senderName && (
      <Text style={styles.senderNameStyle}>{senderName}</Text>
    )}
    <View
      style={[
        styles.messageContainerStyle,
        isSender ? styles.senderMessageStyle : styles.receiverMessageStyle,
      ]}>
      <Text
        style={[
          styles.messageTextStyle,
          isSender ? styles.senderTextStyle : styles.receiverTextStyle,
        ]}>
        {message}
      </Text>
    </View>
    {time && (
      <Text
        style={[
          styles.messageTimeStyle,
          {alignSelf: isSender ? 'flex-end' : 'flex-start'},
        ]}>
        {time}
      </Text>
    )}
  </View>
);

const Chat = ({route, navigation}) => {
  const [message, setMessage] = useState('');
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const currentChat = useSelector(selectCurrentChat);
  const authorId = useSelector(selectAuthUserId);
  const userDetails = useSelector(selectUserDetails);
  const messages = useSelector(selectAllMessages);
  const userId = useSelector(selectAuthUserId);
  const {t} = useTranslation();
  const socket = useRef(null);
  const flatListRef = useRef(null);

  const {secondUserId, reciepentData, socketInstance} = route?.params || {};

  useEffect(() => {
    dispatch(fetchUserInfo(authorId));
  }, [authorId]);

  // Clear messages when component mounts or when secondUserId changes
  useEffect(() => {
    setRealTimeMessages([]);
    setIsLoading(true);
    
    if (secondUserId) {
      // Clear current chat state first
      dispatch(clearCurrentChat());
      
      // Then get the chat for the new user
      dispatch(getOneChat(secondUserId));
    }
  }, [secondUserId]);

  // Handle route params changes
  useEffect(() => {
    const { secondUserId: newSecondUserId } = route?.params || {};
    if (newSecondUserId && newSecondUserId !== secondUserId) {
      setRealTimeMessages([]);
      setIsLoading(true);
      dispatch(clearCurrentChat());
      dispatch(getOneChat(newSecondUserId));
    }
  }, [route?.params]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Clear chat state when leaving the screen
      dispatch(clearCurrentChat());
      setRealTimeMessages([]);
    };
  }, []);

  // Handle screen focus to ensure proper chat loading
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (secondUserId) {
        // Clear and reload chat when screen comes into focus
        setRealTimeMessages([]);
        setIsLoading(true);
        dispatch(clearCurrentChat());
        dispatch(getOneChat(secondUserId));
      }
    });

    return unsubscribe;
  }, [navigation, secondUserId]);

  const scrollToBottom = (animated = true) => {
    if (flatListRef.current && realTimeMessages.length > 0) {
      flatListRef.current.scrollToIndex({index: 0, animated});
    }
  };

  useEffect(() => {
    if (realTimeMessages.length > 0) {
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [realTimeMessages]);

  useEffect(() => {
    if (Array.isArray(currentChat) && currentChat.length > 0) {
      const chatId = currentChat[0]?._id;
      if (chatId) {
        dispatch(getMessages(chatId));
        dispatch(markMessagesAsSeen(chatId));
      }
    } else {
      // If no chat exists or chat array is empty, set loading to false
      setIsLoading(false);
    }
  }, [currentChat]);

  useEffect(() => {
    if (messages.length > 0) {
      const sortedMessages = [...messages].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setRealTimeMessages(sortedMessages);
    }
    // Set loading to false regardless of whether there are messages or not
    setIsLoading(false);
  }, [messages]);

  //  Connect socket
  useEffect(() => {
    // Use the passed socket instance if available
    if (socketInstance) {
      socket.current = socketInstance;
      console.log('Using passed socket instance in Chat screen');
    } else if (!socket.current?.connected) {
      // Fallback to creating new connection if no instance passed
      socket.current = io(EnvConfig.socket.url);
      console.log('Created new socket connection in Chat screen');
    }

    if (userId) {
      socket.current.emit('new-user-add', userId);
    }

    socket.current.on('receive-message', data => {
      setRealTimeMessages(prevMessages => {
        const filteredMessages = prevMessages.filter(
          msg => msg._id !== data._id,
        );
        return [data, ...filteredMessages];
      });

      if (Array.isArray(currentChat) && currentChat.length > 0) {
        const chatId = currentChat[0]?._id;
        if (chatId) {
          dispatch(markMessagesAsSeen(chatId));
        }
      }
    });

    socket.current.on('get-users', users => {
      console.log('Active users in Chat screen:', users);
    });

    return () => {
      // Don't disconnect socket here since Messages screen might need it
      console.log('Chat screen socket cleanup');
    };
  }, [userId, currentChat, socketInstance]);

  const handleSend = async () => {
    try {
      if (message.trim()) {
        let chatId;

        // If no current chat exists, create one first
        if (
          !currentChat ||
          !Array.isArray(currentChat) ||
          currentChat.length === 0
        ) {
          try {
            // First try to get an existing chat
            const getChatResponse = await dispatch(getOneChat(secondUserId));
            console.log('getChatResponse', getChatResponse);
            if (
              getChatResponse &&
              getChatResponse.payload &&
              getChatResponse.payload.length > 0
            ) {
              chatId = getChatResponse.payload[0]._id;
            } else {
              // If no chat exists, create a new one
              const createChatResponse = await dispatch(
                createChat(secondUserId),
              );
              if (createChatResponse && createChatResponse.payload) {
                chatId = createChatResponse.payload._id;
              } else {
                throw new Error('Failed to create chat');
              }
            }
            // Get the chat details after creating/finding it
            const res = await dispatch(getOneChat(secondUserId));
            
            if (res && res.payload && res.payload.length > 0) {
              chatId = res.payload[0]._id;
            }
          } catch (error) {
            console.error('Error handling chat:', error);
            return;
          }
        } else {
          chatId = currentChat[0]._id;
        }

        const messageData = {
          chatId: chatId,
          text: message,
          author: authorId,
          authorId: authorId,
          receiverId: secondUserId,
          createdAt: new Date().toISOString(),
          _id: Date.now().toString(),
        };

        try {
          socket.current.emit('send-message', messageData);
        } catch (error) {
          console.error('Error sending message:', error);
        }
        setRealTimeMessages(prevMessages => [messageData, ...prevMessages]);
        const sendMessageData = {
          chatId: chatId,
          text: message,
          author: authorId,
        };
        await dispatch(sendMessage(sendMessageData));
        setMessage('');
        scrollToBottom(true);

        // Refresh messages after sending
        await dispatch(getMessages(chatId));

        // Get all FCM tokens
        const allTokens = await getAllFCMTokens();
        // Filter the token for the recipient (second user)
        const recipientTokenObj = allTokens.find(
          tokenObj => tokenObj.userId === secondUserId,
        );
        if (recipientTokenObj && recipientTokenObj.token) {
          const recipientToken = recipientTokenObj.token;
          const senderName =
            (userDetails?.firstName ? userDetails.firstName : 'Someone') +
            (userDetails?.secondName ? ' ' + userDetails.secondName : '');
          await SendMessageNotifications(
            [recipientToken],
            message,
            `${senderName} sent you a message`,
            userDetails?.avatar?.uri || null,
          );
        }
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
      // You might want to add additional error handling here,
      // like showing a user-friendly error message
    }
  };
  console.log(reciepentData,'reciepentData')
  const chatInfo = reciepentData
    ? {
        email: reciepentData.email || '',
        brand:
          reciepentData.firstName + ' ' + reciepentData.secondName ||
          'Cannondale',
        firstInitial: reciepentData.firstName
          ? reciepentData.firstName.charAt(0).toUpperCase()
          : 'U',
        userId: reciepentData._id || null,
      }
    : {
        owner: {en: 'Paul', sp: 'Pablo'},
        secondName: '',
        email: '',
        brand: 'Cannondale',
        location: 'Madrid',
        price: '21',
        rate: 'Topstone',
        avatar: null,
        firstInitial: 'P',
        userId: null,
      };
  return (
    <KeyboardAvoidingView 
      style={styles.background}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <AppStatusBar />
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.navigate('Messages1')}>
          <PrevWhite height={18} width={18} />
        </TouchableOpacity>
        <Text style={[Typography.f_24_inter_semi_bold, styles.headerTextStyle]}>
          {t('chat')}
        </Text>
        <Text />
      </View>

      <DropShadow style={styles.shadowContainerStyle}>
        <View style={styles.chatInfoContainerStyle}>
          {chatInfo.avatar ? (
            <Image source={chatInfo.avatar} style={styles.avatarImageStyle} />
          ) : (
            <View style={styles.initialAvatarContainer}>
              <Text style={styles.initialAvatarText}>
                {chatInfo.firstInitial}
              </Text>
            </View>
          )}
          <View style={styles.chatDetailsStyle}>
            <View style={styles.chatHeaderStyle}>
              {chatInfo.location && (
                <Text style={styles.locationStyle}>{chatInfo.location}</Text>
              )}
            </View>

            {(chatInfo.brand || chatInfo.price) && (
              <View style={styles.chatHeaderStyle}>
                {chatInfo.brand && (
                  <Text style={styles.brandNameStyle}>{chatInfo.brand}</Text>
                )}
              </View>
            )}

            {chatInfo.email && (
              <Text style={styles.rateStyle}>{chatInfo.email}</Text>
            )}
          </View>
        </View>
      </DropShadow>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          inverted
          contentContainerStyle={styles.messagesListStyle}
          data={[...realTimeMessages]}
          keyExtractor={(item, index) => item._id || index.toString()}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', color: Colors.gray}}>
              {t('no_messages_yet')}
            </Text>
          }
          ListFooterComponent={
            realTimeMessages.length > 0 &&
            realTimeMessages[0]?.createdAt &&
            !isNaN(new Date(realTimeMessages[0].createdAt)) ? (
              <Text
                style={[
                  Typography.f_12_roboto_regular,
                  {color: Colors.black, textAlign: 'center', paddingBottom: 40},
                ]}>
                {new Date(realTimeMessages[0].createdAt).toLocaleDateString(
                  DEFAULT_LANGUAGE,
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  },
                )}
              </Text>
            ) : null
          }
          renderItem={({item, index}) => {
            const isUserMessage = item.authorId === userId;
            const messageTime = new Date(
              item.createdAt || Date.now(),
            ).toLocaleTimeString(DEFAULT_LANGUAGE, {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View
                key={item._id}
                style={[
                  index === realTimeMessages.length - 1 && {paddingBottom:Platform.OS === 'ios' ? 0 : 40},
                ]}>
                <Message
                  message={item.text}
                  isSender={isUserMessage}
                  senderName={
                    !isUserMessage
                      ? `${
                          reciepentData.firstName +
                          ' ' +
                          reciepentData.secondName
                        }`
                      : ''
                  }
                  time={messageTime}
                />
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.inputContainerStyle}>
        <View style={{width: '85%'}}>
          <AppTextInput
            placeholder={t('enter_msg_placeholder')}
            value={message}
            onChangeText={setMessage}
            multiline
            style={styles.inputStyle}
          />
        </View>
        <View style={{marginBottom: -12}}>
          <TouchableOpacity
            style={styles.sendButtonStyle}
            onPress={handleSend}
            activeOpacity={0.8}>
            <Send />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 55,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTextStyle: {
    color: Colors.white,
  },
  shadowContainerStyle: {
    shadowColor: Colors.gray,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 2},
  },
  chatInfoContainerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: -37,
    alignItems: 'center',
  },
  avatarImageStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  chatDetailsStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerNameStyle: {
    ...Typography.f_12_inter_regular,
    color: Colors.black,
  },
  locationStyle: {
    ...Typography.f_12_inter_regular,
    color: Colors.black,
  },
  brandNameStyle: {
    ...Typography.f_18_inter_medium,
    color: Colors.black,
  },
  rateStyle: {
    ...Typography.f_12_inter_regular,
    color: Colors.black,
  },
  messagesListStyle: {
    padding: 15,
  },
  messageContainerStyle: {
    maxWidth: '80%',
    marginVertical: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 25,
  },
  messageWrapper: {
    marginVertical: 8,
  },
  senderNameStyle: {
    ...Typography.f_12_inter_regular,
    color: Colors.gray,
    marginBottom: 4,
    marginLeft: 10,
  },
  messageTimeStyle: {
    ...Typography.f_10_inter_regular,
    color: Colors.gray,
    marginTop: 2,
    marginRight: 5,
  },
  senderMessageStyle: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light_gray,
  },
  receiverMessageStyle: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
  },
  messageTextStyle: {
    ...Typography.f_15_inter_light,
  },
  senderTextStyle: {
    color: Colors.black,
  },
  receiverTextStyle: {
    color: Colors.white,
  },
  inputContainerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  inputStyle: {
    maxHeight: 100,
  },
  sendButtonStyle: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialAvatarText: {
    ...Typography.f_24_inter_bold,
    color: Colors.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;
