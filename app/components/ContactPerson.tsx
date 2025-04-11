import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import React from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Avatar, MD2Colors, MD3Colors, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootChatsState } from '../../store';
import { removeRoom, resetConversations } from '../features/chats/chatsSlice';
import Loading from './custom/Loading';
dayjs.extend(calendar);

type ContactPersonProps = {
  description?: string;
  user?: {
    username?: string;
    fName?: string;
    avatar?: string;
  };
  style?: ViewStyle;
  time?: Date | { createdAt?: string };
  room?: { _id: string };
  image?: any;
};

const ContactPerson: React.FC<ContactPersonProps> = ({
  description,
  user,
  style,
  time,
  room,
  image,
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const { isLoading } = useSelector((store: RootChatsState) => store.Chats);

  const deleteChat = async () => {
    try {
      const id = room?._id;
      if (id) {
        await dispatch(removeRoom(id));
        dispatch(resetConversations());
      }
    } catch (error) {
      console.log('Error deleting chat:', error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('chat', { user, room, image })}
      onLongPress={() =>
        Alert.alert('Chat', 'Are you sure you want to delete chat?', [
          { text: 'Yes', onPress: deleteChat },
          { text: 'No', style: 'cancel' },
        ])
      }
      style={[style, styles.container]}
    >
      <View style={styles.row}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Avatar.Image size={65} source={{ uri: user.avatar }} />
          ) : (
            <Avatar.Text
              size={40}
              label={user?.username?.charAt(0).toUpperCase() || '?'}
            />
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.rowBetween}>
            <Text style={styles.text}>
              {user?.username || user?.fName || 'Unknown'}
            </Text>
            {time?.createdAt && (
              <Text style={styles.time}>
                {dayjs(time.createdAt).calendar()}
              </Text>
            )}
          </View>
          {description && (
            <Text style={styles.desc} numberOfLines={1}>
              {description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContactPerson;

const styles = StyleSheet.create({
  container: {
    backgroundColor: MD3Colors.primary10,
    height: 80,
    padding: 5,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  desc: {
    color: MD2Colors.grey200,
    fontSize: 15,
    marginTop: 2,
  },
  text: {
    color: MD2Colors.grey300,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  time: {
    color: MD2Colors.grey100,
    fontSize: 12,
    marginTop: 5,
  },
});
