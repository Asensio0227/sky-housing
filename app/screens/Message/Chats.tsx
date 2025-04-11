import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  MD2Colors,
  MD3Colors,
  Text,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootChatsState, RootState } from '../../../store';
import ContactPerson from '../../components/ContactPerson';
import Screen from '../../components/custom/Screen';
import {
  resetConversations,
  retrieveUserConversation,
} from '../../features/chats/chatsSlice';

const Chats = () => {
  const { conversations, hasMore, isLoading } = useSelector(
    (store: RootChatsState) => store.Chats
  );
  const { user } = useSelector((store: RootState) => store.AUTH);
  const dispatch: any = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchChats = async () => {
    try {
      await dispatch(retrieveUserConversation());
    } catch (error: any) {
      console.log(`Err fetching ads : ${error}`);
    }
  };

  // useFocusEffect(
  useEffect(() => {
    fetchChats();
  }, [dispatch, user]);
  // );

  const handleScrollEndReached = async () => {
    try {
      await dispatch(retrieveUserConversation());
    } catch (error: any) {
      console.log(`Err fetching ads : ${error}`);
    }
  };

  const onRefresh = async () => {
    try {
      dispatch(resetConversations());
      await dispatch(retrieveUserConversation());
    } catch (error: any) {
      console.log(`Err fetching ads : ${error}`);
    }
  };

  if (conversations.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No chats yet!</Text>
        <Button onPress={fetchChats}>Refresh</Button>
      </View>
    );
  }
  return (
    <View style={styles.section}>
      <FlashList
        data={conversations}
        keyExtractor={(item: any) => item._id || item.id}
        renderItem={({ item }) => (
          <ContactPerson
            description={item.lastMessage?.text}
            style={{ marginTop: 7 }}
            room={item}
            time={item.lastMessage}
            user={item.userB}
          />
        )}
        estimatedItemSize={200}
        scrollEnabled
        pagingEnabled
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsVerticalScrollIndicator={true}
        onEndReached={handleScrollEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          !hasMore ? (
            <Text style={styles.textFetch}>No more data....</Text>
          ) : (
            isLoading && (
              <Screen style={{ padding: 1, marginVertical: 20 }}>
                <ActivityIndicator size='small' />
              </Screen>
            )
          )
        }
      />
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    flex: 1,
    padding: 5,
    paddingRight: 10,
  },
  text: {
    fontSize: 25,
    textDecorationLine: 'underline',
    color: MD2Colors.grey400,
  },
  textFetch: {
    color: MD3Colors.primary60,
    textAlign: 'center',
  },
});
