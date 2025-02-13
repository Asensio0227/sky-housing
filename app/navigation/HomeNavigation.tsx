import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Details from '../screens/Home/Details';
import Home from '../screens/Home/Home';

const Stack = createNativeStackNavigator();

const HomeNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName='listings'
    >
      <Stack.Screen name='listings' component={Home} />
      <Stack.Screen name='details' component={Details} />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
