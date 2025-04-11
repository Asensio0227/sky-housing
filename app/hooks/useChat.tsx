import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootChatsState, RootState } from '../../store';
import {
  createConversation,
  createMsg,
  retrieveMsg,
  updateConversation,
  updateMsg,
} from '../features/chats/chatsSlice';

export const useChat = () => {
  const { messages, hasMore, isLoading } = useSelector(
    (store: RootChatsState) => store.Chats
  );
  const route: any = useRoute();
  const dispatch: any = useDispatch();
  // const { user: senderUser } = useSelector((store: RootState) => store.AUTH);
  // const { user: userB, room } = route.params;
  // const roomId = room ? room.id : uuidRef.current;
  // const _id = room?._id;
  const roomId: any = useRef('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSelectedImageView] = useState('');
  const { user: senderUser } = useSelector((store: RootState) => store.AUTH);
  const { user: userB, room } = route.params;
  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!room) {
          const currentUser: any = senderUser
            ? {
                username: senderUser.username || senderUser.fName,
                _id: senderUser.userId || senderUser._id,
                email: senderUser.email,
                expoToken: senderUser.expoToken,
              }
            : null;
          if (senderUser?.avatar) {
            currentUser.avatar = senderUser?.avatar;
          }
          const userBData: {
            _id?: string;
            username?: string;
            email?: string;
            expoToken?: string;
            avatar?: string;
          } = {
            _id: userB._id,
            username: `${userB.username} `,
            email: userB.email,
            expoToken: userB.expoToken,
          };
          if (userB.avatar) {
            userBData.avatar = userB.avatar;
          }
          const roomData = {
            participants: [currentUser, userBData],
            participantsArray: [senderUser?.email, userB.email],
          };
          try {
            const resp = await dispatch(createConversation(roomData));
            roomId.current = resp.payload.room._id;
          } catch (error: any) {
            console.log(error || 'Error occurred!');
          }
        }
      })();
    }, [senderUser, userB])
  );

  const fetchMessages = async () => {
    const id = _id || roomId.current;
    return await dispatch(retrieveMsg(id));
  };

  const loadMoreMessages = async () => {
    if (!isLoading && hasMore) {
      await fetchMessages();
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const id = _id || roomId.current;
          const resp = await fetchMessages();
          const messages = resp.payload.messages;
          // let lastMessage = messages.length > 0 && messages.slice(0)[0];
          let lastMessage = messages.length > 0 ? messages[0] : null;
          const data = { id, lastMessage };
          id &&
            messages.length > 0 &&
            (await dispatch(updateConversation(data)));
          id && (await dispatch(updateMsg(id)));
        } catch (error) {
          console.error('Failed to retrieve messages:', error);
        }
      };
      fetchData();
      // const intervalId = setInterval(fetchData, 5000);

      // return () => clearInterval(intervalId);
      // }, [dispatch])
    }, [dispatch, roomId, _id])
  );

  const onSend = async (messages: []) => {
    try {
      const id = _id || roomId.current;
      const writes: any = messages.map((msg) => {
        const message = { text: msg, roomId: id };
        writes.push(dispatch(createMsg(message)));
        // const arr: any = {
        //   userId: userB._id,
        //   message: msg,
        // };
        // sendNotifications(arr);
      });
      // console.log(`===message===`);
      // console.log(message);
      // console.log(`===message===`);
      // let lastMessage = messages.length > 0 && messages.slice(0)[0];
      let lastMessage = messages.length > 0 ? messages[0] : null;
      const data: any = { id, lastMessage };
      writes.push(dispatch(updateConversation(data)));
      writes.push(fetchMessages());
      await Promise.all(writes);
    } catch (error) {
      console.error('Failed to retrieve messages:', error);
    }
  };

  const handlePressPicker = async () => {
    // const result: any = await selectImage();
    const fileUri: any = result.assets[0].uri;
    if (!result.cancelled) await sendMedia(fileUri);
  };

  const sendMedia = async (asset: any) => {
    const message = {
      type: asset.type.includes('video') ? 'video' : 'image',
      uri: asset.uri,
      name: asset.fileName || 'attachment',
    };
  };

  return {
    onSend,
    senderUser,
    fetchMessages,
    handlePressPicker,
    setSelectedImageView,
    setModalVisible,
    modalVisible,
    loadMoreMessages,
    selectedImageView,
    messages,
  };
};
