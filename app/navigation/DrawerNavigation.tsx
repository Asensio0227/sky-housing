import { createDrawerNavigator } from '@react-navigation/drawer';
import { MD2Colors, MD3Colors } from 'react-native-paper';
import CustomDrawer from '../components/CustomDrawer';
import Profile from '../screens/User/Profile';
import ConversationNavigator from './ConversactionNavigation';
import TabNavigation from './TabNavigation';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitle: 'Sky house',
        headerStyle: { backgroundColor: MD2Colors.purple800 },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: 'white',
          textTransform: 'capitalize',
        },
        headerTitleAlign: 'center',
        // headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        options={{ drawerLabel: 'Home' }}
        name='home'
        component={TabNavigation}
      />
      <Drawer.Screen
        options={{ drawerLabel: 'Chats' }}
        name='conversation'
        component={ConversationNavigator}
      />
      <Drawer.Screen
        options={{ drawerLabel: 'Profile' }}
        name='profile'
        component={Profile}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
