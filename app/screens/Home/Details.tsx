import { useFocusEffect, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { MD2Colors, MD3Colors, Text } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootEstateState } from '../../../store';
import Loading from '../../components/custom/Loading';
import UserProfile from '../../components/custom/UserProfile';
import ImageGrid from '../../components/ImageGrid';
import Comment from '../../components/reviews/Comment';
import { retrieveAdWithComments } from '../../features/estate/estateSlice';
import { UIEstateDocument } from '../../features/estate/types';

const Details = () => {
  const router = useRoute();
  const items: UIEstateDocument | any = router.params;
  const { isLoading, singleHouseWithComments } = useSelector(
    (store: RootEstateState) => store.ESTATE
  );
  const dispatch: any = useDispatch();
  const [readMore, setReadMore] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [visible, setVisible] = useState(false);
  const scrollRef: any = useRef(null);

  useFocusEffect(
    useCallback(() => {
      // fetch data here
      (async () => {
        const productId: any = items._id;
        try {
          await dispatch(retrieveAdWithComments(productId));
        } catch (error: any) {
          console.log(`Error fetching ad with comments : ${error}`);
        }
      })();
    }, [])
  );

  useEffect(() => {
    if (items && items.photo.length > 0) {
      const images = items && items.photo;
      setImageUrl(images[0].url);
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

  if (isLoading) return <Loading />;

  const images =
    singleHouseWithComments &&
    singleHouseWithComments.ad &&
    singleHouseWithComments.ad.photo;
  const reviews = singleHouseWithComments && singleHouseWithComments.reviews;

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'center' }}
      style={styles.container}
      onContentSizeChange={() => scrollRef?.current?.scrollToEnd()}
    >
      <View>
        <UserProfile
          style={{
            marginLeft: 18,
            paddingHorizontal: 18,
            marginBottom: 3,
            marginTop: 5,
          }}
          user={items.user}
        />
        <Text style={styles.desc} variant='titleSmall'>
          {readMore
            ? singleHouseWithComments &&
              singleHouseWithComments.ad &&
              singleHouseWithComments.ad.description
            : `${
                singleHouseWithComments &&
                singleHouseWithComments.ad &&
                singleHouseWithComments.ad.description.substring(0, 200)
              }...`}
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
      <ImageGrid data={images} />
      {/* **** footer **** */}
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
          onPress={() => setVisible(!visible)}
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
      {/* ******comments ***** */}
      {visible && (
        <Animated.View>
          {reviews.length > 0 ? (
            <View style={styles.commentContainer}>
              <FlashList
                data={reviews}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }) => (
                  <Comment item={item} reviews={reviews} />
                )}
                estimatedItemSize={200}
                scrollEnabled
                pagingEnabled
              />
            </View>
          ) : (
            <View
              style={{
                borderRadius: 20,
                padding: 8,
                marginVertical: 5,
                marginLeft: 5,
                width: '80%',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
                backgroundColor: MD2Colors.grey400,
              }}
            >
              <Text
                style={{
                  color: MD2Colors.black,
                  fontSize: 13,
                }}
              >
                No comments yet?
              </Text>
            </View>
          )}
        </Animated.View>
      )}
    </ScrollView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
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
    padding: 2,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  img: {
    borderRadius: 0,
    overflow: 'hidden',
    resizeMode: 'cover',
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
  commentContainer: {
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    right: 35,
    marginLeft: 8,
    width: '100%',
    height: '100%',
  },
});
