import { View, Text, StyleSheet, Button, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../Components/AuthContext';

export default function JoinGame({ navigation }) {
  const [code, setCode] = useState("");
  const { joinGame } = useContext(AuthContext);
  const handleJoinGame = async () => {
    console.log(code)
    if (code.trim() === "") {
      alert("Please enter a valid code");
      return;
    }
    try {
      const game = await joinGame(code);
      if (game === "Room not found") {
        alert("Room not found");
        return;
      }
      if (game === "Room is not in waiting state") {
        alert("Room is not in waiting state");
        return;
      }
      console.log(game);
      navigation.navigate("NewGame", { game: game });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View style={style.container}>
        <View style={style.header}>
          <View className="logo">
            <Image source={require('../../assets/Logo.png')} style={{ width: 150, height: 150 }} />
          </View>
          <Text style={style.WelcomeText}>Join a Game!</Text>
        </View>
        <View style={style.inputContainer}>
          <TextInput
            disableFullscreenUI={true}
            placeholder="Enter Game Code"
            onChangeText={(text) => setCode(text)}
            style={{ height: 40, borderColor: 'gray', padding: 10, borderWidth: 1, width: "60%", backgroundColor: "white" }}
          />
          <TouchableOpacity style={style.enterButton}
            onPress={() => handleJoinGame()}>
            <Text>Join Game</Text>
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