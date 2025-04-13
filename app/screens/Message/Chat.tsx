// // @refresh reset

import 'react-native-get-random-values';

import { useFocusEffect } from '@react-navigation/native';
import { Audio, Video } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { GiftedChat, Message } from 'react-native-gifted-chat';
import { ActivityIndicator, MD2Colors, MD3Colors } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootChatsState, RootState } from '../../../store';
import AudioPlayer from '../../components/AudioPlayer';
import AudioRecorder from '../../components/chat/AudioRecorder';
import CustomActions from '../../components/chat/CustomActions';
import MediaPreviewModal from '../../components/chat/MediaPreviewModal';
import {
  renderBubble,
  renderInputToolbar,
  renderSend,
} from '../../components/GiftedChat';
import {
  createMsg,
  deleteMsg,
  replaceMessages,
  retrieveMsg,
  setLastMessage,
  updateConversation,
  updateMsg,
} from '../../features/chats/chatsSlice';
import { IPhoto } from '../../features/estate/types';
import { formatTimestamp, pickMedia } from '../../utils/globals';

const ChatScreen = ({ route }: { route: any }) => {
  const { room, user: userB } = route.params;
  const roomId = room && room._id;
  const dispatch: any = useDispatch();
  const { lastMessage } = useSelector((state: RootChatsState) => state.Chats);
  const [messages, setMessages] = useState<any[]>([]);
  const [localPage, setLocalPage] = useState(1);
  const [hasMore, setHasMoreMessages] = useState(true);

  const [firstLoad, setFirstLoad] = useState(true);
  const [isMounted, setIsMounted] = useState(true);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const { user } = useSelector((store: RootState) => store.AUTH);
  const senderUser = user && {
    name: user.username || user.fName,
    _id: user.userId || user._id,
    avatar: user.avatar,
  };
  const [previewVisible, setPreviewVisible] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<any>(null);
  const [pendingText, setPendingText] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const flatListRef = useRef<any>(null);
  const contentHeightRef = useRef(0);
  const listHeightRef = useRef(0);
  const scrollOffsetRef = useRef<number | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const [sendingMedia, setSendingMedia] = useState(false);
  const [audioPreviewVisible, setAudioPreviewVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const scrollToBottom = () => {
    if (
      flatListRef.current &&
      contentHeightRef.current &&
      listHeightRef.current
    ) {
      flatListRef.current.scrollToOffset({
        offset: contentHeightRef.current - listHeightRef.current,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    const distanceFromBottom = contentHeight - layoutHeight - offsetY;

    setShowScrollToBottom(distanceFromBottom > 100);

    scrollOffsetRef.current = offsetY;
  };

  const fetchData = async () => {
    try {
      if (firstLoad && isMounted) {
        setInitialLoading(true);
      }

      const resp = await dispatch(retrieveMsg({ roomId, page: localPage }));
      const newMessages = resp?.payload?.messages || [];
      console.log(`===newMessages===`);
      console.log(newMessages);
      console.log(`===newMessages===`);

      if (newMessages.length === 0) {
        setHasMoreMessages(false);
        return;
      }

      setMessages((prev) =>
        localPage === 1 ? newMessages : [...prev, ...newMessages]
      );

      const newLastMessage =
        newMessages.length > 0 ? newMessages[newMessages.length - 1] : null;

      if (localPage === 1 && newLastMessage) {
        lastMessageIdRef.current = newLastMessage._id;

        const data = { id: roomId, lastMessage: newLastMessage };
        dispatch(updateConversation(data));
        dispatch(updateMsg(roomId));
        dispatch(setLastMessage(newLastMessage));
      }

      if (localPage === 1) {
        dispatch(replaceMessages(newMessages));
      }
    } catch (error) {
      console.error('Failed to retrieve messages:', error);
    } finally {
      if (firstLoad && isMounted) {
        setInitialLoading(false);
        setFirstLoad(false);
      }
    }
  };

  console.log(`========`);
  console.log(messages);
  console.log(`========`);

  useFocusEffect(
    useCallback(() => {
      if (!active) return;

      if (isMounted) {
        fetchData();
      }

      const intervalId = setInterval(fetchData, 5000);
      return () => {
        setIsMounted(false);
        clearInterval(intervalId);
      };
    }, [roomId, isMounted])
  );

  useEffect(() => {
    if (!lastMessage || !active) return;

    const refetch = async () => {
      try {
        const resp = await dispatch(retrieveMsg({ roomId, page: 1 }));
        const messages = resp?.payload?.messages || [];

        const updatedLastMessage =
          messages.length > 0 ? messages[messages.length - 1] : null;

        if (
          updatedLastMessage &&
          updatedLastMessage._id !== lastMessageIdRef.current
        ) {
          lastMessageIdRef.current = updatedLastMessage._id;

          const data = { id: roomId, lastMessage: updatedLastMessage };
          dispatch(updateConversation(data));
          dispatch(updateMsg(roomId));
          dispatch(setLastMessage(updatedLastMessage));
        }
      } catch (err) {
        console.error('Refetch on lastMessage change failed:', err);
      }
    };

    refetch();
  }, [lastMessage?._id, active]);

  useFocusEffect(
    useCallback(() => {
      setActive(true);
      return () => setActive(false);
    }, [])
  );

  const onSend = useCallback(
    async (newMessages: any = []) => {
      const writes = newMessages.map((msg: any) => {
        const messageData = { ...msg, roomId };
        dispatch(createMsg(messageData));
        const arr: any = {
          userId: userB._id,
          message: msg.text,
        };
        // sendNotifications(arr);
      });
      const lastMessage =
        newMessages.length > 0 ? newMessages[newMessages.length - 1] : null;
      if (lastMessage) {
        const data: any = { id: roomId, lastMessage };
        writes.push(dispatch(updateConversation(data)));
      }
      writes.push(dispatch(retrieveMsg({ roomId, page: 1 })));
      await Promise.all(writes);
    },
    [roomId, dispatch]
  );

  const formattedMessages = messages
    .filter((m) => m && typeof m === 'object')
    .slice()
    .map((msg) => {
      const { photo, audio, video, _id, text, createdAt, user } = msg;

      const media = {
        ...(photo?.[0] && { image: photo[0] }),
        ...(audio?.[0] && { audio: audio[0] }),
        ...(video?.[0] && { video: video[0] }),
      };

      return {
        _id,
        text: text || '',
        createdAt: new Date(createdAt),
        user: user,
        ...media,
      };
    });

  const renderMessage = (props: any) => {
    const { currentMessage } = props;
    const isSender = currentMessage.user._id === senderUser._id;
    const alignStyle = isSender ? styles.rightMessage : styles.leftMessage;

    const renderText = () => {
      if (currentMessage.text) {
        return <Text style={alignStyle}>{currentMessage.text}</Text>;
      }
      return (
        <Text
          style={[
            alignStyle,
            {
              fontSize: 12,
              marginTop: 4,
              alignSelf: 'flex-end',
            },
          ]}
        >
          {formatTimestamp(currentMessage.createdAt)}
        </Text>
      );
    };

    if (currentMessage.audio) {
      return (
        <View style={[alignStyle, { padding: 10, maxWidth: 250 }]}>
          <AudioPlayer uri={currentMessage.audio.url} />
          {/* <IconButton
            icon='play'
            onPress={async () => {
              try {
                const { sound } = await Audio.Sound.createAsync({
                  uri: currentMessage.audio.url,
                });
                await sound.playAsync();
              } catch (err) {
                console.error('Failed to play audio:', err);
              }
            }}
          /> */}
          {renderText()}
        </View>
      );
    }

    if (Array.isArray(currentMessage.video)) {
      const videoArray = Array.isArray(currentMessage.video)
        ? currentMessage.video
        : currentMessage.video
        ? [currentMessage.video]
        : [];
      return (
        <View style={[alignStyle, { padding: 10, maxWidth: 300 }]}>
          {videoArray.map((uri: IPhoto | any, index: any) => (
            <Video
              key={uri._id || index}
              source={{ uri: uri.url }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              useNativeControls
              style={{ width: 250, height: 150, borderRadius: 10 }}
            />
          ))}
          {renderText()}
        </View>
      );
    }

    if (currentMessage.image || currentMessage.photo) {
      const photoList = Array.isArray(
        currentMessage.image || currentMessage.photo
      )
        ? currentMessage.image || currentMessage.photo
        : [currentMessage.image || currentMessage.photo];

      return (
        <View style={[alignStyle, { padding: 10 }]}>
          {photoList.map((img: any, idx: any) => (
            <Image
              key={img._id || idx}
              source={{ uri: img.url || img.uri }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 12,
                marginBottom: 8,
              }}
              resizeMode='cover'
            />
          ))}
          {renderText()}
        </View>
      );
    }

    const { key, ...rest } = props;
    return <Message key={key} {...rest} />;
  };

  const handleLongPress = (context: any, message: any) => {
    if (Platform.OS !== 'ios') return;
    const options = ['Edit', 'Delete', 'Forward', 'Cancel'];
    const cancelButtonIndex = 4;

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: 2,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          // case 0:
          //   Clipboard.setString(message.text || '');
          //   break;

          case 0:
            Alert.prompt(
              'Edit Message',
              'Update your message:',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Save',
                  onPress: (text) => {
                    if (text && text !== message.text) {
                      dispatch(updateMsg({ ...message, text }));
                    }
                  },
                },
              ],
              'plain-text',
              message.text
            );
            break;

          case 1:
            dispatch(deleteMsg(message._id));
            break;

          case 2:
            Alert.alert('Forward', 'Coming soon!');
            break;

          default:
            break;
        }
      }
    );
  };

  const handleMediaPick = async () => {
    const file = await pickMedia();
    if (file) {
      setPendingMedia(file);
      setPendingText('');
      setPreviewVisible(true);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      Vibration.vibrate(50);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setRecording(recording);
      setRecordingUri(null);
      setRecordingDuration(0);

      recordingIntervalRef.current = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.isRecording) {
          setRecordingDuration(status.durationMillis || 0);
        }
      }, 500);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;
      Vibration.vibrate(100);
      clearInterval(recordingIntervalRef.current!);
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      setRecording(null);
      setAudioPreviewVisible(true);
      setRecordingUri(uri || null);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  const sendRecording = async () => {
    if (!recordingUri) return;
    const audioFile = {
      uri: recordingUri,
      name: `audio-${Date.now()}.m4a`,
      type: 'audio/m4a',
    };

    const messagePayload = {
      roomId,
      sender: senderUser._id,
      text: '',
      audio: [audioFile],
    };

    await dispatch(createMsg(messagePayload));

    setRecordingUri(null);
    setRecordingDuration(0);
  };

  const cancelRecording = () => {
    setRecording(null);
    setRecordingUri(null);
    setRecordingDuration(0);
    clearInterval(recordingIntervalRef.current!);
  };

  const renderFooter = () => {
    if (!sendingMedia) return null;

    return (
      <View style={{ padding: 10, alignItems: 'center' }}>
        <ActivityIndicator size='small' />
        <Text style={{ fontSize: 12, marginTop: 4 }}>Sending media...</Text>
      </View>
    );
  };

  const renderCustomActions = (props: any) => (
    <CustomActions
      {...props}
      recording={recording}
      onMediaPick={handleMediaPick}
      onStartRecording={startRecording}
      onStopRecording={stopRecording}
    />
  );

  const loadEarlierMessages = async () => {
    if (!hasMore) return;
    setIsLoadingEarlier(true);
    await dispatch(retrieveMsg({ roomId, page: localPage + 1 }));
    setIsLoadingEarlier(false);
    setTimeout(() => {
      if (flatListRef.current?.current?._messageContainerRef?.scrollToEnd) {
        flatListRef.current?.current._messageContainerRef.scrollToEnd({
          animated: true,
        });
      }
    }, 300);
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const hideMediaPreview = () => setPreviewVisible(false);

  return (
    <>
      {initialLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size='large' />
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 90}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1 }}>
              <GiftedChat
                messages={formattedMessages}
                textInputProps={{ multiline: true }}
                onSend={(msgs) => onSend(msgs)}
                user={senderUser}
                loadEarlier={hasMore}
                alwaysShowSend
                renderBubble={renderBubble}
                renderInputToolbar={(props) =>
                  recording ? null : renderInputToolbar(props)
                }
                onLoadEarlier={loadEarlierMessages}
                listViewProps={{
                  ref: flatListRef,
                  onContentSizeChange: (w: any, h: any) => {
                    if (
                      scrollOffsetRef.current !== null &&
                      flatListRef.current
                    ) {
                      flatListRef.current.scrollToOffset({
                        offset: h - scrollOffsetRef.current,
                        animated: false,
                      });
                    }
                  },
                  onLayout: (event: any) => {
                    listHeightRef.current = event.nativeEvent.layout.height;
                  },
                  onScroll: handleScroll,
                  scrollEventThrottle: 16,
                  keyboardShouldPersistTaps: 'handled', // <- Important for dismissing keyboard
                }}
                isLoadingEarlier={isLoadingEarlier}
                renderActions={renderCustomActions}
                renderMessage={renderMessage}
                onLongPress={(context, message) =>
                  handleLongPress(context, message)
                }
                renderAvatar={null}
                disableComposer={!!recording}
                renderSend={renderSend}
                renderFooter={renderFooter}
              />
            </View>
          </KeyboardAvoidingView>
          {(recording || recordingUri) && (
            <AudioRecorder
              duration={recordingDuration}
              stopRecording={stopRecording}
              cancelRecording={cancelRecording}
              sendRecording={sendRecording}
              recording={recording}
              senderUser={senderUser}
              roomId={roomId}
            />
          )}
          <MediaPreviewModal
            pendingText={pendingText}
            setPendingText={setPendingText}
            visible={previewVisible}
            media={pendingMedia}
            onClose={hideMediaPreview}
            roomId={roomId}
            senderUser={senderUser}
          />
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rightMessage: {
    alignSelf: 'flex-end',
    backgroundColor: MD3Colors.primary40,
    padding: 8,
    borderRadius: 10,
    margin: 4,
    maxWidth: '80%',
    color: MD2Colors.grey200,
  },
  leftMessage: {
    alignSelf: 'flex-start',
    backgroundColor: MD3Colors.primary70,
    padding: 8,
    borderRadius: 10,
    margin: 4,
    maxWidth: '80%',
    color: MD2Colors.white,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  caption: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
});

