import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { MD2Colors, MD2DarkTheme } from 'react-native-paper';
import { UIEstateDocument } from '../features/estate/types';
import AppText from './AppText';

const Estate: React.FC<{ items: UIEstateDocument }> = ({ items }) => {
  return (
    <>
      {items.photo.map((avatar) => {
        return (
          <ImageBackground
            key={avatar.id}
            source={{ uri: avatar.url }}
            style={{ width: 200, height: 200 }}
            resizeMode='cover'
          >
            <View style={styles.container}>
              <View style={styles.user}>
                <Image
                  source={require('../assets/user-icon.png')}
                  style={styles.userProfile}
                />
                <View
                  style={{
                    alignItems: 'flex-start',
                    marginLeft: 5,
                  }}
                >
                  <AppText
                    color={MD2DarkTheme.colors.text}
                    style={styles.username}
                    title={items.user}
                  />
                  <AppText
                    style={styles.subTitle}
                    color={MD2Colors.amberA700}
                    title={items.average_rating}
                  />
                </View>
              </View>
            </View>
            <Text
              style={{
                bottom: 5,
                color: 'white',
                fontSize: 12,
                fontFamily: ' OpenSans_400Regular',
                paddingHorizontal: 5,
              }}
              numberOfLines={2}
            >
              {items.description}
            </Text>
          </ImageBackground>
        );
      })}
    </>
  );
};

export default Estate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    marginVertical: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  user: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
  },
  userProfile: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontSize: 12,
  },
  subTitle: {
    top: -20,
  },
});
