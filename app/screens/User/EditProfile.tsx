import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RootState } from '../../../store';
import { UserDocument } from '../../components/form/FormInput';
import Loading from '../../components/Loading';
import Setup from '../../components/Setup';
import { updateUser } from '../../features/auth/authSlice';

const validateSchema = Yup.object().shape({
  avatar: Yup.string().required('UserProfile is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email().required('Email is required'),
  phone_number: Yup.string()
    .matches(
      /(?:(?<internationCode>\+[1-9]{1,4})[ -])?\(?(?<areacode>\d{2,3})\)?[ -]?(\d{3})[ -]?(\d{4})/,
      'Invalid phone number'
    )
    .required('Phone number is required!'),
  date_of_birth: Yup.date().required('Date of birth is required').nullable(),
  gender: Yup.string().required('Gender is required'),
  street: Yup.string().required('Street is required'),
  city: Yup.string().required('City is required'),
  province: Yup.string().required('Province is required'),
  postal_code: Yup.string().required('Postal code is required'),
  country: Yup.string().required('Country is required'),
  ideaNumber: Yup.string().required('Idea number is required'),
});

const EditProfile = () => {
  const router = useRoute();
  const user: UserDocument | any = router.params;
  const navigation: any = useNavigation();
  const dispatch: any = useDispatch();
  const { isLoading } = useSelector((store: RootState) => store.AUTH);

  const handleUpdate = async ({ item }: { item: UserDocument }) => {
    try {
      const result = await dispatch(updateUser(item));
      console.log(`===result====`);
      console.log(result);
      console.log(`===result====`);
    } catch (error: any) {
      console.log(`Error while updating user: ${error}`);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Setup
      initialValues={{
        avatar: user?.avatar || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        username: user?.username || '',
        email: user?.email || '',
        gender: user?.gender || '',
        date_of_birth: user?.date_of_birth || '',
        phone_number: user?.contact_details.phone_number || '',
        street: user?.physical_address.street || '',
        city: user?.physical_address.city || '',
        province: user?.physical_address.province || '',
        postal_code: user?.physical_address.postal_code || '',
        country: user?.physical_address.country || '',
        ideaNumber: user.ideaNumber || '',
      }}
      validationSchema={validateSchema}
      onSubmit={handleUpdate}
      title='Update Account'
      edit={true}
    />
  );
};

export default EditProfile;
