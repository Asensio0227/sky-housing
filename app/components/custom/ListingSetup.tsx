import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import AppForm from '../form/AppForm';
import FormImage from '../form/FormImage';
import FormInput from '../form/FormInput';
import FormSelector from '../form/FormSelector';
import SubmitButton from '../form/SubmitButton';

const ListingSetup: React.FC<{
  initialValues: any;
  onSubmit: any;
  validationSchema: any;
  edit?: boolean | any;
  title?: string;
}> = ({ initialValues, onSubmit, validationSchema, edit }) => {
  const arr = ['Apartments', 'Houses', 'Condos', 'Villas', 'Land'];

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
      style={styles.container}
    >
      <AppForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <FormImage name='photo' />
        <FormInput
          name='title'
          label='Title'
          placeholder='Enter title'
          icon='format-title'
        />
        <FormInput
          name='address'
          label='Address'
          placeholder='Enter address'
          icon='google-maps'
        />
        <FormInput
          name='description'
          label='Description'
          placeholder='Enter description'
          icon='card-text-outline'
          multiline={true}
        />
        <FormInput
          name='price'
          label='Price'
          placeholder='Enter price'
          icon='numeric'
          multiline={true}
        />
        <FormSelector name='category' options={arr} />
        <SubmitButton title={edit ? 'update' : 'create'} />
      </AppForm>
    </ScrollView>
  );
};

export default ListingSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    marginBottom: 28,
  },
});
