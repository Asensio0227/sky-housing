import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from '../screens/Message/Chat';
import Chats from '../screens/Message/Chats';
import Contact from '../screens/Message/Contact';

const Stack = createNativeStackNavigator();

const ConversationNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='chats' component={Chats} />
      <Stack.Screen name='chat' component={Chat} />
      <Stack.Screen name='contact' component={Contact} />
    </Stack.Navigator>
  );
};

export default ConversationNavigator;
