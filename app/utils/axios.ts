import { create } from 'apisauce';
// const url = process.env.EXPO_PUBLIC_URL;
export const url = `http://192.168.0.3:5000/api/v1`;

const customFetch = create({
  baseURL: `${url}/`,
});

export const checkForUnauthorizedResponse = (error?: any, thunkAPI?: any) => {
  if (error.response.status === 401) {
    return thunkAPI.rejectWithValue('Unauthorized! Logging Out...');
  }
  return thunkAPI.rejectWithValue(error.response.data.msg);
};

export default customFetch;
