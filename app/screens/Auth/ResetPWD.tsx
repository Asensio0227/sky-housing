import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import AppText from '../../components/AppText';
import AppForm from '../../components/form/AppForm';
import FormInput from '../../components/form/FormInput';
import SubmitButton from '../../components/form/SubmitButton';
import TextLink from '../../components/TextLink';

const ResetPwd = () => {
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setILoading] = useState(false);

  const onRequestReset = async (data: any) => {};

  // Reset the password with the code and the new password
  const onReset = async (data: any) => {};

  return (
    <View style={styles.container}>
      {!successfulCreation && (
        <AppForm
          initialValues={{ email: '' }}
          onSubmit={onRequestReset}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required('Please enter your email'),
          })}
        >
          <AppText
            title='Enter email to reset password
'
          />
          <FormInput name='email' icon='email' placeholder='Email' />
          <SubmitButton title='submit' />
        </AppForm>
      )}

      {successfulCreation && (
        <AppForm
          initialValues={{ password: '', token: '', email: '' }}
          validationSchema={Yup.object().shape({
            token: Yup.string()
              .required('Please enter verification code.')
              .length(6, 'Code must be exactly 6 characters long'),
            email: Yup.string().email().required('Please enter your email.'),
            password: Yup.string()
              .required('Password is required')
              .min(5, 'Password is too short - should be 6 chars minimum'),
          })}
          onSubmit={onReset}
        >
          <View>
            <FormInput name='email' icon='email' placeholder='Email' />
            <FormInput
              name='token'
              icon='two-factor-authentication'
              placeholder='Code...'
            />
            <FormInput name='password' icon='lock' placeholder='New password' />
          </View>
          <SubmitButton title='submit' />
        </AppForm>
      )}
      <TextLink
        text='I already have a account?'
        linkText='sign-in'
        link='login'
      />
      <TextLink
        text="I don't have a account?"
        linkText='Create Account'
        link='sign-up'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    marginVertical: 10,
  },
  containerCenter: {
    padding: 2,
    marginVertical: 8,
    flexDirection: 'row',
    borderRadius: 15,
    width: '100%',
    borderWidth: 1,
  },
  icon: {
    margin: 10,
  },

  input: {
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 10,
    height: 50,
    overflow: 'hidden',
  },
  text: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
    textDecorationLine: 'underline',
  },
});

export default ResetPwd;
