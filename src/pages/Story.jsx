import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, SafeAreaView, View, Button, Dimensions } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoryListPage from '../components/story/StoryListPage';
import StoryDetailPage from '../components/story/StoryDetailPage';
import { useFocusEffect } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const StoryScreen = ({ navigation, route }) => {
  useFocusEffect(useCallback(()=>{
    navigation.navigate('StoryDetail', {id: route.params.id});
  }, [route.params.id]))
  return (
    <Stack.Navigator 
      screenOptions = {() => ({
        headerShown: true,
      })}
    >
      <Stack.Screen name = "StoryList" component = {StoryListPage} />
      <Stack.Screen name = "StoryDetail" component = {StoryDetailPage} />
    </Stack.Navigator>
  )
}

export default StoryScreen;