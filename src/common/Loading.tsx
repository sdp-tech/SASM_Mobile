import React from 'react'
import { Image, SafeAreaView, Text, View } from 'react-native';
export default function Loading() {
  return (
    <SafeAreaView style={{height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <Image source={require('../assets/img/Spinner.gif')} style={{width:100, height:100}}/>
    </SafeAreaView>
  )
}
