import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import * as Yup from 'yup';
import AppForm from '../../components/form/AppForm';
import DatePicker from '../../components/form/DatePicker';
import FormImage from '../../components/form/FormImage';
import FormInput, { UserDocument } from '../../components/form/FormInput';
import SubmitButton from '../../components/form/SubmitButton';
import TextLink from '../../components/TextLink';

const validateSchema = Yup.object().shape({
  avatar: Yup.string().required('UserProfile is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email().required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  name: Yup.string().required('Name is required'),
  contact_details: Yup.object().shape({
    phoneNumber: Yup.string().required('Phone number is required'),
    email: Yup.string().email().required('Email is required'),
  }),
  date_of_birth: Yup.string().required('Date of birth is required'),
  gender: Yup.string().required('Gender is required'),
  address: Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    province: Yup.string().required('Province is required'),
    postal_code: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required'),
  }),
  ideaNumber: Yup.string().required('Idea number is required'),
  status: Yup.string().required('Status is required'),
  userAds_address: Yup.object().shape({
    type: Yup.string(),
    coordinates: Yup.array()
      .of(Yup.number())
      .required('Coordinates are required'),
  }),
});

const SignUp = () => {
  const onSubmit = async (data: UserDocument) => {
    console.log(`====user====`);
    console.log(data);
    console.log(`====user====`);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      style={{
        flex: 1,
        overflow: 'scroll',
      }}
    >
      <AppForm
        initialValues={{
          avatar: '',
          first_name: '',
          last_name: '',
          username: '',
          email: '',
          password: '',
          contact_details: {
            phoneNumber: '',
            email: '',
          },
          date_of_birth: '',
          gender: '',
          address: {
            street: '',
            city: '',
            province: '',
            postal_code: '',
            country: '',
          },
          ideaNumber: '',
          userAds_address: {
            type: '',
            coordinates: [],
          },
        }}
        validationSchema={validateSchema}
        onSubmit={onSubmit}
      >
        <FormImage name='avatar' photoUrl={true} />
        <FormInput
          name='first_name'
          label='First name'
          placeholder='Enter your name'
          icon='account'
        />
        <FormInput
          name='last_name'
          label='Last name'
          placeholder='Enter your name'
          icon='account'
        />
        <FormInput
          name='username'
          label='Username'
          placeholder='Enter your username'
          icon='account'
        />
        <FormInput
          name='email'
          label='Email'
          placeholder='Enter your email'
          icon='email'
        />

        <FormInput
          name='ideaNumber'
          label='Idea number'
          placeholder='Enter your idea number'
          icon='numeric'
        />
        <FormInput
          name='contact_details.phoneNumber'
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
        <FormInput
          name='gender'
          label='Gender'
          placeholder='Enter your gender'
          icon='gender-male-female'
        />
        <FormInput
          name='address.street'
          label='Street'
          placeholder='Enter your street'
          icon='map-marker'
        />
        <FormInput
          name='address.city'
          label='City'
          placeholder='Enter your city'
          icon='city'
        />
        <FormInput
          name='address.province'
          label='Province'
          placeholder='Enter your province'
          icon='map-marker'
        />
        <FormInput
          name='address.postal_code'
          label='Postal code'
          placeholder='Enter your postal code'
          icon='map-marker'
        />
        <FormInput
          name='address.country'
          label='Country'
          placeholder='Enter your country'
          icon='map-marker'
        />
        <FormInput
          name='password'
          label='Password'
          placeholder='Enter your password'
          icon='lock'
          secureTextEntry
        />
        <SubmitButton title='Sign Up' />
      </AppForm>
      <TextLink text='I have account?' linkText='sign-in?' link='login' />
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
