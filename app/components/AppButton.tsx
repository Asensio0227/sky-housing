import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AppText from './AppText';

const AppButton: React.FC<{
  title: string;
  style?: any;
  onPress: any;
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
  color = 'white',
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
      <AppText color={color} title={title} {...otherProps} />
    </Button>
  );
};

export default AppButton;

const styles = StyleSheet.create({});
