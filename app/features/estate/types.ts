export interface UIEstateDocument {
  _id?: string | any;
  id?: string | any;
  photo: IPhoto[];
  title: string;
  description: string;
  price: number;
  location: Location | any;
  contact_details: ContactOb | any;
  user: any | unknown;
  average_rating: Number;
  numOfReviews: number;
  category: string;
  featured: boolean;
  createdAt: Date | any;
  updatedAT?: Date | any;
}

export interface IPhoto {
  id?: string;
  url?: string;
}

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
  address?: modalTypes;
}
