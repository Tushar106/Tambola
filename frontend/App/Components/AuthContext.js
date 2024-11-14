import { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getUSer();
    }, []);

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

    const register = async (user) => {
        console.log(user)
        try {
            
            setUser(user);
           await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (e) {
            // saving error
        }

    }
    return (
        <AuthContext.Provider value={{ user: user, register: register }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider