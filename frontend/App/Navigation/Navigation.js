import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../Screens/HomeScreen';
import * as ScreenOrientation from 'expo-screen-orientation';
import JoinGame from '../Screens/JoinGame';
import WaitingArea from '../Screens/WaitingArea';
import { AuthContext } from '../Components/AuthContext';
import LoginScreen from '../Screens/LoginScreen';
import GameScreen from '../Screens/GameScreen';
import Loading from '../Components/Loading';


export default function Navigation({ navigation }) {
    const Stack = createStackNavigator();
    const { user } = useContext(AuthContext);
    console.log(user)
    const Theme = {
        dark: false,
        colors: {
            primary: 'blue',
            background: '#f7eec6',
            card: 'blue',
            text: 'white',
            border: 'black',
            notification: 'blue'
        }
    }
    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }, [])
    return (
        <NavigationContainer theme={Theme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user === null ? <Stack.Screen name="Login" component={LoginScreen} /> : null}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="JoinGame" component={JoinGame} />
                <Stack.Screen name="WaitingArea" component={WaitingArea} />
                <Stack.Screen name="GameScreen" component={GameScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}