import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { Rating } from 'react-native-stock-star-rating';

const AppRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1 <= rating);
  // return (
  //   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //     {stars.map((isFilled, i) => {
  //       return isFilled ? (
  //         <AntDesign name='star' size={15} key={i} color={'gold'} />
  //       ) : (
  //         <AntDesign name='staro' size={15} key={i} color={'grey'} />
  //       );
  //     })}
  //   </View>
  // );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        style={{
          marginRight: 6,
          fontWeight: 'bold',
          fontSize: 14,
          color: '#333',
        }}
      >
        {rating.toFixed(1)}
      </Text>
      <Rating
        colorFilled='gold'
        colorUnfilled='#ccc'
        stars={rating}
        maxStars={5}
        size={25}
      />
    </View>
  );
};

export default AppRating;
