import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootEstateState } from '../../../store';
import Estate from '../../components/Estate';
import EstateContainer from '../../components/EstateContainer';
import Screen from '../../components/custom/Screen';
import {
  handleChange,
  retrieveAllAds,
} from '../../features/estate/estateSlice';
import { UIEstateDocument } from '../../features/estate/types';
// import { resizeImage } from '../../utils/globals';
import debounce from 'lodash.debounce';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import Loading from '../../components/custom/Loading';

const width = Dimensions.get('window').width;

const Home = () => {
  const {
    search,
    isLoading,
    houses,
    numOfPages,
    page,
    featuredAds,
    sort,
    category,
  } = useSelector((store: RootEstateState) => store.ESTATE);
  const dispatch: any = useDispatch();
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  // const handleResize = async () => {
  //   const newUri = await resizeImage('your_image_uri_here');
  // };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          await dispatch(retrieveAllAds());
        } catch (error: any) {
          console.log(`Err fetching ads : ${error}`);
        }
      })();
    }, [search, page, sort, category])
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(retrieveAllAds());
    setIsRefreshing(false);
  };

  const handleSearch = debounce(
    () => dispatch(handleChange({ name: 'search', value: searchTerm })),
    5000
  );

  useEffect(() => {
    if (isLoading) return;
    handleSearch();
  }, [searchTerm]);

  if (isLoading) return <Loading />;

  return (
    <Screen style={{ flex: 1, overflow: 'scroll' }}>
      <Searchbar
        placeholder='Search'
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      <View style={{ flex: 1, top: 5 }}>
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
          pagingEnabled
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </Screen>
  );
};

export default Home;
