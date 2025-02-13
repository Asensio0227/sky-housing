import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditProfile from '../screens/User/EditProfile';
import Profile from '../screens/User/Profile';

const Stack = createNativeStackNavigator();

const AccountNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName='profile'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='profile' component={Profile} />
      <Stack.Screen name='edit-profile' component={EditProfile} />
    </Stack.Navigator>
  );
};

export default AccountNavigation;
