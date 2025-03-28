import React from 'react';
import { GestureResponderEvent, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AppText from './AppText';

const AppButton: React.FC<{
  title: string;
  style?: any;
  onPress: (e?: GestureResponderEvent) => void | any;
  mode?: any;
  icon?: any;
  [key: string]: any;
  color?: any;
}> = ({
  title,
  mode = 'contained',
  icon = 'account',
  onPress,
  style,
  color = 'black',
  ...otherProps
}) => {
  return (
    <Button
      icon={icon}
      mode={mode}
      onPress={onPress}
      style={[style, { marginVertical: 10 }]}
      {...otherProps}
    >
      <AppText style={styles} color={color} title={title} {...otherProps} />
    </Button>
  );
};

export default AppButton;

const styles = StyleSheet.create({});
