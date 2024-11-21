import { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext();
import { io } from 'socket.io-client';
const AuthContextProvider = ({ children }) => {
    const socket = io("http://192.168.43.67:8800/");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getUSer();
        // removeItemValue('user')
    }, []);
    const removeItemValue = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    const getUSer = async () => {
        try {
            const value = await AsyncStorage.getItem('user');
            if (value !== null) {
                setUser(JSON.parse(value));
            }
        } catch (e) {
            // error reading value
            console.log(e)
        }
    };

    const register = async (username) => {
        setLoading(true);
        try {
            const res = await fetch('http://192.168.43.67:8800/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }),
            })
            const data = await res.json();
            setUser(data.user);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            setLoading(false);
        } catch (e) {
            // saving error
            console.log(e)
        }

    }
    const newGame = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://192.168.43.67:8800/api/room/create-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            })
            const data = await res.json();
            setLoading(false);
            // socket.emit("newRoom", { roomId: data, userId: user.id });
            return data;
        } catch (e) {
            // saving error
            console.log(e)
        }

    }
    const joinGame = async (roomId) => {
        setLoading(true);
        try {
            const res = await fetch('http://192.168.43.67:8800/api/room/join-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id, roomId: roomId }),
            })
            const data = await res.json();
            // socket.emit("joinRoom", { roomId: roomId, userId: user.id });
            setLoading(false);
            return data;
        } catch (e) {
            // saving error
            console.log(e)
        }
    }
    const startGame = async (roomId) => {
        setLoading(true);
        try {
            const res = await fetch('http://192.168.43.67:8800/api/room/start-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId: roomId }),
            })
            const data = await res.json();
            // socket.emit("joinRoom", { roomId: roomId, userId: user.id });
            setLoading(false);
            return data;
        } catch (e) {
            // saving error
            console.log(e)
        }
    }

    const fetchGame = async (roomId) => {
        setLoading(true);
        try {
            const res = await fetch('http://192.168.43.67:8800/api/room/fetch-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ roomId: roomId }),
            })
            const data = await res.json();
            setLoading(false);
            return data;
        } catch (e) {
            // saving error
            console.log(e)
        }
    }
    return (
        <AuthContext.Provider value={{ startGame:startGame,user: user, register: register, loading: loading, newGame: newGame, joinGame: joinGame, fetchGame: fetchGame }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider