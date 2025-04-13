import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import AppButton from '../../components/custom/AppButton';
import AppText from '../../components/custom/AppText';

const Welcome = () => {
  const navigation: any = useNavigation();

  return (
    <ImageBackground
      source={require('../../assets/small-wooden-houses-with-heart-big-one-symbolizing-family-love-security-home.jpg')}
      blurRadius={7}
      // imageStyle={styles.wclBackground}
      resizeMode='cover'
      style={styles.wclBackground}
    >
      <View style={styles.section}>
        {/* <Text style={styles.text}>
          Find Your Dream Home in a Click!
          “Unlock Your Perfect Space Today!”
          “Discover Homes That Fit Your Life!”
          “Your Next Home Awaits – Start Searching!”
          “Where Home Hunting Meets Happiness!”
        </Text> */}
        <AppText
          title='Your Next Home Awaits – Start Searching!'
          color={MD2Colors.amber50}
          style={{ fontSize: 15 }}
        />
      </View>
      <View style={styles.sectionCenter}>
        <AppButton
          style={{ color: 'white' }}
          title='Sign in'
          mode='outlined'
          onPress={() => navigation.navigate('sign-in')}
        />
        <AppButton
          mode='outlined'
          title='Sign up'
          onPress={() => navigation.navigate('sign-up')}
        />
      </View>
    </ImageBackground>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  wclBackground: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  section: {
    alignContent: 'center',
    position: 'absolute',
    top: 70,
  },
  sectionCenter: {
    padding: 20,
    width: '100%',
  },
  text: {
    color: MD2Colors.amber200,
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '900',
    paddingVertical: 20,
  },
});
