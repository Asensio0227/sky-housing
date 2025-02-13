import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Estate from '../../components/Estate';
import EstateContainer from '../../components/EstateContainer';
import Screen from '../../components/Screen';
import { UIEstateDocument } from '../../features/estate/types';
import { resizeImage } from '../../utils/globals';

const data: UIEstateDocument[] = [
  {
    id: '122',
    title: 'rental apartment',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi voluptatem aperiam soluta. Iure facilis quam hic, omnis consectetur aperiam delectus esse expedita ipsam provident tempora dignissimos officia laboriosam? Commodi sint qui laborum illo, in illum vel temporibus consectetur iure quo maxime rerum ut itaque veritatis mollitia quisquam expedita nesciunt! Omnis?',
    price: 500,
    photo: [
      { id: '1243', url: '../../assets/urban-city.jpg' },
      { id: '1232', url: '../../assets/urban-city.jpg' },
    ],
    category: 'apartment',
    location: 'New York, USA',
    average_rating: 4.5,
    user: 'John Doe',
    numOfReviews: 1,
    featured: true,
    createdAt: '2022-01-01',
    contact_details: {
      phone: '+1 123-456-7890',
      email: 'john.doe@example.com',
      address: '123 Main St, New York, USA',
    },
  },
  {
    id: '132',
    title: 'house for sale',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi voluptatem aperiam soluta. Iure facilis quam hic, omnis consectetur aperiam delectus esse expedita ipsam provident tempora dignissimos officia laboriosam? Commodi sint qui laborum illo, in illum vel temporibus consectetur iure quo maxime rerum ut itaque veritatis mollitia quisquam expedita nesciunt! Omnis?',
    price: 500,
    photo: [
      { id: '12443', url: '../../assets/urban-city.jpg' },
      { id: '12352', url: '../../assets/urban-city.jpg' },
    ],
    category: 'apartment',
    location: 'New York, USA',
    average_rating: 4.5,
    user: 'John Doe',
    numOfReviews: 1,
    featured: true,
    createdAt: '2022-01-01',
    contact_details: {
      phone: '+1 123-456-7890',
      email: 'john.doe@example.com',
      address: '123 Main St, New York, USA',
    },
  },
  {
    id: '1262',
    title: 'villas',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi voluptatem aperiam soluta. Iure facilis quam hic, omnis consectetur aperiam delectus esse expedita ipsam provident tempora dignissimos officia laboriosam? Commodi sint qui laborum illo, in illum vel temporibus consectetur iure quo maxime rerum ut itaque veritatis mollitia quisquam expedita nesciunt! Omnis?',
    price: 500,
    photo: [
      { id: '124543', url: '../../assets/urban-city.jpg' },
      { id: '1245332', url: '../../assets/urban-city.jpg' },
    ],
    category: 'apartment',
    location: 'New York, USA',
    average_rating: 4.5,
    user: 'John Doe',
    numOfReviews: 1,
    featured: false,
    createdAt: '2022-01-01',
    contact_details: {
      phone: '+1 123-456-7890',
      email: 'john.doe@example.com',
      address: '123 Main St, New York, USA',
    },
  },
  {
    id: '132635',
    title: 'condos',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi voluptatem aperiam soluta. Iure facilis quam hic, omnis consectetur aperiam delectus esse expedita ipsam provident tempora dignissimos officia laboriosam? Commodi sint qui laborum illo, in illum vel temporibus consectetur iure quo maxime rerum ut itaque veritatis mollitia quisquam expedita nesciunt! Omnis?',
    price: 500,
    photo: [
      { id: '124rq4tgrcq43', url: '../../assets/urban-city.jpg' },
      { id: '123cg3g52', url: '../../assets/urban-city.jpg' },
    ],
    category: 'apartment',
    location: 'New York, USA',
    average_rating: 4.5,
    user: 'John Doe',
    numOfReviews: 1,
    featured: false,
    createdAt: '2022-01-01',
    contact_details: {
      phone: '+1 123-456-7890',
      email: 'john.doe@example.com',
      address: '123 Main St, New York, USA',
    },
  },
];

const Home = () => {
  const [search, setSearch] = useState('');

  const handleResize = async () => {
    const newUri = await resizeImage('your_image_uri_here');
  };

  const featuredArr = data.filter((item) => item.featured === true);

  const handleChane = () => {};
  return (
    <Screen style={{ flex: 1, overflow: 'scroll' }}>
      <Searchbar
        placeholder='Search'
        onChangeText={handleChane}
        value={search}
      />
      <View style={{ flex: 1, top: 5 }}>
        <FlashList
          data={featuredArr}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Estate key={item.id} items={item} />}
          estimatedItemSize={200}
          scrollEnabled
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={true}
          ListFooterComponent={<View style={{ height: 100 }} />}
          horizontal
        />
        <FlashList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EstateContainer items={item} />}
          estimatedItemSize={200}
          scrollEnabled
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={true}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </View>
    </Screen>
  );
};

export default Home;

const styles = StyleSheet.create({});
