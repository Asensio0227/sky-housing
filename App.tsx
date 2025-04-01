// import './gesture-handler';

// @refresh reset

import {
  OpenSans_300Light,
  OpenSans_300Light_Italic,
  OpenSans_400Regular,
  OpenSans_400Regular_Italic,
  OpenSans_500Medium,
  OpenSans_500Medium_Italic,
  OpenSans_600SemiBold,
  OpenSans_600SemiBold_Italic,
  OpenSans_700Bold,
  OpenSans_700Bold_Italic,
  OpenSans_800ExtraBold,
  OpenSans_800ExtraBold_Italic,
  useFonts,
} from '@expo-google-fonts/open-sans';
import Entypo from '@expo/vector-icons/Entypo';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { NavigationContainer } from '@react-navigation/native';
// import * as Sentry from '@sentry/react-native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import * as Network from 'expo-network';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider, useSelector } from 'react-redux';
import OffLineNotice from './app/components/custom/OffLineNotice';
import Screen from './app/components/custom/Screen';
import useNotifications from './app/hooks/useNotifications';
import AuthNavigation from './app/navigation/AuthNavigation';
import DrawerNavigation from './app/navigation/DrawerNavigation';
import { RootState, store } from './store';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// Sentry.init({
//   // dsn: process.env.EXPO_SENTRY_DNS as string,
//   dsn: 'https://4a53a4a40f5dc5fc4d14928a9bdffed6@o4508772966727680.ingest.us.sentry.io/4508782695219200',
//   // tracesSampleRate: 1.0,
//   profilesSampleRate: 1.0,
//   debug: true,
// });

function App() {
  const networkState = Network.useNetworkState();
  const [appIsReady, setAppIsReady] = useState(false);
  const { expoPushToken, notification, channels } = useNotifications();
  let [fontsLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
    OpenSans_800ExtraBold,
    OpenSans_300Light_Italic,
    OpenSans_400Regular_Italic,
    OpenSans_500Medium_Italic,
    OpenSans_600SemiBold_Italic,
    OpenSans_700Bold_Italic,
    OpenSans_800ExtraBold_Italic,
  });
  const { user } = useSelector((store: RootState) => store.AUTH);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Screen onLayout={onLayoutRootView}>
      <OffLineNotice />
      <NavigationContainer>
        {user ? <DrawerNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    </Screen>
  );
}

function Main() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'light');
  const { theme } = useMaterial3Theme();

  const paperTheme = isDarkMode
    ? { ...MD3DarkTheme, colors: theme.dark }
    : { ...MD3LightTheme, colors: theme.light };

  const toggleTheme = () => {
    setIsDarkMode((previousState) => !previousState);
  };

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={paperTheme}>
        <App />
      </PaperProvider>
    </StoreProvider>
  );
}

// export default Sentry.wrap(Main);
export default Main;
