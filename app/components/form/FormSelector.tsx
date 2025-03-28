import { useFormikContext } from 'formik';
import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { MD3Colors, TextInput } from 'react-native-paper';
import AppTextInput from '../custom/AppTextInput';

const FormSelector: React.FC<{ name: any; options: any }> = ({
  options,
  name,
}) => {
  const [text, setText] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const { values, setFieldTouched, setFieldValue }: any = useFormikContext();
  return (
    <TouchableWithoutFeedback accessible={false}>
      <View style={styles.container}>
        <AppTextInput
          value={values[name]}
          label='Category'
          right={
            <TextInput.Icon
              icon='chevron-down'
              onPress={() => setVisible(!visible)}
            />
          }
        />
        {visible && (
          <View>
            {options.map((option: string, index: any) => {
              return (
                <Text
                  key={index}
                  onPress={() => {
                    setFieldValue(name, option);
                    setVisible(false);
                  }}
                  style={styles.title}
                >
                  {option}
                </Text>
              );
            })}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FormSelector;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 10,
  },
  title: {
    padding: 10,
    color: MD3Colors.primary30,
    fontSize: 16,
    fontWeight: '500',
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
  },
});
