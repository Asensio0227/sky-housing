import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import * as Yup from 'yup';
import AppForm from '../../components/form/AppForm';
import FormInput, { UserDocument } from '../../components/form/FormInput';
import SubmitButton from '../../components/form/SubmitButton';
import TextLink from '../../components/TextLink';

const validateSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const SiginIn = () => {
  const onSubmit = async (data: UserDocument) => {
    console.log(`===sign in===`);
    console.log(data);
    console.log(`===sign in===`);
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
          username: '',
          password: '',
        }}
        validationSchema={validateSchema}
        onSubmit={onSubmit}
      >
        <FormInput
          name='username'
          label='Username'
          placeholder='Enter your username'
          icon='account'
        />
        <FormInput
          name='password'
          label='Password'
          placeholder='Enter your password'
          icon='lock'
          secureTextEntry
        />
        <SubmitButton title='Sign-in' />
      </AppForm>
      <TextLink
        text="I don't have an account?"
        linkText='Create Account'
        link='register'
      />
      <TextLink
        text='I forgot my password?'
        linkText='Reset password?'
        link='reset'
      />
    </ScrollView>
  );
};

export default SiginIn;

const styles = StyleSheet.create({});
