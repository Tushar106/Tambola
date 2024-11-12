import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native'
import React from 'react'

export default function HomeScreen({ navigation }) {
  return (
    <View style={style.container}>
      <View style={style.header}>
        <View className="logo">
          <Image source={require('../../assets/Logo.png')} style={{ width: 150, height: 150 }} />
        </View>
        <Text style={style.WelcomeText}>Welcome to Tambola!</Text>
      </View>
      <View style={style.GameButtons}>
        <TouchableOpacity style={style.buttonContainer} onPress={()=>{
          navigation.navigate('NewGame')
        }}>
          <Text style={style.buttonHeader}>New Game</Text>
          <Text style={style.buttonSubHeader}>Host with friends using online tickets</Text>
        </TouchableOpacity>
        <View style={style.OrContainer}>
          <Text style={style.OrText}>OR</Text>
        </View>
        <TouchableOpacity style={style.buttonContainer}onPress={()=>{
          navigation.navigate('JoinGame')
        }}>
          <Text style={style.buttonHeader}>Join a Game</Text>
          <Text style={style.buttonSubHeader}>Paticipate using a invite code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    gap:20,
  },
  header: {
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
  },
  WelcomeText: {
    fontSize: 30,
  },
  GameButtons: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: "80%",
    backgroundColor: "white",
    padding:10,
    borderRadius: 50,
  },
  buttonContainer:{
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: "lightblue",
    padding: 10,
  },
  buttonHeader: {
    fontSize: 25,
    fontWeight: "bold",
  },
  buttonSubHeader: {
    fontSize: 15,
  },
  OrContainer:{
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 50,
  },
  OrText:{
    fontSize: 20,
    fontWeight: "400",
  }
})