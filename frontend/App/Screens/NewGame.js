import { View, Text, Share, StyleSheet, Button, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useContext, useEffect } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Clipboard from 'expo-clipboard';
import Entypo from '@expo/vector-icons/Entypo';
import { AuthContext } from '../Components/AuthContext';
import { io } from 'socket.io-client';


export default function NewGame({ navigation, route }) {
  const roomId = route.params.game._id
  const game = route.params.game
  const { user } = useContext(AuthContext);

  const socket = io("http://192.168.43.67:8800/");
  useEffect(() => {
    console.log("Connecting to server...");

    socket.on("connect", () => {
      console.log("Connected to server with socket ID:", socket.id);
      socket.emit("joinRoom", { roomId: roomId, userId: user.id });
    });
    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
    };
  }
    , [roomId]);
  socket.on("userJoined", (message) => {
    console.log(message);
  });


  const handleCopy = async (text) => {
    if (text.trim()) {
      await Clipboard.setStringAsync(text);
    }
  };
  const shareGame = async () => {
    try {
      const result = await Share.share({
        message: `Join me in playing this awesome Tambola game! Use this room code: ${roomId} to join. https://tambola-game-link.com`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with a specific activity
          console.log('Shared with activity:', result.activityType);
        } else {
          // Shared successfully
          console.log("Cancelled Share")
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log("Cancelled Share")
      }
    } catch (error) {
      console.error('Error sharing the game:', error);
    }
  };
  const handleStartGame = () => {
    navigation.navigate("GameScreen")
  }
  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View style={style.container}>
        <View style={style.header}>
          <View className="logo">
            <Image source={require('../../assets/Logo.png')} style={{ width: 150, height: 150 }} />
          </View>
          <Text style={style.WelcomeText}> New Game</Text>
        </View>
        <View style={style.inputContainer}>
          <View style={style.codeContainer}>
            <Text style={style.codeText}>Code- {roomId}</Text>
            <TouchableOpacity onPress={() => {
              handleCopy(roomId)
            }}>
              <AntDesign name="copy1" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={style.shareButton}
            onPress={() => shareGame()}>
            <Text style={style.enterText}>Share Game</Text>
            <Entypo name="share" size={20} color="black" />
          </TouchableOpacity>
          {user.id == game.createdBy && <TouchableOpacity style={style.enterButton}
            onPress={() => handleStartGame()}>
            <Text style={style.enterText}>Start Game</Text>
          </TouchableOpacity>}
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
    width: "85%",
  },
  enterButton: {
    width: "60%",
    alignItems: "center",
    backgroundColor: "#7e7b7f",
    borderRadius: 5,
    padding: 10
  },
  shareButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    width: "60%",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "green",
    padding: 10
  },
  enterText: {
    color: "white",
    fontWeight: '700'
  },
  codeContainer: {
    width: "60%",
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  codeText: {
    fontSize: 20,
  }
})