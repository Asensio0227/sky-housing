import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

function ChatFileTransfer({ filePath }: { filePath: any }) {
  var fileType = '';
  var name = '';
  if (filePath !== undefined) {
    name = filePath.split('/').pop();
    fileType = filePath.split('.').pop();
  }
  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image
          source={
            fileType === 'pdf'
              ? require('../assets/urban-city.jpg')
              : require('../assets/user-icon.png')
          }
          style={{ height: 60, width: 60 }}
        />
        <View>
          <Text style={styles.text}>
            {name.replace('%20', '').replace(' ', '')}
          </Text>
          <Text style={styles.textType}>{fileType.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    borderRadius: 15,
    padding: 5,
  },
  text: {
    color: 'black',
    marginTop: 10,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  textType: {
    color: 'black',
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  frame: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 5,
    marginTop: -4,
  },
});

export default ChatFileTransfer;
