import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, SafeAreaView, View, Button, Dimensions } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPlace from '../components/mypick/myplace/MyPlace'
import MyStory from "../components/mypick/mystory/MyStory"

const Stack = createNativeStackNavigator();

const MyPickScreen = ({ navigation, route }) => {
    //useFocusEffect(useCallback(()=>{
    //  navigation.navigate('MyStory', {id: route.params.id});
    //}, [route.params.id]))
    return (
      <Stack.Navigator 
        screenOptions = {() => ({
          headerShown: true,
        })}
      >
        <Stack.Screen name = "MyPlace" component = {MyPlace} />
        <Stack.Screen name = "MyStory" component = {MyStory} />
      </Stack.Navigator>
    )
  }
  
  export default MyPickScreen;

/*const MyPickScreen = ({ navigation }) => {
    return (
        <SafeAreaView>
            <Text>MyPick</Text>
        </SafeAreaView>
    )
}

export default MyPickScreen;
*/