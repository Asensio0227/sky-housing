import { useFormikContext } from 'formik';
import React from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';

const SubmitButton: React.FC<{
  mode?: any;
  icon?: string;
  title?: string;
  style?: any;
  width?: any;
}> = ({
  mode = 'contained',
  icon = 'account',
  title = 'Submit',
  style,
  width = '100%',
}) => {
  const { handleSubmit } = useFormikContext();
  return (
    <Button
      icon={icon}
      mode={mode}
      onPress={() => handleSubmit}
      contentStyle={{ width }}
      style={style}
    >
      <Text style={{ fontFamily: 'OpenSans_600SemiBold' }}>{title}</Text>
    </Button>
  );
};

export default SubmitButton;
