import {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import Colors from '../../utilities/constants/colors';
import {useTranslation} from 'react-i18next';

import AppStatusBar from '../../components/AppStatusBar';
import Images from '../../assets/images';
import {Typography} from '../../utilities/constants/constant.style';
import {DEFAULT_LANGUAGE} from '../../utilities';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllChats,
  deleteChat,
  markMessagesAsSeen,
} from '../../redux/features/chat/chatThunks';
import { clearCurrentChat } from '../../redux/features/chat/chatSlice';
import {selectAllChats} from '../../redux/features/chat/chatSelectors';
import {selectAuthUserId} from '../../redux/features/auth/authSelectors';
import io from 'socket.io-client';
import {EnvConfig} from '../../config/envConfig';
import { RFValue } from 'react-native-responsive-fontsize';
import screenResolution from '../../utilities/constants/screenResolution';

// Multi-language translations
const translations = {
  en: {
    header: 'Chats',
    emptyTitle: 'No Chats Available',
    emptySubtitle: 'Your conversations will appear here',
    deleteConfirmation: 'Are you sure you want to delete this chat?',
    yes: 'Yes',
    no: 'No',
    unknown: 'Unknown',
  },
  ar: {
    header: 'المحادثات',
    emptyTitle: 'لا توجد محادثات متاحة',
    emptySubtitle: 'ستظهر محادثاتك هنا',
    deleteConfirmation: 'هل أنت متأكد أنك تريد حذف هذه المحادثة؟',
    yes: 'نعم',
    no: 'لا',
    unknown: 'غير معروف',
  },
  sp: {
    header: 'Chats',
    emptyTitle: 'No hay chats disponibles',
    emptySubtitle: 'Tus conversaciones aparecerán aquí',
    deleteConfirmation: '¿Estás seguro de que quieres eliminar este chat?',
    yes: 'Sí',
    no: 'No',
    unknown: 'Desconocido',
  },
};

const ChatItem = ({item, onPress, onDelete, hasUnreadMessages}) => {
  const firstLetter = item.owner[DEFAULT_LANGUAGE]?.charAt(0).toUpperCase();

  return (
    <View style={styles.chatItemWrapper}>
      <TouchableOpacity
        style={styles.chatItemContainer}
        onPress={onPress}
        activeOpacity={0.8}>
        <View style={styles.avatarContainer}>
          {firstLetter ? (
            <Text style={styles.avatarText}>{firstLetter}</Text>
          ) : (
            <Image source={Images.cycle} style={styles.avatarImage} />
          )}
          {hasUnreadMessages && <View style={styles.unreadBadge} />}
        </View>
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text
              style={[styles.ownerName, hasUnreadMessages && styles.boldText]}>
              {item.owner[DEFAULT_LANGUAGE]}
            </Text>
            <Text style={styles.timeStamp}>{item.time}</Text>
          </View>
          <View style={styles.chatDeletIcon}>
            <Text
              style={[
                styles.lastMessageText,
                hasUnreadMessages && styles.boldText,
              ]}
              numberOfLines={1}>
              {item.lastMessage[DEFAULT_LANGUAGE]}
            </Text>
            <TouchableOpacity style={styles.deleteIcon} onPress={onDelete}>
              <Image
                source={Images.delete}
                style={styles.deleteIconImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const EmptyChatsMessage = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.emptyChatsContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIconText}>💬</Text>
      </View>
      <Text style={styles.emptyChatsText}>
        {t('no_chats_available')}
      </Text>
      <Text style={styles.emptyChatsSubText}>
        {t('your_conversations_will_appear')}
      </Text>
    </View>
  );
};

