import { Dispatch } from 'redux';

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

export type AsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state?: unknown;
  /** type for `thunkApi.dispatch` */
  dispatch?: Dispatch;
  /** type of the `extra` argument for the thunk middleware, which will be passed in as `thunkApi.extra` */
  extra?: unknown;
  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue?: unknown;
  /** return type of the `serializeError` option callback */
  serializedErrorType?: unknown;
  /** type to be returned from the `getPendingMeta` option callback & merged into `pendingAction.meta` */
  pendingMeta?: unknown;
  /** type to be passed into the second argument of `fulfillWithValue` to finally be merged into `fulfilledAction.meta` */
  fulfilledMeta?: unknown;
  /** type to be passed into the second argument of `rejectWithValue` to finally be merged into `rejectedAction.meta` */
  rejectedMeta?: unknown;
};
export interface IPhoto {
  id?: string;
  url?: string;
}

export enum statusOption {
  online = 'online',
  offline = 'offline',
}

export enum categoryOption {
  All = 'all',
  Houses = 'Houses',
  Apartments = 'Apartments',
  Condos = 'Condos',
  Villas = 'Villas',
  Land = 'Land',
}

export interface Location {
  type: 'Point';
  coordinates: number[];
}

export interface modalTypes {
  type: String;
  required?: [true, string];
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

export enum sortOptions {
  Az = 'a-z',
  Za = 'z-a',
  Newest = 'newest',
  Oldest = 'oldest',
}
