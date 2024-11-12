import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function HomeScreen() {
  return (
    <View style={style.container}>
      <Text style={{color:"white"}}>HomeScreen</Text>
    </View>
  )
}
const style=StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    }
})