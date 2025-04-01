import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootEstateState } from '../../../store';
import AppPicker from '../../components/custom/AppPicker';
import Loading from '../../components/custom/Loading';
import EstateContainer from '../../components/EstateContainer';
import {
  handleChange,
  resetAds,
  retrieveFilterAds,
} from '../../features/estate/estateSlice';
import { formatArray } from '../../utils/globals';

const Search = () => {
  const { search, isLoading, filteredHouses, sort, category, categoryOptions } =
    useSelector((store: RootEstateState) => store.ESTATE);
  const [cateType, setCateType] = useState(category);
  const cateOptions = formatArray(categoryOptions);
  const dispatch: any = useDispatch();
  const [searchTerm, setSearchTerm] = useState(search);

  const handleSearch = debounce(() => {
    dispatch(handleChange({ name: 'search', value: searchTerm }));
  }, 5000);

  useEffect(() => {
    if (isLoading) return;
    dispatch(handleChange({ name: 'category', value: cateType }));
    dispatch(resetAds());
  }, [cateType, isLoading, dispatch]);

  useEffect(() => {
    if (isLoading) return;
    handleSearch();
    dispatch(resetAds());
  }, [searchTerm, isLoading, dispatch]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          await dispatch(retrieveFilterAds());
        } catch (error: any) {
          console.log(`Err fetching ads : ${error}`);
        }
      })();
    }, [sort, category, search, dispatch])
  );

  if (isLoading) return <Loading />;

  return (
    <View style={{ flex: 1, overflow: 'scroll', position: 'relative' }}>
      <Searchbar
        placeholder='Search'
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      <AppPicker
        label='Category'
        items={cateOptions}
        selectedValue={cateType}
        onValueChange={(value) => setCateType(value)}
      />
      <View style={{ flex: 1 }}>
        {filteredHouses?.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Nothing Found!</Text>
          </View>
        ) : (
          <FlashList
            data={filteredHouses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EstateContainer items={item} />}
            estimatedItemSize={200}
            scrollEnabled
            pagingEnabled
            contentContainerStyle={{ paddingHorizontal: 10 }}
            showsVerticalScrollIndicator={true}
          />
        )}
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
