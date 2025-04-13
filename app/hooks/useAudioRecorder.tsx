import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootChatsState, store } from '../../store';
import {
  resetAudioRecording,
  setAudioRecording,
} from '../features/chats/chatsSlice';

export const useAudioRecorder = () => {
  const dispatch = useDispatch();
  const { audioRecording } = useSelector(
    (state: RootChatsState) => state.Chats
  );

  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return;

    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;

      dispatch(
        setAudioRecording({ isRecording: true, uri: null, duration: 0 })
      );

      intervalRef.current = setInterval(() => {
        const state = store.getState();
        const { duration } = state.Chats.audioRecording;

        dispatch(
          setAudioRecording({
            isRecording: true,
            uri: null,
            duration: duration + 1,
          })
        );
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }, [dispatch]);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      console.warn('stopping....');

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      dispatch(
        setAudioRecording({
          isRecording: false,
          uri,
          duration: audioRecording.duration,
        })
      );
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  }, [dispatch, audioRecording.duration]);

  const cancelRecording = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    recordingRef.current = null;
    intervalRef.current = null;

    dispatch(resetAudioRecording());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    isRecording: audioRecording.isRecording,
    duration: audioRecording.duration,
    uri: audioRecording.uri,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};
