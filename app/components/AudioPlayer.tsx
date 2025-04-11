import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

const AudioPlayer = ({ uri }: { uri: string }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAndPlay = async () => {
    try {
      setLoading(true);
      // const { sound } = await Audio.Sound.createAsync(
      //   { uri },
      //   { shouldPlay: true }
      // );
      // setSound(sound);
      // setIsPlaying(true);
      // setLoading(false);

      // sound.setOnPlaybackStatusUpdate((status: any) => {
      //   if (!status.isPlaying && status.didJustFinish) {
      //     setIsPlaying(false);
      //   }
      // });
    } catch (err) {
      console.log('Error loading audio', err);
      setLoading(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <TouchableOpacity
      onPress={isPlaying ? stopSound : loadAndPlay}
      style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color='black' />
      )}
      <Text style={{ marginLeft: 8 }}>
        {isPlaying ? 'Playing' : 'Play Audio'}
      </Text>
    </TouchableOpacity>
  );
};

export default AudioPlayer;
