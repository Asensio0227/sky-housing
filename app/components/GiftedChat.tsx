import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Avatar,
  Bubble,
  InputToolbar,
  Message,
} from 'react-native-gifted-chat';
import { MD2Colors, MD3Colors } from 'react-native-paper';

export const renderBubble = (props: any) => (
  <Bubble
    {...props}
    textStyle={{ right: { color: MD2Colors.grey200 } }}
    wrapperStyle={{
      left: { backgroundColor: MD2Colors.white },
      right: { backgroundColor: MD3Colors.primary40 },
    }}
    // renderCustomView={renderCustomView}
  />
);

export const renderAvatar = (props: any) => <Avatar {...props} />;

export const renderCustomView = (props: any) => (
  <>
    {/* {props.currentMessage.isRead?(<Icon name="eye" size={30} color={MD2Colors.grey400} />):(<Icon name="eye-off" size={30} color={MD3Colors.primary40}/>)} */}
  </>
);

// export const renderCustomActions = (props) => {
//   const [recording, setRecording] = useState<Audio.Recording | null>(null);
//   const recordingRef = useRef<Audio.Recording | null>(null);

//   const startRecording = async () => {
//     try {
//       const permission = await Audio.requestPermissionsAsync();
//       if (!permission.granted) return;

//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );

//       recordingRef.current = recording;
//       setRecording(recording);
//     } catch (err) {
//       console.error('Failed to start recording:', err);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       if (!recordingRef.current) return;
//       await recordingRef.current.stopAndUnloadAsync();
//       const uri = recordingRef.current.getURI();

//       const audioMessage = {
//         _id: uuid.v4(),
//         createdAt: new Date(),
//         user: props.user,
//         audio: uri,
//       };

//       props.onSend([audioMessage]);
//       setRecording(null);
//     } catch (err) {
//       console.error('Failed to stop recording:', err);
//     }
//   };

//   return (
//     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//       <IconButton
//         icon={recording ? 'stop' : 'microphone'}
//         onPress={recording ? stopRecording : startRecording}
//         size={24}
//       />
//     </View>
//   );
// };

export const renderInputToolbar = (props: any) => (
  <InputToolbar
    {...props}
    containerStyle={{
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 2,
      borderRadius: 20,
      paddingTop: 5,
    }}
  />
);

export const renderMessage = (props: any) => (
  <Message
    {...props}
    textStyle={{ right: { color: MD3Colors.primary50 } }}
    wrapperStyle={{
      left: { backgroundColor: MD3Colors.primary100 },
      right: { backgroundColor: MD3Colors.primary20 },
    }}
    renderUser={{
      _id: props.currentMessage.user._id,
      name:
        `${props.currentMessage?.user.username}` ||
        props.currentMessage?.user.fName,
    }}
    user={props.user}
  />
);

export const renderSend = (props: any) => {
  const { text, user, onSend } = props;
  return (
    <TouchableOpacity
      style={{
        height: 50,
        width: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={() => {
        if (text && onSend) {
          onSend({ text: text.trim(), user, _id: user._id }, true);
        }
      }}
    >
      <Ionicons
        name='send'
        size={20}
        color={text ? MD3Colors.primary40 : MD3Colors.primary10}
      />
    </TouchableOpacity>
  );
};
