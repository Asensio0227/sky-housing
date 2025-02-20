import React from 'react';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import { MD2Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RootState } from '../../../store';
import AppText from '../../components/AppText';
import Form from '../../components/form/AppForm';
import Input, { UserDocument } from '../../components/form/FormInput';
import SubmitButton from '../../components/form/SubmitButton';
import Loading from '../../components/Loading';
import TextLink from '../../components/TextLink';
import { signInUser } from '../../features/auth/authSlice';
import useLocation from '../../hooks/useLocation';
import useNotifications from '../../hooks/useNotifications';

const validateSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  userAds_address: Yup.object().shape({
    coordinates: Yup.array(),
  }),
  expoToken: Yup.string(),
});

const SiginIn = () => {
  const { isLoading } = useSelector((store: RootState) => store.AUTH);
  const dispatch: any = useDispatch();
  const { expoPushToken } = useNotifications();
  const { location } = useLocation();

  if (expoPushToken === undefined && location === undefined) {
    alert('Please await few minutes, network is slow');
    return;
  }

  const onSubmit = async (data: UserDocument) => {
    try {
      let userAds_address: any = { type: 'Point', coordinates: [] };
      const coordinates: any =
        location && location.coords ? location.coords : {};
      const { longitude, latitude } = coordinates;
      if (longitude !== undefined && latitude !== undefined) {
        userAds_address.coordinates = [longitude, latitude];
      } else {
        console.log(
          'Coordinates are not available! Please allow app to use your location.'
        );
      }
      data.expoToken = expoPushToken;
      const userData = { ...data, userAds_address };
      await dispatch(signInUser(userData));
    } catch (error: any) {
      console.log(`Error logging in: ${error.message}`);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <ScrollView>
      <View style={styles.container}>
        <AppText style={styles.text} title='Sign in' />
        <Form
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={validateSchema}
          onSubmit={onSubmit}
          style={styles.form}
        >
          <Input
            name='username'
            label='Username'
            placeholder='Enter your username'
            icon='account'
          />
          <Input
            name='password'
            label='Password'
            placeholder='Enter your password'
            icon='lock'
            secureTextEntry
          />
          <SubmitButton title='Sign-in' />
          <View>
            <TextLink
              text="I don't have an account?"
              linkText='Create Account'
              link='sign-up'
            />
            <TextLink
              text='I forgot my password?'
              linkText='Reset password?'
              link='reset'
            />
          </View>
        </Form>
      </View>
    </ScrollView>
  );
};

export default SiginIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginVertical: 20,
  },
  form: {
    color: MD2Colors.green200,
    fontSize: 24,
    width: '90%',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: { fontSize: 18, textDecorationLine: 'underline' },
});
