import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useState } from 'react';
import { Animated, Dimensions, Text, View } from 'react-native';
import { ActivityIndicator, Appbar, MD3Colors } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { RootEstateState } from '../../../store';
import Screen from '../../components/custom/Screen';
import Estate from '../../components/Estate';
import EstateContainer from '../../components/EstateContainer';
import { resetAds, retrieveAllAds } from '../../features/estate/estateSlice';

const width = Dimensions.get('window').width;

const Home = () => {
  const { isLoading, houses, hasMore, page, featuredAds, search, category } =
    useSelector((store: RootEstateState) => store.ESTATE);
  const dispatch: any = useDispatch();
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 50);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
  });
  const navigation: any = useNavigation();

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const handleScrollEndReached = () => {
    if (!isLoading && hasMore) {
      dispatch(retrieveAllAds());
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    dispatch(resetAds());
    await dispatch(retrieveAllAds());
    setIsRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          await dispatch(retrieveAllAds());
        } catch (error: any) {
          console.log(`Err fetching ads : ${error}`);
        }
      })();
    }, [dispatch])
    // }, [search, category, page, isLoading])
  );

  if (houses.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No listings available</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, overflow: 'scroll', position: 'relative' }}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Appbar.Header>
          <Appbar.Content
            title='Your Next Home Awaits!'
            subtitle={'Subtitle'}
          />
          <Appbar.Action
            icon='magnify'
            onPress={() => navigation.navigate('search')}
          />
        </Appbar.Header>
      </Animated.View>
      <View style={{ flex: 1 }}>
        <FlashList
          data={houses}
          ListHeaderComponent={
            featuredAds && (
              <>
                <Carousel
                  ref={ref}
                  autoPlay
                  width={width}
                  height={width / 2}
                  data={featuredAds}
                  scrollAnimationDuration={5000}
                  style={{ marginTop: 2 }}
                  onProgressChange={progress}
                  renderItem={({ item }) => (
                    <Estate key={item._id} items={item} />
                  )}
                />
                <Pagination.Basic
                  progress={progress}
                  data={featuredAds}
                  dotStyle={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 50,
                  }}
                  containerStyle={{ gap: 5, marginTop: 10 }}
                  onPress={onPressPagination}
                />
              </>
            )
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EstateContainer items={item} />}
          estimatedItemSize={200}
          scrollEnabled
          onScroll={(e) => scrollY.setValue(e.nativeEvent.contentOffset.y)}
          pagingEnabled
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={true}
          onEndReached={handleScrollEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            !hasMore ? (
              <Text style={{ color: MD3Colors.primary60 }}>
                No more data....
              </Text>
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
    </View>
  );
};

export default Home;
