import { Audio } from 'expo-av';

let currentSound: Audio.Sound | null = null;

export const AudioManager = {
  play: async (newSound: Audio.Sound) => {
    if (currentSound && currentSound !== newSound) {
      const status = await currentSound.getStatusAsync();
      if (status.isLoaded) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }
    }

    currentSound = newSound;

    const newStatus = await currentSound.getStatusAsync();
    if (newStatus.isLoaded) {
      await currentSound.playAsync();
    }
  },

  stopCurrent: async () => {
    if (currentSound) {
      const status = await currentSound.getStatusAsync();
      if (status.isLoaded) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }
      currentSound = null;
    }
  },

  getCurrent: () => currentSound,
};
