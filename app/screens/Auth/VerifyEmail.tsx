import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MD2Colors, MD2DarkTheme, MD3Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RootState } from '../../../store';
import AppButton from '../../components/custom/AppButton';
import AppText from '../../components/custom/AppText';
import Loading from '../../components/custom/Loading';
import AppForm from '../../components/form/AppForm';
import FormInput from '../../components/form/FormInput';
import ResetInput from '../../components/form/ResetInput';
import SubmitButton from '../../components/form/SubmitButton';
import { resendAccountCode, verifyEmail } from '../../features/auth/authSlice';

const VerifyEmail = () => {
  const [resend, setResend] = useState(false);
  const navigation: any = useNavigation();
  const dispatch: any = useDispatch();
  const { isLoading } = useSelector((store: RootState) => store.AUTH);

  const toggleBtn = () => setResend(!resend);

  const handleChange = async (data: any) => {
    try {
      await dispatch(verifyEmail(data));
    } catch (error: any) {
      console.log(`Error submitting code: ${error.message}`);
    } finally {
      navigation.navigate('welcome');
    }
  };

  const handleResend = async (email: string) => {
    try {
      await dispatch(resendAccountCode(email));
    } catch (error: any) {
      console.log(`Error submitting code: ${error.message}`);
    } finally {
      setResend(false);
    }
  };

  if (isLoading) return <Loading />;

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
            <AppText
              style={{ fontSize: 15, textDecorationLine: 'underline' }}
              title='Enter your code'
            />
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
          <View>
            <AppButton
              title="i haven't received code? resend code"
              onPress={toggleBtn}
              mode='text'
              style={{
                color: MD2DarkTheme.colors.primary,
                textDecorationLine: 'underline',
              }}
            />
          </View>
        </>
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}
        >
          <ResetInput
            initialValues={{ email: '' }}
            validateSchema={Yup.object().shape({
              email: Yup.string().email().required('Please enter your email.'),
            })}
            onPress={handleResend}
            title='resend code'
            subTitle='Enter email to resend code'
          />
          <AppButton
            title='Go back to verify email'
            onPress={toggleBtn}
            mode='text'
            style={{
              color: MD2DarkTheme.colors.primary,
              textDecorationLine: 'underline',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          />
        </View>
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
    fontSize: 24,
    width: '90%',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: MD2Colors.green200,
    paddingHorizontal: 20,
  },
});
