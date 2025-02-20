import { useFormikContext } from 'formik';
import React from 'react';
import { TextInput } from 'react-native-paper';
import AppTextInput from '../AppTextInput';
import ErrorMessage from './ErrorMessage';

export enum statusOption {
  online = 'online',
  offline = 'offline', // Changed from Offline to offline
}

export interface Location {
  type: 'Point';
  coordinates: number[];
}

export interface modalTypes {
  type: String;
  required?: [true, string];
  minlength?: number;
  maxlength?: number;
  trim?: true;
  unique?: true;
  validate?: {
    validator: (str: string, options?: any) => boolean;
    message: string;
  };
}

export interface addressOb {
  street: modalTypes;
  city: modalTypes;
  province: modalTypes;
  postal_code: modalTypes;
  country: modalTypes;
}

export interface ContactOb {
  phone_number: modalTypes;
  email: modalTypes;
}

export interface UIUser {
  first_name: modalTypes;
  last_name: modalTypes;
  email: modalTypes | string;
  username: modalTypes | string;
  gender: modalTypes;
  ideaNumber: modalTypes;
  role: modalTypes;
  status: statusOption.offline;
  date_of_birth: modalTypes;
  address: addressOb;
  contact_details: ContactOb;
  userAds_address: Location;
}

export interface UserDocument extends UIUser {
  password: string;
  verificationToken: number | string;
  avatar: string;
  expoToken: string;
  banned: boolean;
  isVerified: boolean;
  passwordToken: number | null;
  passwordTokenExpirationDate: Date | null;
  verified: Date | number;
  createdAt: Date;
  updatedAT: Date;
}

const FormInput: React.FC<{
  name: string | any;
  icon?: string;
  label?: string;
  placeholder?: string;
  mode?: any;
  style?: any;
  [key: string]: any;
}> = ({
  name,
  icon = 'email',
  label,
  placeholder,
  mode = 'outline',
  style,
  ...otherProps
}) => {
  const { setFieldTouched, setFieldValue, touched, errors, values }: any =
    useFormikContext();

  return (
    <>
      <AppTextInput
        value={values[name as keyof UserDocument]}
        mode={mode}
        label={label}
        placeholder={placeholder}
        right={<TextInput.Icon icon={icon} />}
        onBlur={() => setFieldTouched(name as keyof UserDocument)}
        onChangeText={(text: any) =>
          setFieldValue(name as keyof UserDocument, text)
        }
        style={[style, { marginVertical: 8 }]}
        {...otherProps}
      />
      <ErrorMessage visible={touched[name]} error={errors[name]} />
    </>
  );
};

export default FormInput;
