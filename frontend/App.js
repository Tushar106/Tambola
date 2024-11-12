import { StatusBar, StyleSheet, Text, View } from 'react-native';
import SplashScreenView from './App/Screens/SplashScreenView';
import { useEffect } from 'react';
import { useState } from 'react';
import 'react-native-gesture-handler'
import Navigation from './App/Navigation/Navigation';

export default function App() {
  const [isSplashReady, setSplashReady] = useState(true);
  useEffect(() => {
    setTimeout(() => setSplashReady(false), 3000)
  }, [])
  return (
    <>
      <StatusBar />
      {isSplashReady ? <SplashScreenView /> : <Navigation />}
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
