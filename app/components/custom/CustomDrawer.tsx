import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { MD2Colors } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { removeUser, signOutUser } from '../../features/auth/authSlice';
import Loading from './Loading';

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props: any) => {
  const navigation: any = useNavigation();
  const { user, isLoading } = useSelector((store: RootState) => store.AUTH);
  const dispatch: any = useDispatch();

  async function logoutUser() {
    try {
      await dispatch(signOutUser());
      removeUser();
      ToastAndroid.showWithGravity('Success! logging out....', 15000, 0);
    } catch (error: any) {
      console.log(`Error logging out: ${error.message}...`);
    }
  }

  if (isLoading) return <Loading />;

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View>
        <View style={{ padding: 15, backgroundColor: MD2Colors.purple900 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={
                user && user.avatar
                  ? { uri: user.avatar }
                  : require('../../assets/user-icon.png')
              }
              style={{
                // backgroundColor: palette.secondaryLight,
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
            <View>
              <Text
                style={{ fontWeight: 'bold', marginLeft: 10, fontSize: 14 }}
              >
                {user?.username.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Messages Row */}
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: MD2Colors.grey300,
              borderTopWidth: 1,
              borderTopColor: MD2Colors.grey300,
              paddingVertical: 5,
              marginVertical: 10,
            }}
          >
            <Pressable
              onPress={() => {
                navigation.navigate('conversation');
              }}
            >
              <Text style={{ color: '#dddddd', paddingVertical: 5 }}>
                Chats
              </Text>
            </Pressable>
          </View>

          {/* Do more */}
          <Pressable
            onPress={() => {
              navigation.navigate('profile');
            }}
          >
            <Text style={{ color: '#dddddd', paddingVertical: 5 }}>
              Profile
            </Text>
          </Pressable>
        </View>
        <DrawerItemList {...props} />

        <Pressable onPress={() => logoutUser()}>
          <Text
            style={{
              padding: 5,
              paddingLeft: 20,
              color: MD2Colors.purple100,
              fontWeight: '900',
            }}
          >
            Logout
          </Text>
        </Pressable>
      </Animated.View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
