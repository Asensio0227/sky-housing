import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

function CommentsScreen() {
  const navigation: any = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => navigation.goBack()}>Dismiss</Button>
    </View>
  );
}

export default CommentsScreen;
