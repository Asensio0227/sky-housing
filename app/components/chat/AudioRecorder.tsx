import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { formatDuration } from '../../utils/globals';
import { UserDocument } from '../form/FormInput';

type AudioRecorderProps = {
  senderUser: UserDocument | any;
  roomId: string;
  stopRecording: () => void;
  cancelRecording: () => void;
  recording: boolean;
  sendRecording: () => void;
  duration: number;
};

const AudioRecorder = ({
  duration,
  stopRecording,
  cancelRecording,
  recording,
  sendRecording,
}: AudioRecorderProps) => {
  return (
    <View style={styles.container}>
      <Text style={{ flex: 1 }}>
        {recording
          ? `Recording... ${formatDuration(duration)}`
          : `Recorded: ${formatDuration(duration)}`}
      </Text>

      {recording ? (
        <IconButton icon='stop' onPress={() => stopRecording()} />
      ) : (
        <>
          <IconButton icon='send' onPress={() => sendRecording} />
          <IconButton icon='cancel' onPress={() => cancelRecording} />
        </>
      )}
    </View>
  );
};

export default AudioRecorder;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  recordingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timer: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    padding: 10,
  },
});
