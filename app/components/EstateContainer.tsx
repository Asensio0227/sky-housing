import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Share,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import { Card, MD2Colors, MD3Colors, Text } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IPhoto, UIEstateDocument } from '../features/estate/types';
import UserProfile from './custom/UserProfile';

const width = Dimensions.get('screen').width;

const EstateContainer: React.FC<{ items: UIEstateDocument }> = ({ items }) => {
  const navigation: any = useNavigation();
  const { user, photo } = items;
  const [readMore, setReadMore] = useState(false);
  const [visible, setVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const images: { id: string; uri: string } | any = photo.map(
    (img: IPhoto) => ({
      id: img.id,
      uri: img.url,
    })
  );

  useEffect(() => {
    if (images.length > 0) {
      setImageUrl(images[0].uri);
    }
  }, []);

  const shareImage = async () => {
    try {
      if (typeof items.title !== 'string' || typeof imageUrl !== 'string') {
        console.error('Invalid title or imageUrl');
        return;
      }

      const result = await Share.share({
        message: `${items.title}, ${imageUrl}`,
        url: imageUrl,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('User shared using', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error: any) {
      console.log('Oops!, Failed to share image', error);
    }
  };

  return (
    <View style={{ position: 'relative' }}>
      <TouchableWithoutFeedback onPress={() => console.warn('highlight')}>
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              left: 20,
            }}
          >
            <View>
              <UserProfile style={{ marginLeft: 18 }} user={user} />
              <Text style={styles.desc} variant='titleSmall'>
                {readMore
                  ? items.description
                  : `${items.description.substring(0, 200)}...`}
                <Text
                  style={{
                    color: MD3Colors.secondary20,
                    textDecorationLine: 'underline',
                    fontSize: 10,
                  }}
                  onPress={() => setReadMore((prev) => !prev)}
                >
                  {readMore ? 'Show Less' : 'Read More'}
                </Text>
              </Text>
            </View>
          </View>
          {photo.slice(0, 1).map((image) => (
            <TouchableOpacity
              onPress={() => setVisible(true)}
              key={image.id}
              style={styles.imgContainer}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width,
                }}
              >
                <Card.Cover
                  style={[{ width, height: width / 2 }, styles.img]}
                  source={{ uri: image.url }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableWithoutFeedback>
      <ImageView
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() =>
            console.warn('message,{hello, is this still available?}')
          }
          style={styles.icon}
        >
          <Text style={styles.textInfo}>message</Text>
          <AntDesign name='message1' size={12} color='black' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('comments', items)}
          style={[
            {
              marginHorizontal: 15,
            },
            styles.icon,
          ]}
        >
          <Text style={styles.textInfo}>comment</Text>
          <MaterialIcons name='message' size={12} color='black' />
        </TouchableOpacity>
        <TouchableOpacity onPress={shareImage} style={styles.icon}>
          <Text style={styles.textInfo}>share</Text>
          <FontAwesome name='share' size={12} color='black' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EstateContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    overflow: 'hidden',
  },
  desc: {
    fontFamily: 'OpenSans_300',
    fontWeight: '600',
    color: MD2Colors.grey800,
    paddingHorizontal: 8,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  img: {
    overflow: 'hidden',
    marginVertical: 5,
    backgroundColor: MD3Colors.secondary60,
    width: '100%',
    borderRadius: 0,
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  textInfo: {
    marginBottom: 3,
    paddingHorizontal: 3,
  },
});
