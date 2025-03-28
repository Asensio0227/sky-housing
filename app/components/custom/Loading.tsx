import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const Loading = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator
        size={'large'}
        animating={true}
        color={MD2Colors.purple300}
      />
    </View>
  );
};

export default Loading;
