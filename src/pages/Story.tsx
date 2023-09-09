import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import StoryMainPage from '../components/story/StoryMainPage';
import StorySearchPage from '../components/story/components/StorySearch';
import StoryDetailPage from '../components/story/StoryDetailPage';
import WriteStoryPage from '../components/story/WriteStoryPage';
import CommentListPage from '../components/story/CommentListPage';
import RecommendListPage from '../components/story/RecommendListPage';
import PhotoPreviewScreen from '../common/PhotoPreview';
import { TabProps } from '../../App';

export interface StoryProps {
  navigation: any;
  route: any;
}

export type StoryStackParams = {
  StoryMain: undefined;
  StorySearch: undefined;
  StoryDetail: {
    id: number | undefined;
  }
  WriteStory : undefined;
  CommentList: undefined;
  RecommendList: {
    data: any;
    type: boolean;
  }
  PhotoPreview: {
    photoUri: any;
  }
}

const Stack = createNativeStackNavigator<StoryStackParams>();

const StoryScreen = ({ navigation, route }: StackScreenProps<TabProps, '스토리'>) => {
  const navigationToStory = useNavigation<StackNavigationProp<StoryStackParams>>();
  useEffect(() => {
    if(route.params.id) {
      // navigationToStory.reset({routes: [{name: "StoryDetail", params: { id: route.params.id }}]});
      navigationToStory.push('StoryDetail', { id : route.params.id})
    }
  }, [route.params.id])
  return (
    <Stack.Navigator 
      screenOptions = {() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name = "StoryMain" component = {StoryMainPage} />
      <Stack.Screen name = "StorySearch" component = {StorySearchPage} />
      <Stack.Screen name = "StoryDetail" component = {StoryDetailPage} />
      <Stack.Screen name = "WriteStory" component={WriteStoryPage} />
      <Stack.Screen name = "CommentList" component={CommentListPage} />
      <Stack.Screen name = "RecommendList" component={RecommendListPage} />
      <Stack.Screen name="PhotoPreview" component={PhotoPreviewScreen} />
    </Stack.Navigator>
  )
}

export default StoryScreen;