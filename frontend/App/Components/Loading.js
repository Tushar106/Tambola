import React from 'react'
import { View } from 'react-native'
import LottieView from 'lottie-react-native';

export default function Loading({size}) {
  return (
    <View style={{height:size,aspectRatio:1,display:"flex",justifyContent:"center",alignContent:"center"}}>
        <LottieView style={{flex:1}} source={require("../../assets/Load.json")} autoPlay loop/>
    </View>
  )
}
