import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { format, formatDuration } from '../../utils/globals';
import { UserDocument } from '../form/FormInput';

type AudioRecorderProps = {
  senderUser: UserDocument | any;
  roomId: string;
  stopRecording: () => void;
  cancelRecording: () => void;
  recording: boolean;
  sendRecording: () => void;
  duration: number;
  loading: boolean;
  recordingUri: any;
};

const AudioRecorder = ({
  duration,
  stopRecording,
  cancelRecording,
  recording,
  sendRecording,
  loading,
  recordingUri,
}: AudioRecorderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      stopPlayback();
    }
  };

  const startPlayback = async () => {
    if (!recordingUri) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setIsPlaying(true);
      setPlaybackDuration(0);

      playbackIntervalRef.current = setInterval(() => {
        setPlaybackDuration((prev) => prev + 1);
      }, 1000);

      await sound.playAsync();
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const stopPlayback = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackDuration(0);
    if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  return (
    <>
      {loading ? (
        <ActivityIndicator size={'small'} />
      ) : (
        <View style={styles.container}>
          <Text style={{ flex: 1 }}>
            {recording
              ? `Recording... ${formatDuration(duration)}`
              : isPlaying
              ? `Playing... ${format(playbackDuration)}`
              : `Recorded: ${formatDuration(duration)}`}
          </Text>

          {recording ? (
            <IconButton icon='stop' onPress={stopRecording} />
          ) : isPlaying ? (
            <IconButton icon='pause' onPress={stopPlayback} />
          ) : (
            <>
              <IconButton icon='play' onPress={startPlayback} />
              <IconButton icon='send' onPress={sendRecording} />
              <IconButton icon='cancel' onPress={cancelRecording} />
            </>
          )}
        </View>
      )}
    </>
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
