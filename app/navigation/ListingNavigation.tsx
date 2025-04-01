import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditListing from '../screens/Mylistings/EditListing';
import Listing from '../screens/Mylistings/Listing';
import Listings from '../screens/Mylistings/Listings';

const Stack = createNativeStackNavigator();

const MyListingNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerTitle: 'My Listings' }}
        name='MyListingScreen'
        component={Listings}
      />
      <Stack.Screen
        options={{ headerTitle: 'Edit Listing' }}
        name='editListing'
        component={EditListing}
      />
      <Stack.Screen
        options={{ headerTitle: 'Info' }}
        name='info'
        component={Listing}
      />
    </Stack.Navigator>
  );
};

export default MyListingNavigation;
