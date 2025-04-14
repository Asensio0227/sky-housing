import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';
import { signOutUser } from '../features/auth/authSlice';

const useAppStateListener = () => {
  const dispatch: any = useDispatch();

  useEffect(() => {
    const handleAppStateChange = (nextState: string) => {
      if (nextState === 'background' || nextState === 'inactive') {
        dispatch(signOutUser());
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [dispatch]);
};

export default useAppStateListener;
