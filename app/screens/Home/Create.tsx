import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RootEstateState } from '../../../store';
import ListingSetup from '../../components/custom/ListingSetup';
import UploadProgressBar from '../../components/custom/UploadProgressBar';
import AppForm from '../../components/form/AppForm';
import FormImage from '../../components/form/FormImage';
import FormInput from '../../components/form/FormInput';
import FormSelector from '../../components/form/FormSelector';
import SubmitButton from '../../components/form/SubmitButton';
import { createAd } from '../../features/estate/estateSlice';
import useLocation from '../../hooks/useLocation';

const validateSchema = Yup.object().shape({
  title: Yup.string().required(),
  category: Yup.string()
    .oneOf(
      ['Houses', 'Apartments', 'Villas', 'Condos', 'Land'],
      'Invalid category'
    )
    .required(),
  // photo: Yup.array().of(Yup.string()).required(),
  photo: Yup.array()
    .required('Please select a photo')
    .min(1, 'Please upload at least 1 media')
    .max(6, 'You have reach max upload 6'),
  description: Yup.string().required(),
  price: Yup.string().required(),
  address: Yup.string().required(),
});

const Create = () => {
  const navigation: any = useNavigation();
  const { isLoading } = useSelector((store: RootEstateState) => store.ESTATE);
  const dispatch: any = useDispatch();
  const [progress, setProgress] = useState(0);
  const { location } = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);

  if (location === undefined) {
    alert('Please await few minutes, network is slow');
    return;
  }
  const coordinates: any = location && location.coords ? location.coords : {};

  const onSubmit = async (
    data: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    setProgress(0);
    setUploadVisible(true);
    try {
      let location: any = { type: 'Point', coordinates: [] };
      const { longitude, latitude } = coordinates;

      if (longitude !== undefined && latitude !== undefined) {
        location.coordinates = [longitude, latitude];
      } else {
        console.log(
          'Coordinates are not available! Please allow app to use your location.'
        );
      }
      const listing = { ...data, location };
      const result = await dispatch(
        createAd({
          data: listing,
          onUploadProgress: (progress: number) => setProgress(progress),
        })
      );

      if (!result) {
        setUploadVisible(false);
        return alert(`Couldn't save the listing`);
      }
      resetForm();
      navigation.goBack();
    } catch (error: any) {
      console.log(`Error submitting data: ${error}`);
    } finally {
      setProgress(0);
      setUploadVisible(false);
    }
  };

  if (isLoading) {
    return (
      <UploadProgressBar uploadVisible={uploadVisible} progress={progress} />
    );
  }

  return (
    <ListingSetup
      initialValues={{
        title: '',
        category: '',
        photo: [],
        description: '',
        price: '',
        address: '',
      }}
      validationSchema={validateSchema}
      onSubmit={onSubmit}
    />
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    marginBottom: 10,
  },
});
