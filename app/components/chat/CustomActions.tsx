import React from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomActions = ({
  recording,
  onMediaPick,
  onStartRecording,
  onStopRecording,
  ...props
}: any) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Actions
      {...props}
      options={{ ['Send Media']: onMediaPick }}
      icon={() => <Ionicons name='attach' size={24} color='gray' />}
    />
    <IconButton
      icon={recording ? 'stop' : 'microphone'}
      onPress={recording ? onStopRecording : onStartRecording}
      size={24}
    />
  </View>
);

export default CustomActions;
