import React from 'react';
import { StyleSheet } from 'react-native';
import { MD2Colors, MD3Colors } from 'react-native-paper';
import AppText from '../custom/AppText';
import AppForm from './AppForm';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton';

const ResetInput: React.FC<{
  onPress: any;
  validateSchema: any;
  title: string;
  initialValues: any;
  subTitle: string;
}> = ({ onPress, validateSchema, initialValues, title, subTitle }) => {
  return (
    <AppForm
      initialValues={initialValues}
      validationSchema={validateSchema}
      style={styles.inputContainer}
      onSubmit={onPress}
    >
      <AppText
        style={{ fontSize: 15, textDecorationLine: 'underline' }}
        title={subTitle}
      />
      <FormInput name='email' icon='email' label='Email' placeholder='Email' />
      <SubmitButton title={title} />
    </AppForm>
  );
};

export default ResetInput;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: MD3Colors.primary30,
    textAlign: 'center',
    fontSize: 10,
    padding: 3,
    borderRadius: 5,
    width: '100%',
  },
  inputContainer: {
    color: MD2Colors.green200,
    fontSize: 24,
    width: '90%',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: MD2Colors.green200,
    paddingHorizontal: 20,
  },
});
