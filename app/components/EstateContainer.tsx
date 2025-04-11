import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Share,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  ActivityIndicator,
  Card,
  MD2Colors,
  MD3Colors,
  Text,
} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  createConversation,
  createMsg,
  updateConversation,
} from '../features/chats/chatsSlice';
import { IPhoto, UIEstateDocument } from '../features/estate/types';
import UserProfile from './custom/UserProfile';

const width = Dimensions.get('screen').width;

const EstateContainer: React.FC<{ items: UIEstateDocument }> = ({ items }) => {
  const navigation: any = useNavigation();
  const router: any = useRoute();
  const { user: currentUser } = useSelector((store: RootState) => store.AUTH);
  const { user, photo, average_rating } = items;
  const dispatch: any = useDispatch();
  const [readMore, setReadMore] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const currUserAd = user?.contact_details.email === currentUser.email;
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

  const enquire = async () => {
    setSending(true);
    try {
      const userB = user && {
        email: user && user.contact_details.email,
        avatar: user.avatar,
        _id: user && user._id,
        username: user.username,
      };
      const userA = currentUser && {
        email: currentUser.email,
        avatar: currentUser.avatar,
        _id: currentUser && currentUser.userId,
        username: currentUser.username,
      };
      const participantsArray = [userA.email, userB.email];
      const participants = [userA, userB];
      const data = { participants, participantsArray };
      const room = await dispatch(createConversation(data));
      const item = room.payload.newRoom || room.payload.existingRoom;
      const msg = { text: 'hello, is this still available?', roomId: item._id };
      const result = await dispatch(createMsg(msg));
      const id = result.meta.arg.roomId;
      const lastMessage = { ...result.payload.newMsg };
      const items = { id, lastMessage };
      await dispatch(updateConversation(items));
    } catch (error: any) {
      console.log(error);
    } finally {
      setSending(false);
      ToastAndroid.show('Message sent', 1500);
    }
  };

  return (
    <View style={{ position: 'relative' }}>
      <TouchableWithoutFeedback
        onPress={() =>
          router.name === 'listings'
            ? navigation.navigate('details', items)
            : navigation.navigate('info', items)
        }
      >
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              left: 20,
            }}
          >
            <View>
              <UserProfile
                style={{ marginLeft: 18 }}
                user={user}
                rating={average_rating}
                items={items}
              />
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
            <TouchableWithoutFeedback
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
            </TouchableWithoutFeedback>
          ))}
        </View>
      </TouchableWithoutFeedback>
      <Modal isVisible={visible} onBackdropPress={() => setVisible(false)}>
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.modalImage}
            resizeMode='contain'
          />
        </View>
      </Modal>

      <View style={styles.footer}>
        {router.name !== 'MyListingScreen' && (
          <TouchableOpacity
            disabled={sending || currUserAd}
            onPress={enquire}
            style={[
              styles.icon,
              currUserAd && { backgroundColor: MD3Colors.primary70 },
            ]}
          >
            {sending ? (
              <ActivityIndicator size={'small'} />
            ) : (
              <>
                <Text style={styles.textInfo}>
                  {currUserAd ? 'My listing' : 'message'}
                </Text>
                <AntDesign name='message1' size={12} color='black' />
              </>
            )}
          </TouchableOpacity>
        )}

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
  modalContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
  },
  modalImage: {
    width: '100%',
    height: 400,
    borderRadius: 10,
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
    fontSize: 12,
    color: MD2Colors.grey800,
  },
});
