import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../Components/AuthContext';

export default function LoginScreen({ navigation }) {
    const {user,register}=useContext(AuthContext);
    const [name,setName]=useState("");
    if(user!==null){
        navigation.navigate("Home");
    }
    const handleSubmit=()=>{
        register(name);
        navigation.navigate("Home");
    }
    return (
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
            <View style={style.container}>
                <View style={style.header}>
                    <View className="logo">
                        <Image source={require('../../assets/Logo.png')} style={{ width: 150, height: 150 }} />
                    </View>
                    <Text style={style.WelcomeText}>Join us for fun!</Text>
                </View>
                <View style={style.inputContainer}>
                    <TextInput
                        disableFullscreenUI={true}
                        placeholder="Enter Your Name"
                        onChangeText={(text)=>setName(text)}
                        style={{ height: 40, borderColor: 'gray', padding: 10, borderWidth: 1, width: "60%", backgroundColor: "white" }}
                    />
                    <TouchableOpacity style={style.enterButton}
                        onPress={handleSubmit}>
                        <Text>register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
    },
    header: {
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
    },
    WelcomeText: {
        fontSize: 30,
    },
    inputContainer: {
        gap: 10,
        flexDirection: "column",
        alignItems: 'center',
        width: "80%",
    },
    enterButton: {
        width: "60%",
        alignItems: "center",
        backgroundColor: "#7e7b7f",
        padding: 10
    }
})