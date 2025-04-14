import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  MD2Colors,
  MD3Colors,
  PaperProvider,
  Portal,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import AppButton from '../../components/custom/AppButton';
import AppText from '../../components/custom/AppText';
import ViewModal from '../../components/custom/ViewModal';
import { currentUser, showModal } from '../../features/auth/authSlice';

const windowWidth = Dimensions.get('window').width;

const Profile = () => {
  const { user, visible } = useSelector((store: RootState) => store.AUTH);
  const dispatch: any = useDispatch();
  const navigation: any = useNavigation();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchCurrentUser = async () => {
        try {
          if (isActive) {
            await dispatch(currentUser());
          }
        } catch (error) {
          console.log('Error fetching current user:', error);
        }
      };

      fetchCurrentUser();

      return () => {
        isActive = false;
      };
    }, [dispatch])
  );

  const {
    physical_address,
    contact_details,
    first_name,
    last_name,
    gender,
    ideaNumber,
    avatar,
    email,
    username,
    date_of_birth,
  } = user;

  return (
    <PaperProvider>
      <Portal>
        <ScrollView style={styles.container}>
          <ImageBackground
            source={
              avatar ? { uri: avatar } : require('../../assets/user-icon.png')
            }
            width={200}
            height={200}
            resizeMode='stretch'
            style={styles.bckground}
          >
            <AppButton
              title='edit profile'
              mode='outlined'
              onPress={() => navigation.navigate('edit-profile', user)}
              style={styles.btn}
              color={MD2Colors.purple900}
            />
          </ImageBackground>
          <View style={styles.details}>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Name : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.subTitle}
                title={first_name}
              />
            </View>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Surname : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.subTitle}
                title={last_name}
              />
            </View>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Username : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.subTitle}
                title={username}
              />
            </View>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Email : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={[styles.subTitle, { textTransform: 'none' }]}
                title={email}
              />
            </View>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Gender : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.subTitle}
                title={gender}
              />
            </View>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='ID number : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.subTitle}
                title={ideaNumber}
              />
            </View>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Date of birth : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.subTitle}
                title={date_of_birth}
              />
            </View>
            <AppText variant='displayMedium' title='Contact details : ' />
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Phone : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title={contact_details?.phone_number}
              />
            </View>
            <AppText variant='displayMedium' title='Physical Address : ' />
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Street : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title={physical_address?.street}
              />
            </View>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='City : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title={physical_address?.city}
              />
            </View>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Province : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title={physical_address?.province}
              />
            </View>
            <View style={styles.pre}>
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title='Country : '
              />
              <AppText
                color={MD2Colors.purple50}
                style={styles.title}
                title={physical_address?.country}
              />
            </View>
            <AppButton
              title='change Password'
              onPress={() => dispatch(showModal())}
              color={MD2Colors.purple900}
            />
          </View>
        </ScrollView>
        {visible && <ViewModal />}
      </Portal>
    </PaperProvider>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bckground: {
    width: windowWidth,
    height: 300,
    position: 'relative',
  },
  btn: {
    bottom: 0,
    position: 'absolute',
    fontSize: 10,
  },
  details: {
    flex: 1,
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  title: {
    fontSize: 14,
  },
  subTitle: {
    fontSize: 14,
    paddingHorizontal: 10,
  },
  pre: {
    alignItems: 'center',
    backgroundColor: MD3Colors.primary50,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 2,
    padding: 5,
    overflow: 'hidden',
  },
});
