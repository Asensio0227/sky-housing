// import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Option } from '../components/custom/AppPicker';
import { UserDocument } from '../components/form/FormInput';
import { IPhoto, UIEstateDocument } from '../features/estate/types';

export function formatDate(rawDate: Date) {
  const date = new Date(rawDate);
  let year = date.getFullYear();
  let month: number | string = date.getMonth() + 1;
  let day: number | string = date.getDate();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
}

export const customData = (userData: UserDocument | any, profile?: boolean) => {
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
  Object.entries(contact_details).forEach(([key, value]) => {
    formData.append(`contact_details[${key}]`, value as any);
  });
  Object.entries(physical_address).forEach(([key, value]) => {
    formData.append(`physical_address[${key}]`, value as any);
  });

  const stringifyLocation = JSON.stringify(userAds_address);
  {
    !profile && formData.append(`userAds_address`, stringifyLocation);
  }
  {
    !profile && formData.append('password', userData.password);
  }
  formData.append('first_name', userData.first_name);
  formData.append('last_name', userData.last_name);
  formData.append('username', userData.username);
  formData.append('email', userData.email);
  formData.append('gender', userData.gender);
  formData.append('ideaNumber', userData.ideaNumber);
  formData.append('date_of_birth', userData.date_of_birth);
  {
    !profile && formData.append('expoToken', userData.expoToken);
  }
  formData.append('avatar', {
    uri: userData.avatar,
    name: 'uploaded_image.jpg',
    type: 'image/jpeg',
  } as any);

  return formData;
};

export const customD = (ads: UIEstateDocument | any) => {
  let contact_details = {
    address: ads.address,
  };
  const formData = new FormData();
  const stringifiedLocation = JSON.stringify(ads.location);
  if (ads.location) formData.append(`location`, stringifiedLocation);
  if (ads.address)
    Object.entries(contact_details).forEach(([key, value]: any) => {
      formData.append(`contact_details[${key}]`, value);
    });
  if (ads.title) formData.append('title', ads.title);
  if (ads.description) formData.append('description', ads.description);
  if (ads.price) formData.append('price', ads.price.toString());
  if (ads.category) formData.append('category', ads.category);
  if (ads.taken) formData.append('taken', ads.taken);

  if (ads.photo.length > 0)
    ads.photo.forEach((img: IPhoto | any, index: any) => {
      formData.append('media', {
        uri: img,
        name: 'uploaded_image.jpg' + index,
        type: 'image/jpeg',
      } as any);
    });

  return formData;
};

export const customMsg = (data: any) => {
  const formData: any = new FormData();

  // Append media types individually
  if (data.photo?.length) {
    formData.append('media', {
      uri: data.photo[0].uri,
      name: data.photo[0].fileName || 'photo.jpg',
      type: data.photo[0].type || 'image/jpeg',
    });
  }

  if (data.audio?.length) {
    formData.append('media', {
      uri: data.audio[0].uri,
      name: data.audio[0].fileName || 'audio.m4a',
      type: data.audio[0].type || 'audio/m4a',
    });
  }

  if (data.video?.length) {
    formData.append('media', {
      uri: data.video[0].uri,
      name: data.video[0].fileName || 'video.mp4',
      type: data.video[0].type || 'video/mp4',
    });
  }

  // Explicitly append text and roomId
  if (data.text) {
    formData.append('text', data.text);
  }

  if (data.roomId) {
    formData.append('roomId', data.roomId);
  }

  // Optionally append any generic files
  if (Array.isArray(data.files)) {
    data.files.forEach((file: any) => {
      formData.append('files', {
        uri: file.uri,
        name: file.fileName || file.name || 'file',
        type: file.type || 'application/octet-stream',
      });
    });
  }

  return formData;
};

export const formatArray = (data: any) => {
  const op: Option[] = data.map((item: string) => {
    return { label: item.charAt(0).toUpperCase() + item.slice(1), value: item };
  });

  return op;
};

export const pickMedia = async () => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    alert('Permission to access media is required!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    // mediaTypes: ImagePicker.All,
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled) {
    const asset = result.assets[0];

    return {
      uri: asset.uri,
      name: asset.fileName || 'file.jpg',
      type: asset.type === 'video' ? 'video/mp4' : 'image/jpeg', // adjust as needed
    };
  }
};

// export const resizeImage = async (uriArr: IPhoto[], width: number) => {
//   return Promise.all(
//     uriArr.map(async (img: IPhoto | any) => {
//       const { id, url } = img;
//       const { uri } = await ImageManipulator.manipulateAsync(
//         url,
//         [{ resize: { width, height: width / 2 } }],
//         { compress: 1, format: ImageManipulator.SaveFormat.PNG }
//       );
//       const uris = { uri, id };
//       return uris; // Returns the URI of the resized image
//     })
//   );
// };
