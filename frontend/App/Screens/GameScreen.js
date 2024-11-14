import React, { useEffect, useState } from 'react';
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

const GameScreen = () => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [ticket, setTicket] = useState([]);
  useEffect(() => {
    setTicket(generateTicket());
  }, []);


  // Sample ticket numbers (3 rows x 9 columns)
  // const ticket = [
  //   [3, 14, null, 37, null, 53, 64, null, null],
  //   [8, 18, null, 26, 38, null, null, 82, null],
  //   [null, null, 47, null, 57, 68, null, 75, 85],
  // ];

  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View className="logo">
          <Image source={require('../../assets/Logo.png')} style={{ width: 60, height: 50 }} />
        </View>
        <View style={styles.playerScroll}>
          <ScrollView horizontal={true}>
            <View style={styles.player}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>You</Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.claimButton}>
          <Text style={styles.claimText}>Claim</Text>
        </TouchableOpacity>
      </View>
      <View>
        <RollingCircle/>
        
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
  playerScroll:{
    padding:5,
    flex: 4,
    flexDirection: 'row',
  },
  player: {
    alignItems: 'center',
    marginRight: 5,
  },
  avatar: {
    width: 60,
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
    gap:3,
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
