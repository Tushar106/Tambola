import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Loading from '../Components/Loading'

export default function SplashScreenView() {
  return (
    <View style={styles.container}>
      <Loading size={200}/>
    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#f7eec6"
    }
})