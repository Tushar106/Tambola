import { View, Text, Share, StyleSheet, Button, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Clipboard from 'expo-clipboard';
import Entypo from '@expo/vector-icons/Entypo';
import { AuthContext } from '../Components/AuthContext';
import { io } from 'socket.io-client';
import Loading from '../Components/Loading';


export default function WaitingArea({ navigation, route }) {
  const roomId = route.params.game._id
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const game = route.params.game
  const { user, fetchGame, startGame,api } = useContext(AuthContext);

  useEffect(() => {
    console.log("Connecting to server...");
    const socket = io(`${api}`, { transports: ['websocket'] });
    socket.on("connect", () => {
      console.log(route.params.isNewRoom)
      console.log("Connected to server with socket ID:", socket.id);
      if (route.params.isNewRoom) {
        socket.emit("newRoom", { roomId: roomId, userId: user.id });
      } else {
        socket.emit("joinRoom", { roomId: roomId, userId: user.id });
      }
    });
    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    socket.on("userJoined", ({ userId }) => {
      setPlayers((prevPlayers) => {
        const updatedPlayers = new Set(prevPlayers);
        updatedPlayers.add(userId);
        return Array.from(updatedPlayers);
      });
    });
    socket.on("userLeft", ({ userId }) => {
      setPlayers((prevPlayers) => prevPlayers.filter((player) => player !== userId));
    });

    socket.on("startGame", ({ players }) => {
      setLoading(true);
      // Navigate to the game screen after a delay to show the loader
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('GameScreen', { players: players, roomId: roomId, socket: socket });
      }, 2000);
    });
    fetchGame(roomId).then((data) => {
      setPlayers(data.players)
    }
    ).catch((error) => {
      console.log(error)
    })
    return () => {
      socket.emit("leaveRoom", { roomId: roomId, userId: user.id });
      socket.disconnect();
    };
  }, [roomId, user.id]);





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
  const handleStartGame = async () => {
    setLoading(true);
    try {
      const data = await startGame(roomId);
      const socket = io(`${api}`, { transports: ['websocket'] });
      socket.emit("startGame", { roomId: roomId, players: data.players });
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  if (loading) {
    return (
      <View style={style.container}>
        <Loading size={200} />
      </View>
    );
  }



  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View style={style.container}>
        <View style={style.header}>
          <View className="logo">
            <Image source={require('../../assets/Logo.png')} style={{ width: 150, height: 150 }} />
          </View>
          <Text style={style.WelcomeText}> Waiting Area.... </Text>
          <Text style={style.WelcomeText}> Players: {players.length}</Text>
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
    fontSize: 15,
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