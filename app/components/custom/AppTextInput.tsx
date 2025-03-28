import React from 'react';
import { TextInput } from 'react-native-paper';

const AppTextInput: React.FC<{
  value: string | any;
  icon?: string;
  label?: string;
  placeholder?: string;
  mode?: any;
  style?: any;
  [key: string]: any;
}> = ({
  value,
  icon = 'email',
  label,
  placeholder,
  mode = 'text',
  style,
  ...otherProps
}) => {
  return (
    <TextInput
      value={value}
      mode={mode}
      label={label}
      placeholder={placeholder}
      right={<TextInput.Icon icon={icon} />}
      style={style}
      {...otherProps}
    />
  );
};

export default AppTextInput;
