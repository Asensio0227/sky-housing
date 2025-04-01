import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { MD3Colors } from 'react-native-paper';
import * as Progress from 'react-native-progress';

const UploadProgressBar: React.FC<{
  progress: number;
  uploadVisible: boolean;
}> = ({ progress, uploadVisible }) => {
  return (
    <Modal visible={uploadVisible}>
      <View style={styles.container}>
        <Progress.Bar
          color={MD3Colors.primary20}
          progress={progress}
          width={200}
        />
      </View>
    </Modal>
  );
};

export default UploadProgressBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: 150,
    margin: 10,
    padding: 5,
    height: 5,
  },
});
