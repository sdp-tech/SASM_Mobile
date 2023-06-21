import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CategoryForm from '../components/Forest/PostUpload/CategoryForm';
import SemiCategoryForm from '../components/Forest/PostUpload/SemiCategoryForm';
import ForestForm from '../components/Forest/PostUpload/ForestForm';

import BoardListScreen from '../components/Forest/BoardList';
import BoardDetailScreen from '../components/Forest/BoardDetail';
import PostListScreen from '../components/Forest/PostList';
import PostSearchScreen from '../components/Forest/PostSearch';
import PostDetailScreen from '../components/Forest/PostDetail';
import PostCommentsScreen from '../components/Forest/PostComments';
import PhotoPreviewScreen from '../components/Forest/PhotoPreview';

export interface BoardFormat {
  name: string;
  supportsHashtags: boolean;
  supportsPostPhotos: boolean;
  supportsPostComments: boolean;
  supportsPostCommentPhotos: boolean;
  postContentStyle: string;
}

export type ForestStackParams = {
  BoardList: any;
  BoardDetail: {
    board_id: number;
    board_name: string;
  }
  PostList: {
    board_id?: number;
    board_name: string;
    board_category?: string;
  };
  PostSearch: any;
  PostDetail: {
    board_id: number;
    post_id: number;
    board_name: string;
  };
  PostComments: {
    id: number;
    email: string;
  }
  PostUpload: any;
  PhotoPreview: {
    photoUri: any;
  }
  CategoryForm: {
    categories: any;
  };
  SemiCategoryForm: {
    category: any;
  };
  ForestForm: {
    category: any;
    semi_categories: any;
    id?: number;
  }
};

const Stack = createNativeStackNavigator<ForestStackParams>();

const Forest = () => {

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="BoardList" component={BoardListScreen} />
      <Stack.Screen name="BoardDetail" component={BoardDetailScreen} />
      <Stack.Screen name="PostList" component={PostListScreen} />
      <Stack.Screen name="PostSearch" component={PostSearchScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="PostComments" component={PostCommentsScreen} />
      <Stack.Screen name="PhotoPreview" component={PhotoPreviewScreen} />
      <Stack.Screen name='CategoryForm' component={CategoryForm} />
      <Stack.Screen name='SemiCategoryForm' component={SemiCategoryForm} />
      <Stack.Screen name='ForestForm' component={ForestForm} />
    </Stack.Navigator>
  );
};


export default Forest;