import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BoardListScreen from '../components/community/BoardList';
import PostListScreen from '../components/community/PostList';
import PostDetailScreen from '../components/community/PostDetail';
import PostUploadScreen from '../components/community/PostUpload';


export interface BoardFormat {
  name: string;
  supportsHashtags: boolean;
  supportsPostPhotos: boolean;
  supportsPostComments: boolean;
  supportsPostCommentPhotos: boolean;
  postContentStyle: string;
}


export type CommunityStackParams = {
  BoardList: any;
  PostList: {
    board_id: number;
    board_name: string;
  };
  PostDetail: {
    board_id: number;
    post_id: number;
    board_name: string;
    boardFormat: BoardFormat;
  };
  PostUpload: {
    board_id?: number;// ?를 붙이면 optional
    post_id?: number;
    boardFormat: BoardFormat;
  };
};

const Stack = createNativeStackNavigator<CommunityStackParams>();

const Community = () => {

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: true,
      })}
    >
      <Stack.Screen name="BoardList" component={BoardListScreen} />
      <Stack.Screen name="PostList" component={PostListScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="PostUpload" component={PostUploadScreen} />
    </Stack.Navigator>
  );
};


export default Community;