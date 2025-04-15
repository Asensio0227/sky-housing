import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { signOutUser } from '../features/auth/authSlice';

const useAppStateListener = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current === 'active' && nextAppState === 'background') {
        dispatch(signOutUser());
      }

      appState.current = nextAppState;
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
