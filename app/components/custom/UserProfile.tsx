import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { UserDocument } from '../form/FormInput';

const UserProfile: React.FC<{ user: UserDocument | any; style?: any }> = ({
  user,
  style,
}) => {
  const time = moment().add(user.updatedAt, 'days').calendar();

  return (
    <View style={[styles.container, style]}>
      <View>
        {user.avatar ? (
          <Avatar.Image size={40} source={{ uri: user.avatar }} />
        ) : (
          <Avatar.Text
            size={40}
            label={
              user && user.username && user.username.charAt(0).toUpperCase()
            }
          />
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>{user.username}</Text>
        <Text style={styles.status}>
          {user.status === 'online' ? 'Online' : time}
        </Text>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    right: 35,
    marginLeft: 8,
  },
  section: {
    alignItems: 'center',
    marginRight: 25,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  text: {
    fontSize: 18,
  },
  status: {
    fontSize: 9,
  },
});
