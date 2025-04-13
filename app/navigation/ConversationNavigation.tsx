import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatHeader from '../components/ChatHeader';
import Chat from '../screens/Message/Chat';
import Chats from '../screens/Message/Chats';

const Stack = createNativeStackNavigator();

const ConversationNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name='chats'
        component={Chats}
      />
      <Stack.Screen
        options={{ headerTitle: (props: any) => <ChatHeader {...props} /> }}
        name='chat'
        component={Chat}
      />
    </Stack.Navigator>
  );
};

export default ConversationNavigator;
