import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, MD2Colors } from 'react-native-paper';

const Comment: React.FC<{ item: any; reviews: any }> = ({ item, reviews }) => {
  if (reviews.length < 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: MD2Colors.grey400 }}>No comments yet?</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        left: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
        marginLeft: 10,
      }}
    >
      <View>
        {item.user.avatar ? (
          <Avatar.Image size={40} source={{ uri: item.user.avatar }} />
        ) : (
          <Avatar.Text
            size={40}
            label={
              item &&
              item.user &&
              item.user.first_name &&
              item.user.first_name.charAt(0).toUpperCase()
            }
          />
        )}
      </View>
      <View
        style={{
          backgroundColor: MD2Colors.grey400,
          borderRadius: 20,
          padding: 8,
          marginVertical: 5,
          marginLeft: 5,
          width: '80%',
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: MD2Colors.black,
            fontSize: 13,
            fontWeight: 'bold',
          }}
        >
          {item.comment}
        </Text>
      </View>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({});
