import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { MD3Colors } from 'react-native-paper';
import { AudioManager } from '../utils/AudioManager';
import { formatDuration } from '../utils/globals';

const AudioPlayer = ({ uri }: { uri: string }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const loadAndPlay = async () => {
    try {
      const current = AudioManager.getCurrent();
      if (current) {
        const status = await current.getStatusAsync();
        if (status.isLoaded && status.uri === uri) {
          console.log('Same audio already loaded');
          return;
        }
      }

      setLoading(true);

      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(sound);

      if (status.isLoaded) {
        setDurationMillis(status.durationMillis || 0);
      }

      await AudioManager.play(sound);

      if (AudioManager.getCurrent() !== sound) {
        console.warn('Sound was replaced before playback finished');
        return;
      }

      startTimer();
      setIsPlaying(true);
      setLoading(false);
    } catch (err) {
      console.log('Error loading audio', err);
      setLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    if (status.didJustFinish) {
      stopSound();
    } else {
      if (status.isPlaying && !isSeeking) {
        setPositionMillis(status.positionMillis);
      }
    }
  };

  const stopSound = async () => {
    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (err) {
        console.warn('Error stopping/unloading sound:', err);
      }

      clearInterval(intervalRef.current!);
      setIsPlaying(false);
      setPositionMillis(0);

      if (AudioManager.getCurrent() === sound) {
        await AudioManager.stopCurrent();
      }

      setSound(null);
    }
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      await sound?.pauseAsync();
      clearInterval(intervalRef.current!);
      setIsPlaying(false);
    } else {
      if (sound) {
        await sound.playAsync();
        startTimer();
        setIsPlaying(true);
      } else {
        await loadAndPlay();
      }
    }
  };

  const handleSeek = async (value: number) => {
    setIsSeeking(true); // Flag seeking to avoid timer updates
    await sound?.setPositionAsync(value);
    setPositionMillis(value); // Update position immediately during seek
  };

  const skip = async (ms: number) => {
    if (!sound) return;
    const newPosition = Math.min(
      Math.max(positionMillis + ms, 0),
      durationMillis
    );
    await sound.setPositionAsync(newPosition);
    setPositionMillis(newPosition);
  };

  const startTimer = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      if (!sound) return;
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying && !isSeeking) {
        setPositionMillis(status.positionMillis);
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      stopSound();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <View
      style={{
        padding: 12,
        backgroundColor: MD3Colors.primary60,
        borderRadius: 12,
      }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => skip(-10000)}>
              <Ionicons name='play-back' size={24} color='black' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={togglePlayback}
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

          {/* Slider */}
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={durationMillis}
            value={positionMillis}
            minimumTrackTintColor='#1EB1FC'
            maximumTrackTintColor='#ccc'
            thumbTintColor='#1EB1FC'
            onValueChange={(val) => {
              setIsSeeking(true); // Flag seeking to stop timer updates
              setPositionMillis(val); // Update position on slide
            }}
            onSlidingComplete={async () => {
              setIsSeeking(false); // Reset seeking flag after user is done sliding
              startTimer(); // Restart the timer after seeking is complete
            }}
          />

          {/* Time Display */}
          <Text style={{ alignSelf: 'center' }}>
            {formatDuration(positionMillis)} / {formatDuration(durationMillis)}
          </Text>
        </>
      )}
    </View>
  );
};

export default AudioPlayer;
