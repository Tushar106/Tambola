import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../Screens/HomeScreen';
import * as ScreenOrientation from 'expo-screen-orientation';


export default function Navigation() {
    const Stack=createStackNavigator();
    const Theme={
        dark:false,
        colors:{
            primary:'blue',
            background:'#f7eec6',
            card:'blue',
            text:'white',
            border:'black',
            notification:'blue'
        }
    }
    useEffect(()=>{
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    },[])
    return (
        <NavigationContainer theme={Theme}>
          <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
          </NavigationContainer>
      );
}