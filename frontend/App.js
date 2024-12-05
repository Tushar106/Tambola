import { StatusBar, StyleSheet, Text, View } from 'react-native';
import SplashScreenView from './App/Screens/SplashScreenView';
import { useEffect } from 'react';
import { useState } from 'react';
import 'react-native-gesture-handler'
import Navigation from './App/Navigation/Navigation';
import AuthContextProvider from './App/Components/AuthContext';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
export default function App() {
  const [isSplashReady, setSplashReady] = useState(true);
  useEffect(() => {
    setTimeout(() => setSplashReady(false), 3000)
  }, [])
  return (
    <>
      <AuthContextProvider>
        <StatusBar hidden={true} />
        {isSplashReady ? <SplashScreenView /> :
          <Navigation />
        }
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
