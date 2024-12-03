import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import RollingCircle from './RollingCircle';
import { generateTicket } from '../Components/Function/GenerateTicket';
import { AuthContext } from '../Components/AuthContext';

const GameScreen = ({ navigation, route }) => {
  const { players, roomId, socket } = route.params;
  if (!socket || !players || !roomId) {
    return (
      <View style={styles.container}>
        <Text>Cant Open</Text>
      </View>
    )
  }

  const { user } = useContext(AuthContext);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [drawnNumber, setDrawnNumber] = useState(null);
  const [ticket, setTicket] = useState([]);
  const [claimedRows, setClaimedRows] = useState([false, false, false]); // Track claimed rows
  const [claimedFullHouse, setClaimedFullHouse] = useState(false); // Track claimed full house
  const [points,setPoints]=useState(0);
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      // socket.emit("leaveRoom", { roomId: roomId, userId: user.id });
      e.preventDefault(); // Prevent default action
      unsubscribe() // Unsubscribe the event on first call to prevent infinite loop
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }); // Reset the navigation stack to the home screen
    });

    // return unsubscribe;
  }, [])
  socket.on('drawnNumber', ({ number }) => {
    setDrawnNumber(number);
  })
  useEffect(() => {
    setTicket(generateTicket());
  }, []);
  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const claimButton = () => {
    socket.emit("ClaimReward", { roomId: roomId, userId: user.id });
    socket.on('ClaimReward', ({ revealedNumbers }) => {
      console.log(revealedNumbers)
      console.log(selectedNumbers)
      let points = 0;
      let allRowsRevealed = true;

      for (let rowIndex = 0; rowIndex < ticket.length; rowIndex++) {
        const row = ticket[rowIndex];
        let rowRevealed = true;

        for (let num of row) {
          if (num !== null && !revealedNumbers.includes(num)) {
            rowRevealed = false;
            allRowsRevealed = false;
          }
        }

        if (rowRevealed && !claimedRows[rowIndex]) {
          points += 30;
          claimedRows[rowIndex] = true; // Mark the row as claimed
          console.log("heheh")
          socket.emit('rowClaimed', { roomId, rowIndex, userId: user.id }); // Notify other players
        }
      }

      if (allRowsRevealed) {
        points += 50;
      }

      // Deduct points for incorrectly revealed numbers
      for (let num of selectedNumbers) {
        if(revealedNumbers.includes(num)){
          continue;
        }
        else{
          points -= 10; // Deduct 10 points for each incorrectly revealed number
        }
      }
      setPoints(points);
    })
  };

  useEffect(() => {
    socket.on('rowClaimed', ({ rowIndex, userId }) => {
      console.log(`Row ${rowIndex} claimed by user ${userId}`);
      // Handle row claimed notification
      setClaimedRows((prev) => {
        const newClaimedRows = [...prev];
        newClaimedRows[rowIndex] = true;
        return newClaimedRows;
      });
    });

    return () => {
      socket.off('rowClaimed');
    };
  }, [socket]);


  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View className="logo">
          <Image source={require('../../assets/Logo.png')} style={{ width: 60, height: 50 }} />
        </View>
        <View style={styles.playerScroll}>
          <ScrollView horizontal={true}>
            {players.map((player, index) => (
              <View key={index} style={styles.player}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{player.username}</Text>
                  <Text style={styles.avatarText}>{points}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.claimButton} onPress={claimButton}>
          <Text style={styles.claimText}>Claim</Text>
        </TouchableOpacity>
      </View>
      <View>
        <RollingCircle drawnNumber={drawnNumber} />
      </View>

      {/* Ticket Grid */}
      <View style={styles.grid}>
        {ticket.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((num, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  selectedNumbers.includes(num) && num !== null
                    ? styles.selectedCell
                    : null,
                ]}
                onPress={() => num && toggleNumber(num)}
              >
                <Text style={styles.cellText}>{num || ''}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  playerScroll: {
    padding: 5,
    flex: 4,
    flexDirection: 'row',
  },
  player: {
    alignItems: 'center',
    marginRight: 5,
  },
  avatar: {
    padding: 10,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  claimButton: {
    justifyContent: 'center',
    height: 40,
    backgroundColor: 'orange',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  claimText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  grid: {
    gap: 3,
    flex: 1,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 3,
    justifyContent: 'space-between',
  },
  cell: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#D2D4D7',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCell: {
    backgroundColor: '#f6cb6c',
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default GameScreen;
