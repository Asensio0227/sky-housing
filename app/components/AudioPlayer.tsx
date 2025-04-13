import { Ionicons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { MD3Colors } from 'react-native-paper';
import { formatDuration } from '../utils/globals';

const AudioPlayer = ({ uri }: { uri: string }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);

  const loadAndPlay = async () => {
    try {
      setLoading(true);
      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      function isStatusSuccess(
        status: AVPlaybackStatus
      ): status is AVPlaybackStatusSuccess {
        return status.isLoaded;
      }
      setSound(sound);
      if (isStatusSuccess(status)) {
        setDurationMillis(status.durationMillis || 0);
      }
      setIsPlaying(true);
      setLoading(false);

      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (!status.isPlaying && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.log('Error loading audio', err);
      setLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;

    if (status.didJustFinish) {
      stopSound();
    } else {
      setPositionMillis(status.positionMillis);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setIsPlaying(false);
      setPositionMillis(0);
    }
  };

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={isPlaying ? stopSound : loadAndPlay}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: MD3Colors.primary60,
        borderRadius: 10,
      }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color='black'
          />
          <Text style={{ marginLeft: 8 }}>
            {isPlaying
              ? `${formatDuration(positionMillis)} / ${formatDuration(
                  durationMillis
                )}`
              : 'Play Audio'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default AudioPlayer;
