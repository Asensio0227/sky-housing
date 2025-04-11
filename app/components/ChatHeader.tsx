import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

dayjs.extend(calendar);

const ChatHeader = () => {
  const { user } = useSelector((store: RootState) => store.AUTH);
  const route: any = useRoute();
  const room = route.params.room;
  const params = room.participants;
  const userB = params.filter((item: any) => item.id !== user.userId);
  const { avatar, username, status, updatedAt } = userB[0];
  const time = dayjs().add(updatedAt, 'day').calendar();

  return (
    <View style={styles.container}>
      <View>
        <Avatar.Image size={30} source={{ uri: avatar }} />
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>{username}</Text>
        <Text style={styles.status}>
          {status === 'online' ? 'Online' : time}
        </Text>
      </View>
    </View>
  );
};

export default ChatHeader;

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
    fontWeight: 'bold',
  },
  status: {
    fontSize: 9,
    color: 'gray',
  },
});
