// @refresh reset

import 'react-native-get-random-values';

import { Audio, Video } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import { Actions, GiftedChat, Message } from 'react-native-gifted-chat';
import { IconButton, MD3Colors } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootChatsState, RootState } from '../../../store';
import {
  renderBubble,
  renderInputToolbar,
  renderSend,
} from '../../components/GiftedChat';
import {
  createMsg,
  deleteMsg,
  retrieveMsg,
  updateMsg,
} from '../../features/chats/chatsSlice';
import { IPhoto } from '../../features/estate/types';
import { pickMedia } from '../../utils/globals';

const ChatScreen = ({ route }: { route: any }) => {
  const { room } = route.params;
  const roomId = room && room._id;
  const dispatch: any = useDispatch();
  const { messages, page, hasMore } = useSelector(
    (state: RootChatsState) => state.Chats
  );
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
  const chatRef = useRef<any>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const flatListRef = useRef<any>(null);
  const scrollOffsetRef = useRef<number | null>(null);

  const formatDuration = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    const distanceFromBottom = contentHeight - layoutHeight - offsetY;

    setShowScrollToBottom(distanceFromBottom > 100);

    scrollOffsetRef.current = offsetY;
  };

  useEffect(() => {
    dispatch(retrieveMsg({ roomId, page: 1 }));
  }, [roomId]);

  const onSend = useCallback(
    async (newMessages: any = []) => {
      const msg = newMessages[0];
      const messageData = {
        roomId,
        sender: msg.user._id,
        text: msg.text,
        createdAt: msg.createdAt,
        files: msg.files || [],
      };

      const result = await dispatch(createMsg(messageData));
      if (createMsg.fulfilled.match(result)) {
      }
    },
    [roomId, dispatch]
  );

  const formattedMessages = messages
    .filter((m) => m && typeof m === 'object')
    .slice()
    .reverse()
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

    if (currentMessage.audio) {
      return (
        <View style={{ padding: 10, maxWidth: 250 }}>
          {/* <AudioPlayer uri={currentMessage.audio} /> */}
          <IconButton
            icon='play'
            onPress={async () => {
              try {
                const { sound } = await Audio.Sound.createAsync({
                  uri: currentMessage.audio,
                });
                await sound.playAsync();
              } catch (err) {
                console.error('Failed to play audio:', err);
              }
            }}
          />
        </View>
      );
    }

    if (currentMessage.video) {
      return (
        <View style={{ padding: 10, maxWidth: 300 }}>
          {currentMessage.video?.map((uri: IPhoto | any, index: any) => (
            <Video
              key={uri._id}
              source={{ uri: uri.url }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              // resizeMode='contain'
              useNativeControls
              style={{ width: 250, height: 150, borderRadius: 10 }}
            />
          ))}
        </View>
      );
    }

    const { key, ...rest } = props;
    return <Message key={key} {...rest} />;
  };

  const handleLongPress = (context: any, message: any) => {
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
    // if (file) {
    //   const fileType = file.type?.split('/')[0]; // 'image', 'audio', or 'video'
    //   const mediaKey =
    //     fileType === 'image'
    //       ? 'photo'
    //       : fileType === 'audio'
    //       ? 'audio'
    //       : fileType === 'video'
    //       ? 'video'
    //       : null;

    //   if (!mediaKey) {
    //     console.warn('Unsupported media type');
    //     return;
    //   }

    //   const messagePayload: any = {
    //     roomId,
    //     sender: currentUserId,
    //     text: '',
    //     [mediaKey]: [file],
    //   };

    //   dispatch(createMsg(messagePayload));
    // }
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

  const renderCustomActions = (props: any) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Actions
        {...props}
        options={{
          ['Send Media']: handleMediaPick,
        }}
        icon={() => <Ionicons name='attach' size={24} color='gray' />}
      />

      <IconButton
        icon={recording ? 'stop' : 'microphone'}
        onPress={recording ? stopRecording : startRecording}
        size={24}
      />
    </View>
  );

  const loadEarlierMessages = async () => {
    if (!hasMore) return;
    setIsLoadingEarlier(true);
    await dispatch(retrieveMsg({ roomId, page: page + 1 }));
    setIsLoadingEarlier(false);
    setTimeout(() => {
      if (chatRef.current?._messageContainerRef?.scrollToEnd) {
        chatRef.current._messageContainerRef.scrollToEnd({ animated: true });
      }
    }, 300);
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        ref={chatRef}
        messages={formattedMessages}
        onSend={(msgs) => onSend(msgs)}
        user={senderUser}
        loadEarlier={hasMore}
        alwaysShowSend
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onLoadEarlier={loadEarlierMessages}
        listViewProps={{
          ref: flatListRef,
          onContentSizeChange: (w: any, h: any) => {
            if (scrollOffsetRef.current !== null && flatListRef.current) {
              flatListRef.current.scrollToOffset({
                offset: h - scrollOffsetRef.current,
                animated: false,
              });
            }
          },
          onScroll: handleScroll,
          scrollEventThrottle: 16,
        }}
        isLoadingEarlier={isLoadingEarlier}
        renderActions={renderCustomActions}
        renderMessage={renderMessage}
        onLongPress={(context, message) => handleLongPress(context, message)}
        renderAvatar={null}
        disableComposer={!!recording}
        renderSend={renderSend}
      />
      {showScrollToBottom && (
        <IconButton
          icon='arrow-down'
          size={28}
          style={{
            position: 'absolute',
            right: 16,
            bottom: 36,
            alignItems: 'center',
            backgroundColor: MD3Colors.primary40,
            elevation: 4,
            borderRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
          }}
          onPress={() => {
            if (chatRef.current?._messageContainerRef?.scrollToEnd) {
              chatRef.current._messageContainerRef.scrollToEnd({
                animated: true,
              });
            }
          }}
        />
      )}

      <Modal visible={previewVisible} transparent animationType='slide'>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{ backgroundColor: 'white', borderRadius: 16, padding: 20 }}
          >
            {pendingMedia?.uri && (
              <Image
                source={{ uri: pendingMedia.uri }}
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              />
            )}
            <TextInput
              value={pendingText}
              onChangeText={setPendingText}
              placeholder='Add a message...'
              style={{
                borderColor: 'lightgray',
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
              }}
            />
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Button title='Cancel' onPress={() => setPreviewVisible(false)} />
              <Button
                title='Send'
                onPress={() => {
                  const fileType = pendingMedia.type?.split('/')[0];
                  const mediaKey =
                    fileType === 'image'
                      ? 'photo'
                      : fileType === 'audio'
                      ? 'audio'
                      : fileType === 'video'
                      ? 'video'
                      : null;

                  if (!mediaKey) {
                    console.warn('Unsupported media type');
                    return;
                  }

                  const messagePayload = {
                    roomId,
                    sender: senderUser._id,
                    text: pendingText,
                    [mediaKey]: [pendingMedia],
                  };

                  dispatch(createMsg(messagePayload));
                  setPreviewVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      {(recording || recordingUri) && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#f0f0f0',
            borderTopWidth: 1,
            borderColor: '#ccc',
          }}
        >
          <Text style={{ flex: 1 }}>
            {recording
              ? `Recording... ${formatDuration(recordingDuration)}`
              : `Recorded: ${formatDuration(recordingDuration)}`}
          </Text>

          {recording ? (
            <IconButton icon='stop' onPress={stopRecording} />
          ) : (
            <>
              <IconButton icon='send' onPress={sendRecording} />
              <IconButton icon='trash' onPress={cancelRecording} />
            </>
          )}
        </View>
      )}
      {Platform.OS === 'android' && (
        <KeyboardAvoidingView
          behavior={Platform.OS !== 'android' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS !== 'android' ? -64 : 0}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
