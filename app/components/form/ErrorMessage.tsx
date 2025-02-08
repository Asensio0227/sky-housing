import React from 'react';
import { MD3Colors, Text } from 'react-native-paper';

const ErrorMessage: React.FC<{ visible: boolean; error: string }> = ({
  visible,
  error,
}) => {
  if (!visible || !error) return null;
  return (
    <Text variant='labelMedium' style={{ color: MD3Colors.error100 }}>
      {error}
    </Text>
  );
};

export default ErrorMessage;
