import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Card, MD2Colors } from 'react-native-paper';
import { UIEstateDocument } from '../features/estate/types';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Estate: React.FC<{ items: UIEstateDocument }> = ({ items }) => {
  const {
    photo,
    user: { avatar, username },
  } = items;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.container}>
        <Card.Cover
          style={[{ width, height: width / 2, borderRadius: 0 }]}
          source={{ uri: photo[0].url }}
        />
        <View style={styles.user}>
          <Image
            source={
              avatar ? { uri: avatar } : require('../assets/user-icon.png')
            }
            style={styles.userProfile}
          />
          <Text style={styles.subTitle}>{username}</Text>
        </View>
      </View>
    </View>
  );
};

export default Estate;

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'relative',
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    width,
    height: height / 2,
  },
  user: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 12,
    color: MD2Colors.grey800,
    marginLeft: 10,
  },
});
