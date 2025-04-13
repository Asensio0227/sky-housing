import { Video } from 'expo-av';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { Message } from 'react-native-gifted-chat';
import AudioPlayer from '../AudioPlayer';
import { styles } from './ChatStyles';
const CustomMessage: React.FC<any> = ({ props, senderId }) => {
  const { currentMessage } = props;
  const isSender = currentMessage.user._id === senderId;
  const alignStyle = isSender ? styles.rightMessage : styles.leftMessage;

  const renderText = () =>
    currentMessage.text ? (
      <Text style={alignStyle}>{currentMessage.text}</Text>
    ) : null;

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
        {videoArray.map((vid: any, i: number) => (
          <Video
            key={vid._id || i}
            source={{ uri: vid.url }}
            rate={1.0}
            volume={1.0}
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
        {photoList.map((img: any, idx: number) => (
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

export default CustomMessage;
