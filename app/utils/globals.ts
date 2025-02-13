// import * as ImageManipulator from 'expo-image-manipulator';

import { UserDocument } from '../components/form/FormInput';

export function formatDate(rawDate: Date) {
  const date = new Date(rawDate);
  let year = date.getFullYear();
  let month: number | string = date.getMonth() + 1;
  let day: number | string = date.getDate();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
}

export const customData = (userData: UserDocument | any) => {
  const {
    city,
    postal_code,
    street,
    country,
    province,
    phone_number,
    email,
    userAds_address,
  } = userData;
  const physical_address: any = {
    city,
    postal_code,
    street,
    country,
    province,
  };
  const contact_details: any = { phone_number, email };
  const formData = new FormData();
  // Append contact_details properties
  Object.entries(contact_details).forEach(([key, value]) => {
    formData.append(`contact_details[${key}]`, value as any);
  });

  // Append address properties
  Object.entries(physical_address).forEach(([key, value]) => {
    formData.append(`physical_address[${key}]`, value as any);
  });

  // Append userAds_address properties
  Object.entries(userAds_address).forEach(([key, value]: any) => {
    formData.append(`userAds_address[${key}]`, {
      type: value.type,
      coordinates: value,
    } as any);
  });
  formData.append('password', userData.password);
  formData.append('first_name', userData.first_name);
  formData.append('last_name', userData.last_name);
  formData.append('username', userData.username);
  formData.append('email', userData.email);
  formData.append('gender', userData.gender);
  formData.append('ideaNumber', userData.ideaNumber);
  formData.append('date_of_birth', userData.date_of_birth);
  formData.append('expoToken', userData.expoToken);
  formData.append('avatar', userData.avatar);

  return formData;
};

// export const resizeImage = async (uri: string) => {
//   const manipResult = await ImageManipulator.manipulateAsync(
//     uri,
//     [{ resize: { width: 200, height: 200 } }],
//     { compress: 1, format: ImageManipulator.SaveFormat.PNG }
//   );
//   return manipResult.uri; // Returns the URI of the resized image
// };
