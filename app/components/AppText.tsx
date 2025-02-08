import React from 'react';
import { StyleSheet } from 'react-native';
import { MD2Colors, Text } from 'react-native-paper';

const AppText: React.FC<{
  title: string;
  style?: any;
  variant?: any;
  color?: any;
  [key: string]: any;
}> = ({
  title,
  style,
  variant = 'headlineMedium',
  color = MD2Colors.purple300,
  ...otherProps
}) => {
  return (
    <Text
      variant={variant}
      style={[styles.text, style, { color: color }]}
      {...otherProps}
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '900',
    paddingVertical: 20,
    fontFamily: ' OpenSans_700Bold_Italic,',
  },
});

export default AppText;
