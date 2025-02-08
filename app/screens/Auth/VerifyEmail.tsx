import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MD2Colors, MD3Colors } from 'react-native-paper';
import * as Yup from 'yup';
import AppForm from '../../components/form/AppForm';
import FormInput from '../../components/form/FormInput';
import SubmitButton from '../../components/form/SubmitButton';
import TextLink from '../../components/TextLink';

const VerifyEmail = () => {
  const [resend, setRend] = useState(false);

  const handleChange = async (data: any) => {
    console.log(`====verify-email====`);
    console.log(data);
    console.log(`====verify-email====`);
  };

  const handleResend = () => {
    setRend(false);
    console.log('Resend clicked');
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {!resend ? (
        <>
          <AppForm
            initialValues={{ email: '', token: '' }}
            validationSchema={Yup.object().shape({
              token: Yup.string()
                .required('Please enter verification code.')
                .length(6, 'Code must be exactly 6 characters long'),
              email: Yup.string().email().required('Please enter your email.'),
            })}
            style={styles.inputContainer}
            onSubmit={handleChange}
          >
            <Text>Enter your code</Text>
            <FormInput
              name='email'
              icon='email'
              label='Email'
              placeholder='Email'
            />
            <FormInput
              name='token'
              icon='two-factor-authentication'
              placeholder='Code...'
            />

            <SubmitButton title='verify email' />
          </AppForm>
          <TextLink
            text='I forgot my password?'
            linkText='resend code'
            link='reset'
          />
        </>
      ) : (
        <AppForm
          initialValues={{ email: '', token: '' }}
          validationSchema={Yup.object().shape({
            token: Yup.string()
              .required('Please enter verification code.')
              .length(6, 'Code must be exactly 6 characters long'),
            email: Yup.string().email().required('Please enter your email.'),
          })}
          style={styles.inputContainer}
          onSubmit={handleChange}
        >
          <Text>Enter email to resend code</Text>
          <FormInput
            name='email'
            icon='email'
            label='Email'
            placeholder='Email'
          />
          <SubmitButton title='resend code' />
        </AppForm>
      )}
    </View>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: MD3Colors.primary30,
    textAlign: 'center',
    fontSize: 10,
    padding: 3,
    borderRadius: 5,
    width: '100%',
  },
  inputContainer: {
    color: MD2Colors.green200,
    backgroundColor: 'white',
    fontSize: 24,
    width: '90%',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: MD2Colors.green600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: MD2Colors.green200,
    paddingHorizontal: 20,
  },
});
