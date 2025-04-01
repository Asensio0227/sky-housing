import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CommentsScreen from '../screens/Home/Comments';
import Details from '../screens/Home/Details';
import Home from '../screens/Home/Home';
import Search from '../screens/Home/Search';

const Stack = createNativeStackNavigator();

const HomeNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName='listings'
    >
      <Stack.Group>
        <Stack.Screen name='listings' component={Home} />
        <Stack.Screen name='details' component={Details} />
        <Stack.Screen name='search' component={Search} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{ presentation: 'containedTransparentModal' }}
      >
        <Stack.Screen name='comments' component={CommentsScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default HomeNavigation;
