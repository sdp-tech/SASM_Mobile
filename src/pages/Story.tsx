import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

import StoryListPage from '../components/story/StoryListPage';
import StoryDetailPage from '../components/story/StoryDetailPage';
import WriteStoryPage from '../components/story/WriteStoryPage';
import CommentListPage from '../components/story/CommentListPage';

export interface StoryProps {
  navigation: any;
  route: any;
}

export type StoryStackParams = {
  StoryList: undefined;
  StoryDetail: {
    id: number | undefined;
  }
  WriteStory : undefined;
  CommentList: undefined;
}

const Stack = createNativeStackNavigator<StoryStackParams>();

const StoryScreen = ({ navigation, route }: StoryProps) => {
  useFocusEffect(useCallback(()=>{
    if(route.params.id) {
      // navigation.reset({routes: [{name: "StoryDetail", params: { id:route.params.id }}]});
      navigation.navigate('StoryDetail', {id: route.params.id});
    }
    else{
      navigation.navigate('StoryList');
    }
  }, [route.params.id]));
  return (
    <Stack.Navigator 
      screenOptions = {() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name = "StoryList" component = {StoryListPage} />
      <Stack.Screen name = "StoryDetail" component = {StoryDetailPage} />
      <Stack.Screen name = "WriteStory" component={WriteStoryPage} />
      <Stack.Screen name = "CommentList" component={CommentListPage} />
    </Stack.Navigator>
  )
}

export default StoryScreen;