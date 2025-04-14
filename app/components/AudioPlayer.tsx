import { Ionicons } from '@expo/vector-icons';

import { Audio, AVPlaybackStatusSuccess } from 'expo-av';

import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MD3Colors } from 'react-native-paper';

import { formatDuration } from '../utils/globals';

type Props = {
  uri: string;
};

const AudioPlayer = ({ uri }: Props) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [duration, setDuration] = useState(0);

  const [position, setPosition] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [isSeeking, setIsSeeking] = useState(false);

  const [timerPosition, setTimerPosition] = useState(0);

  const loadSound = async () => {
    setIsLoading(true);

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },

        { shouldPlay: false },

        onPlaybackStatusUpdate
      );

      const status = await newSound.getStatusAsync();

      setSound(newSound);

      const successStatus = status as AVPlaybackStatusSuccess;

      setDuration(successStatus.durationMillis || 0);

      setPosition(successStatus.positionMillis || 0);
    } catch (error) {
      console.error('Error loading sound:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;

    if (status.isPlaying && !isSeeking) {
      setPosition(status.positionMillis);
    }

    if (status.didJustFinish) {
      setIsPlaying(false);

      setPosition(0);

      setIsSeeking(false); // Reset isSeeking on finish
    }
  };

  const playPause = async () => {
    if (!sound) return;

    const status = await sound.getStatusAsync();

    if (status.isPlaying) {
      await sound.pauseAsync();

      setIsPlaying(false);
    } else {
      if (status.didJustFinish) {
        await sound.setPositionAsync(0); // Ensure sound object is at the beginning
      }

      await sound.playAsync();

      setIsPlaying(true);
    }
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();

      await sound.unloadAsync();

      setSound(null);
    }

    setIsPlaying(false);

    setPosition(0);
  };

  const seek = async (val: number) => {
    if (!sound) return;

    try {
      await sound.setPositionAsync(val);

      setPosition(val);
    } catch (error) {
      console.error('Error seeking:', error);
    } finally {
      setIsSeeking(false);
    }
  };

  const skip = async (ms: number) => {
    if (!sound) return;

    const newPos = Math.min(Math.max(position + ms, 0), duration);

    try {
      await sound.setPositionAsync(newPos);

      setPosition(newPos);
    } catch (error) {
      console.error('Error skipping:', error);
    }
  };

  const handleSliderTouchStart = async () => {
    setIsSeeking(true);

    if (isPlaying && sound) {
      await sound.pauseAsync();
    }
  };

  const handleSliderTouchEnd = async (newPosition: number) => {
    setIsSeeking(false);

    if (sound) {
      try {
        await sound.setPositionAsync(newPosition);

        setPosition(newPosition);

        if (isPlaying) {
          await sound.playAsync();
        }
      } catch (error) {
        console.error('Error setting position after slider:', error);
      }
    }
  };

  useEffect(() => {
    setTimerPosition(position);
  }, [position]);

  useEffect(() => {
    loadSound();

    return () => {
      stopPlayback();
    };
  }, [uri]);

  return (
    <View
      style={{
        padding: 12,

        backgroundColor: MD3Colors.primary60,

        borderRadius: 12,
      }}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => skip(-10000)}>
              <Ionicons name='play-back' size={24} color='black' />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={playPause}
              style={{ marginHorizontal: 12 }}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color='black'
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => skip(10000)}>
              <Ionicons name='play-forward' size={24} color='black' />
            </TouchableOpacity>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,

                {
                  width:
                    duration > 0 ? `${(position / duration) * 100}%` : '0%',
                },
              ]}
            />
          </View>

          <Text style={{ alignSelf: 'center' }}>
            {formatDuration(timerPosition)} / {formatDuration(duration)}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    width: '100%',

    height: 3,

    backgroundColor: '#ccc',

    borderRadius: 1.5,

    marginTop: 4,

    overflow: 'hidden',
  },

  progressBar: {
    backgroundColor: 'black',

    height: 3,

    borderRadius: 1.5,
  },
});

export default AudioPlayer;
