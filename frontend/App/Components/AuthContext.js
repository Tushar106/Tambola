import { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        removeItemValue('user');
        // getUSer();
    }, []);
    const  removeItemValue=async(key)=> {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch(exception) {
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
        console.log(JSON.stringify(username));
        setLoading(true);
        try {
            // const res=await fetch('http://192.168.43.67:8800/').then(res=>res.json());
            // console.log(res)
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
    return (
        <AuthContext.Provider value={{ user: user, register: register ,loading:loading}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider