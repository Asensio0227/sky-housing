import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { Appbar, Avatar, Button, MD2Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import {
  deleteAd,
  markAdAsTaken,
  removeAd,
} from '../../features/estate/estateSlice';
import { UserDocument } from '../form/FormInput';
import Rating from '../reviews/Rating';

dayjs.extend(calendar);

const UserProfile: React.FC<{
  user: UserDocument | any;
  style?: any;
  rating?: number | any;
  items?: any;
}> = ({ user, style, rating, items }) => {
  const date = user.lastSeen;
  const time = `Last seen ${dayjs(date).fromNow()}`;
  const [visible, setVisible] = useState(false);
  const router: any = useRoute();
  const navigation: any = useNavigation();
  const dispatch: any = useDispatch();
  const id = router.params?._id;

  const openMenu = () => setVisible(!visible);

  const markAsTaken = async () => {
    try {
      const id = items._id;
      await dispatch(markAdAsTaken(id));
      ToastAndroid.showWithGravity('Ad updated successfully', 15000, 0);
      navigation.goBack();
    } catch (error) {
      console.log(`Error changing ad status : ${error}`);
    }
  };

  const removeFromAdList = async () => {
    try {
      await dispatch(deleteAd(id));
      dispatch(removeAd(id));
      openMenu();
      navigation.goBack();
    } catch (error) {
      console.log(`Error deleting ad : ${error}`);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <>
        <View>
          {user.avatar ? (
            <Avatar.Image size={40} source={{ uri: user.avatar }} />
          ) : (
            <Avatar.Text
              size={40}
              label={
                user && user.username && user.username.charAt(0).toUpperCase()
              }
            />
          )}
        </View>
        <View>
          <View style={styles.section}>
            <Text style={styles.text}>
              {items ? `${user.username}/${items.title}` : user.username}
            </Text>
            <Text style={styles.status}>
              {user.status === 'online' ? 'Online' : time}
            </Text>
          </View>
          <Rating rating={rating} />
        </View>
      </>
      {router.name === 'info' && (
        <View
          style={{
            position: 'relative',
            top: -15,
            // alignItems: 'flex-end',
            // justifyContent: 'flex-end',
          }}
        >
          <Appbar.Action
            icon={'menu'}
            onPress={openMenu}
            style={{
              top: 10,
              left: 0,
              width: 80,
            }}
          />
          {visible && (
            <View
              style={{
                position: 'absolute',
                top: 40,
                right: 0,
                zIndex: 1,
                padding: 6,
                backgroundColor: MD2Colors.grey200,
                borderRadius: 5,
                marginTop: 5,
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              <Button
                labelStyle={{
                  borderBottomWidth: 1,
                  borderColor: 'black',
                }}
                textColor='teal'
                onPress={() => navigation.navigate('editListing', items)}
              >
                Edit
              </Button>
              <Button
                disabled={items.taken}
                labelStyle={{
                  borderBottomWidth: 1,
                  borderColor: 'black',
                }}
                textColor='teal'
                onPress={() =>
                  Alert.alert(
                    'Status',
                    'Are you sure you want to mark this ad as taken.',
                    [
                      {
                        text: 'Yes',
                        onPress: markAsTaken,
                      },
                      { text: 'No', onPress: () => openMenu },
                    ]
                  )
                }
              >
                Taken
              </Button>
              <Button
                textColor='red'
                onPress={() =>
                  Alert.alert(
                    'Delete',
                    'Are you sure you want to delete this Ad.',
                    [
                      {
                        text: 'Yes',
                        onPress: removeFromAdList,
                      },
                      { text: 'No', onPress: () => openMenu },
                    ]
                  )
                }
              >
                Delete
              </Button>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    // justifyContent: 'space-between',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    right: 35,
    marginLeft: 8,
  },
  section: {
    alignItems: 'center',
    marginRight: 25,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  text: {
    fontSize: 18,
  },
  status: {
    fontSize: 9,
  },
});
