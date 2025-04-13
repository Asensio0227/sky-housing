import { StyleSheet } from 'react-native';
import { MD2Colors, MD3Colors } from 'react-native-paper';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rightMessage: {
    alignSelf: 'flex-end',
    backgroundColor: MD3Colors.primary40,
    padding: 8,
    borderRadius: 10,
    margin: 4,
    maxWidth: '80%',
    color: MD2Colors.grey200,
  },
  leftMessage: {
    alignSelf: 'flex-start',
    backgroundColor: MD3Colors.primary70,
    padding: 8,
    borderRadius: 10,
    margin: 4,
    maxWidth: '80%',
    color: MD2Colors.white,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  caption: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
});
