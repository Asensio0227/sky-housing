import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MD3Colors } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NewListingButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={styles.container}>
        <MaterialCommunityIcons name='plus-circle' color='white' size={40} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: MD3Colors.primary50,
    borderRadius: 40,
    borderColor: 'white',
    borderWidth: 10,
    bottom: 20,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
});

export default NewListingButton;
