import React from 'react';
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
  return <Rating stars={rating} maxStars={5} size={25} />;
};

export default AppRating;
