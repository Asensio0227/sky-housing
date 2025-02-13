import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RootState } from '../../../store';
import Text from '../../components/AppText';
import Form from '../../components/form/AppForm';
import DatePicker from '../../components/form/DatePicker';
import {
  default as FormImage,
  default as ImageInput,
} from '../../components/form/FormImage';
import Input, { UserDocument } from '../../components/form/FormInput';
import Submit from '../../components/form/SubmitButton';
import Loading from '../../components/Loading';
import TextLink from '../../components/TextLink';
import { createUserAccount } from '../../features/authSlice/authSliceSlice';
import useLocation from '../../hooks/useLocation';
import useNotifications from '../../hooks/useNotifications';

const validateSchema = Yup.object().shape({
  avatar: Yup.string().required('UserProfile is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email().required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  phone_number: Yup.string()
    .matches(
      /(?:(?<internationCode>\+[1-9]{1,4})[ -])?\(?(?<areacode>\d{2,3})\)?[ -]?(\d{3})[ -]?(\d{4})/,
      'Invalid phone number'
    )
    .required('Phone number is required!'),
  date_of_birth: Yup.date().required('Date of birth is required').nullable(),
  gender: Yup.string().required('Gender is required'),
  street: Yup.string().required('Street is required'),
  city: Yup.string().required('City is required'),
  province: Yup.string().required('Province is required'),
  postal_code: Yup.string().required('Postal code is required'),
  country: Yup.string().required('Country is required'),
  ideaNumber: Yup.string().required('Idea number is required'),
});

const SignUp = () => {
  const { isLoading } = useSelector((store: RootState) => store.AUTH);
  const dispatch: any = useDispatch();
  const { location } = useLocation();
  const { expoPushToken } = useNotifications();
  const navigation: any = useNavigation();

  const onSubmit = async (data: UserDocument | any) => {
    try {
      if (!data) {
        throw new Error('Data cannot be null or undefined');
      }
      let userAds_address: any = { type: 'Point', coordinates: [] };
      const coordinates: any =
        location && location.coords ? location.coords : {};
      const { longitude, latitude } = coordinates;
      if (longitude !== undefined && latitude !== undefined) {
        userAds_address.coordinates = [longitude, latitude];
      } else {
        throw new Error(
          'Coordinates are not available! Please allow app to yse your location.'
        );
      }
      data.expoToken = expoPushToken;
      const userData = { ...data, userAds_address };
      await dispatch(createUserAccount(userData));
    } catch (error: any) {
      console.log(`Error submitting user document: ${error}`);
    } finally {
      navigation.navigate('verify');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      style={{
        flex: 1,
        overflow: 'scroll',
        marginVertical: 20,
      }}
    >
      <Text style={styles.text} title='Sign Up' />
      <Form
        initialValues={{
          avatar: '',
          first_name: '',
          last_name: '',
          username: '',
          email: '',
          password: '',
          gender: '',
          date_of_birth: '',
          phone_number: '',
          street: '',
          city: '',
          province: '',
          postal_code: '',
          country: '',
          ideaNumber: '',
        }}
        validationSchema={validateSchema}
        onSubmit={onSubmit}
      >
        <FormImage name='avatar' photoUrl={true} />
        <Input
          name='first_name'
          label='First name'
          placeholder='Enter your name'
          icon='account'
        />
        <Input
          name='last_name'
          label='Last name'
          placeholder='Enter your name'
          icon='account'
        />
        <Input
          name='username'
          label='Username'
          placeholder='Enter your username'
          icon='account'
        />
        <Input
          name='email'
          label='Email'
          placeholder='Enter your email'
          icon='email'
        />
        <Input
          name='ideaNumber'
          label='Idea number'
          placeholder='Enter your idea number'
          icon='numeric'
        />
        <Input
          name='phone_number'
          label='Phone number'
          placeholder='Enter your phone number'
          icon='phone'
        />
        <DatePicker
          name='date_of_birth'
          label='Date of birth'
          placeholder='Enter your date of birth'
          icon='calendar'
        />
        <Input
          name='gender'
          label='Gender'
          placeholder='Enter your gender'
          icon='gender-male-female'
        />
        <Input
          name='street'
          label='Street'
          placeholder='Enter your street'
          icon='map-marker'
        />
        <Input
          name='city'
          label='City'
          placeholder='Enter your city'
          icon='city'
        />
        <Input
          name='province'
          label='Province'
          placeholder='Enter your province'
          icon='map-marker'
        />
        <Input
          name='postal_code'
          label='Postal code'
          placeholder='Enter your postal code'
          icon='map-marker'
        />
        <Input
          name='country'
          label='Country'
          placeholder='Enter your country'
          icon='map-marker'
        />
        <Input
          name='password'
          label='Password'
          placeholder='Enter your password'
          icon='lock'
          secureTextEntry
        />
        <Submit title='Sign Up' />
      </Form>
      <TextLink text='I have account?' linkText='sign-in?' link='sign-in' />
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  text: { fontSize: 18, textDecorationLine: 'underline' },
});
