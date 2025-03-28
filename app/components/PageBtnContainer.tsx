import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

const PageBtnContainer: React.FC<{
  page: number;
  numOfPages: number;
  handlePress: (value: any) => void | any;
}> = ({ page, numOfPages, handlePress }) => {
  const dispatch: any = useDispatch();
  let pages = [];
  pages.push(1);

  if (page > 3) {
    pages.push('...');
  }

  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(numOfPages - 1, page + 1);
    i++
  ) {
    pages.push(i);
  }

  if (page < numOfPages - 2) {
    pages.push('...');
  }

  if (numOfPages > 1) {
    pages.push(numOfPages);
  }

  const prevBtn = () => {
    let newPage = page - 1;
    if (newPage < 1) {
      newPage = numOfPages;
    }
    dispatch(handlePress(newPage));
  };

  const nextBtn = () => {
    let newPage = page + 1;
    if (newPage > numOfPages) {
      newPage = 1;
    }
    dispatch(handlePress(newPage));
  };

  return (
    <View style={styles.container}>
      <Pressable style={[styles.btn, styles.prevBtn]}>
        PageBtnContainer
      </Pressable>
    </View>
  );
};

export default PageBtnContainer;

const styles = StyleSheet.create({
  btn: {},
  container: {},
  prevBtn: {},
});
