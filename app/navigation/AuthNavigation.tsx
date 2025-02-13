import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ResetPwd from '../screens/Auth/ResetPWD';
import SiginIn from '../screens/Auth/SiginIn';
import SignUp from '../screens/Auth/SignUp';
import VerifyEmail from '../screens/Auth/VerifyEmail';
import Welcome from '../screens/Auth/Welcome';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator initialRouteName='welcome'>
      <Stack.Screen name='sign-in' component={SiginIn} />
      <Stack.Screen name='sign-up' component={SignUp} />
      <Stack.Screen name='verify' component={VerifyEmail} />
      <Stack.Screen name='reset' component={ResetPwd} />
      <Stack.Screen
        options={{ headerShown: false }}
        name='welcome'
        component={Welcome}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
