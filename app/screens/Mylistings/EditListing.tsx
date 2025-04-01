import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RootEstateState } from '../../../store';
import ListingSetup from '../../components/custom/ListingSetup';
import Loading from '../../components/custom/Loading';
import { updateAd } from '../../features/estate/estateSlice';
import { IPhoto, UIEstateDocument } from '../../features/estate/types';
import useLocation from '../../hooks/useLocation';

const validateSchema = Yup.object().shape({
  title: Yup.string().required(),
  category: Yup.string()
    .oneOf(
      ['Houses', 'Apartments', 'Villas', 'Condos', 'Land'],
      'Invalid category'
    )
    .required(),
  photo: Yup.array()
    .required('Please select a photo')
    .min(1, 'Please upload at least 1 media')
    .max(6, 'You have reach max upload 6'),
  description: Yup.string().required(),
  price: Yup.string().required(),
  address: Yup.string().required(),
});

const EditListing = () => {
  const router = useRoute();
  const item: UIEstateDocument | any = router.params;
  const dispatch: any = useDispatch();
  const { isLoading } = useSelector((store: RootEstateState) => store.ESTATE);
  const { location } = useLocation();
  const navigation: any = useNavigation();

  if (location === undefined) {
    alert('Please await few minutes, network is slow');
    return;
  }
  const coordinates: any = location && location.coords ? location.coords : {};

  const onSubmit = async (data: any) => {
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
      const id = item._id;
      const state = { ...data, id, location };
      await dispatch(updateAd(state));
      navigation.goBack();
    } catch (error: any) {
      console.log(`Error while updating state: ${error}`);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <ListingSetup
      initialValues={{
        title: item?.title || '',
        category: item?.category || '',
        description: item?.description || '',
        photo: item?.photo
          ? item.photo.map((photoItem: IPhoto) => photoItem.url)
          : [],
        price: item?.price.toString() || '',
        address: item?.contact_details.address || '',
      }}
      validationSchema={validateSchema}
      onSubmit={onSubmit}
      edit
    />
  );
};

export default EditListing;

const styles = StyleSheet.create({});
