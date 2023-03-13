import React, { useEffect, useRef, useState } from 'react';
import { Text, SafeAreaView, View, Button, Dimensions } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoryListPage from '../components/story/StoryListPage';
import StoryDetailPage from '../components/story/StoryDetailPage';

const Stack = createNativeStackNavigator();

const StoryScreen = ({ navigation }) => {
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