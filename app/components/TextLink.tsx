import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MD2DarkTheme } from 'react-native-paper';
import AppText from './AppText';

const TextLink: React.FC<{ text: string; linkText: string; link: any }> = ({
  text,
  linkText,
  link,
}) => {
  // const navigation: any = useNavigation();

  return (
    <View style={styles.formContainer}>
      <AppText style={styles.formText} title={text} />
      <Pressable
        onPress={() => {
          // navigation.navigate(link);
          console.log(link);
        }}
      >
        <AppText style={styles.link} title={linkText} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
  formText: {
    marginRight: 5,
    textAlign: 'center',
  },
  link: {
    color: MD2DarkTheme.colors.primary,
    textDecorationLine: 'underline',
  },
});

export default TextLink;
