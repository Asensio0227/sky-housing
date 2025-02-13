import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RootState } from '../../../store';
import { UserDocument } from '../../components/form/FormInput';
import Loading from '../../components/Loading';
import Setup from '../../components/Setup';
import { createUserAccount } from '../../features/auth/authSlice';
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
    <Setup
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
      title='Update Account'
    />
  );
};

export default SignUp;
