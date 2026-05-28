import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';

import RootStack from './navigation/RootStack';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const scheme = useColorScheme() ?? 'light';
  const [isReady, setIsReady] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleInit = () => {
      setIsReady(true);
    };

    if (i18n.isInitialized) {
      handleInit();
    } else {
      i18n.on('initialized', handleInit);
    }

    return () => {
      i18n.off('initialized', handleInit);
    };
  }, [i18n]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