export default function Messages({navigation}) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const Chats = useSelector(selectAllChats);
  const authUserId = useSelector(selectAuthUserId);
  const socket = useRef(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  // Local state to store chats
  const [localChats, setLocalChats] = useState([]);
  const {t, i18n} = useTranslation();

  const currentLanguage = i18n.language === 'sp' ? 'sp' : 'en';

  // Update local state when Redux store changes
  useEffect(() => {
    if (Chats && Chats.length > 0) {
      setLocalChats(Chats);
    }
  }, [Chats]);

  useEffect(() => {
    console.log('==== DEBUGGING INFO ====');
    console.log('Local Chats:', localChats.length);
    console.log('Redux Chats:', Chats.length);
    console.log('Unread Messages:', unreadMessages);
  }, [localChats, Chats, unreadMessages]);

  // Initialize socket connection
  useEffect(() => {
    // Connect to socket
    socket.current = io(EnvConfig.socket.url);

    // Register user with socket when component mounts
    if (authUserId) {
      socket.current.emit('new-user-add', authUserId);
      console.log('Connected to socket in Messages screen');
    }

    socket.current.on('receive-message', data => {
      console.log('==== NEW MESSAGE RECEIVED ====');
      // Only mark as unread if the user is not in the chat screen
      const isInChatScreen =
        navigation.getState().routes[navigation.getState().index].name ===
        'Chat';

      if (data.author !== authUserId && !isInChatScreen) {
        setUnreadMessages(prev => ({
          ...prev,
          [data.chatId]: true,
        }));

        // Update local chat state immediately
        setLocalChats(prevChats => {
          return prevChats.map(chat => {
            if (chat._id === data.chatId) {
              // Update the chat with new message and current time for updatedAt
              const updatedMessages = [
                ...(chat.messages || []),
                {
                  _id: Date.now().toString(), // Temporary ID for the new message
                  text: data.text,
                  authorId: data.author,
                  createdAt: new Date().toISOString(),
                },
              ];

              return {
                ...chat,
                messages: updatedMessages,
                updatedAt: new Date().toISOString(), // Ensure timestamp is updated
              };
            }
            return chat;
          });
        });
      }

      // Refresh the chat list in the background (re-fetch from Redux)
      setTimeout(() => {
        dispatch(getAllChats());
      }, 1000);
    });

    // Listen for active users list update
    socket.current.on('get-users', users => {
      console.log('Active users in Messages screen:', users);
    });

    // Cleanup on component unmount
    return () => {
      if (socket.current) {
        // socket.current.disconnect();
        console.log('Disconnected from socket in Messages screen');
      }
    };
  }, [authUserId]);

  // Fetch chats whenever the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getAllChats());
    });
    
    // Initial fetch
    dispatch(getAllChats());
    
    // Cleanup listener on unmount
    return unsubscribe;
  }, [navigation]);

  const handleDeletePress = chat => {
    setChatToDelete(chat);
    setIsModalVisible(true);
  };
  

  const handleDeleteChat = () => {
    if (chatToDelete) {
      console.log(`Deleted chat with id: ${chatToDelete._id}`);
      dispatch(deleteChat(chatToDelete._id))
        .then(() => {
          // Update local state immediately
          setLocalChats(prevChats =>
            prevChats.filter(chat => chat._id !== chatToDelete._id),
          );
          setIsModalVisible(false);
        })
        .catch(error => {
          console.error('Error deleting chat:', error);
          setIsModalVisible(false);
        });
    }
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  const handleChatPress = (chatId, secondUserId, recipientData) => {
    // Clear current chat state first
    dispatch(clearCurrentChat());
    
    // Mark messages as seen when opening a chat
    dispatch(markMessagesAsSeen(chatId));

    // Clear unread status for this chat
    setUnreadMessages(prev => ({
      ...prev,
      [chatId]: false,
    }));

    // Navigate to the chat screen with socket instance
    navigation.navigate('Chat', {
      secondUserId: secondUserId,
      reciepentData: recipientData,
      socketInstance: socket.current, // Pass the socket instance
      key: `chat-${secondUserId}` // Add unique key for each chat
    });
  };

  const renderItem = ({item}) => {
    if (!item.members || !Array.isArray(item.members)) {
      console.error('Invalid chat item:', item);
      return null;
    }
    // Find the second user safely
    const secondUser = item.members.find(
      member => member && member._id !== authUserId,
    );
    const secondUserId = secondUser ? secondUser._id : null;
    if (!secondUserId) {
      console.error('Could not find second user in chat:', item);
      return null;
    }
    const lastMessage =
      item.messages && item.messages.length > 0
        ? item.messages[item.messages.length - 1].text
        : '';
    const ownerName =
      item.members.find(member => member._id !== authUserId)?.firstName ||
      translations[DEFAULT_LANGUAGE]?.unknown;
    const time = item.updatedAt
      ? new Date(item.updatedAt).toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : 'N/A';

    // Check if this chat has unread messages
    const hasUnread = unreadMessages[item._id] || false;
     return (
      <ChatItem
        item={{
          ...item,
          lastMessage: {[DEFAULT_LANGUAGE]: lastMessage},
          owner: {[DEFAULT_LANGUAGE]: ownerName},
          time,
        }}
        hasUnreadMessages={hasUnread}
        onPress={() =>
          handleChatPress(
            item._id,
            secondUserId,
            item.members.find(member => member._id !== authUserId),
          )
        }
        onDelete={() => handleDeletePress(item)}
      />
    );
  };

  // Use localChats instead of Chats from Redux
  const sortedChats = [...localChats].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
  return (
    <View style={styles.safeAreaContainer}>
      <AppStatusBar />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {translations[DEFAULT_LANGUAGE]?.header}
        </Text>
      </View>
      <View style={styles.flatListContainer}>
        {sortedChats && sortedChats.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={sortedChats}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            // Add pull-to-refresh functionality
            refreshing={false}
            onRefresh={() => dispatch(getAllChats())}
          />
        ) : (
          <EmptyChatsMessage />
        )}
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelDelete}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {translations[currentLanguage]?.deleteConfirmation}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleDeleteChat}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>
                  {translations[currentLanguage]?.yes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelDelete}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>
                  {translations[currentLanguage]?.no}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    paddingHorizontal: 40,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 85,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: Colors.white,
    textAlign: 'center',
    ...Typography.f_20_inter_semi_bold,
    fontWeight: '600',
  },
  chatItemWrapper: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  chatItemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    position: 'relative',
  },
  avatarText: {
    fontSize: 30,
    color: Colors.white,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginRight: 10,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatDeletIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerName: {
    ...Typography.f_12_inter_regular,
    color: Colors.black,
  },
  boldText: {
    fontWeight: 'bold',
  },
  brandName: {
    ...Typography.f_18_inter_medium,
    color: Colors.black,
  },
  timeStamp: {
    ...Typography.f_12_inter_regular,
    color: Colors.black,
  },
  lastMessageText: {
    ...Typography.f_12_inter_regular,
    color: Colors.black,
    maxWidth: '80%',
  },
  deleteIcon: {
    // position: 'absolute',
    // right: 10,
    // top: 30,
    // padding: 15,
  },
  deleteIconImage: {
    width: 40,
    height: 40,
  },
  flatListContainer: {
    marginTop:Platform.OS === 'ios' ?RFValue(-50,screenResolution.screenHeight) : -50 ,
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    ...Typography.f_16_inter_regular,
    color: Colors.black,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 20,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  emptyChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIconText: {
    fontSize: 36,
  },
  emptyChatsText: {
    ...Typography.f_20_inter_semi_bold,
    color: Colors.black,
    marginBottom: 10,
  },
  emptyChatsSubText: {
    ...Typography.f_14_inter_regular,
    color: Colors.gray,
    textAlign: 'center',
  },
});