export default ChatScreen;

//   const fetchData = useCallback(async () => {
//     try {
//       if (firstLoad) {
//         setInitialLoading(true);
//       }

//       // dispatch(clearMessages());
//       const resp = await dispatch(retrieveMsg({ roomId, page: 1 }));
//       const newMessages = resp?.payload?.messages || [];

//       const newLastMessage =
//         newMessages.length > 0 ? newMessages[newMessages.length - 1] : null;

//       if (newLastMessage && newLastMessage._id !== lastMessageIdRef.current) {
//         lastMessageIdRef.current = newLastMessage._id;

//         const data = { id: roomId, lastMessage: newLastMessage };
//         dispatch(updateConversation(data));
//         dispatch(updateMsg(roomId));
//         dispatch(setLastMessage(newLastMessage));
//         dispatch(replaceMessages(newMessages));
//       } else if (firstLoad) {
//         dispatch(clearMessages());
//         dispatch(replaceMessages(newMessages));
//       } else {
//         const newMessagesSet = new Set(newMessages.map((msg: any) => msg._id));
//         const currentMessagesSet = new Set(messages.map((msg) => msg._id));

//         if (
//           newMessagesSet.size !== currentMessagesSet.size ||
//           [...newMessagesSet].some((id: any) => !currentMessagesSet.has(id))
//         ) {
//           dispatch(replaceMessages(newMessages));
//         }
//       }
//     } catch (error) {
//       console.error('Failed to retrieve messages:', error);
//     } finally {
//       if (firstLoad) {
//         setInitialLoading(false);
//         setFirstLoad(false);
//       }
//     }
//   }, [dispatch, roomId, messages, firstLoad]);

//   const debouncedFetchData = useMemo(
//     () => debounce(fetchData, 2000),
//     [fetchData]
//   );

//   useFocusEffect(
//     useCallback(() => {
//       if (!active) return;

//       debouncedFetchData();

//       const intervalId = setInterval(debouncedFetchData, 5000);
//       return () => {
//         clearInterval(intervalId);
//       };
//     }, [roomId, active])
//   );

//   useEffect(() => {
//     if (!lastMessage) return;

//     debouncedFetchData();
//   }, [lastMessage?._id]);

//   const loadEarlierMessages = async () => {
//     if (!hasMore) return;
//     setIsLoadingEarlier(true);
//     await dispatch(retrieveMsg({ roomId, page: page + 1 }));
//     setIsLoadingEarlier(false);
//     setTimeout(() => {
//       if (flatListRef.current?.current?._messageContainerRef?.scrollToEnd) {
//         flatListRef.current?.current._messageContainerRef.scrollToEnd({
//           animated: true,
//         });
//       }
//     }, 300);
//   };
