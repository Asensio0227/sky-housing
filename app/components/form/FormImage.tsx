import { useFormikContext } from 'formik';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ImageInput from '../ImageInput';
import ImageList from '../ImageList';
import ErrorMessage from './ErrorMessage';

const FormImage: React.FC<{ name: string; photoUrl?: any }> = ({
  name,
  photoUrl,
}) => {
  const { errors, setFieldValue, touched, values }: any = useFormikContext();
  const imageUris = values[name];

  const handleAdd = (uri: string) => {
    setFieldValue(name, [...imageUris, uri]);
  };

  const handleRemove = (uri: string) => {
    setFieldValue(
      name,
      imageUris.filter((imageUri: string) => imageUri !== uri)
    );
  };

  return (
    <>
      {photoUrl ? (
        <>
          <ImageInput
            imageUri={imageUris}
            onChangeImage={(uri: string) => setFieldValue(name, uri)}
          />
          <ErrorMessage error={errors[name]} visible={touched[name]} />
        </>
      ) : (
        <>
          <ImageList
            imageUris={imageUris}
            onAddImage={handleAdd}
            onRemoveImage={handleRemove}
          />
          <ErrorMessage visible={touched[name]} error={errors[name]} />
        </>
      )}
    </>
  );
};

export default FormImage;

const styles = StyleSheet.create({});
