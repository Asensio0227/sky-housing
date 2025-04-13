import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const ChatLoader = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size='large' />
  </View>
);

export default ChatLoader;
