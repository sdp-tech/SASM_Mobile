import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text, SafeAreaView } from 'react-native';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
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
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { TabProps } from '../../App';
import PostUploadScreen from '../components/Forest/PostUpload';

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
    board_category: any;
  }
  PostList: {
    board_name?: string;
    board_category?: any;
  };
  PostSearch: any;
  PostDetail: {
    post_id: number;
  };
  PostComments: {
    id: number;
    email: string;
  }
  PostUpload: {
    post?: any;
  }
  PhotoPreview: {
    photoUri: any;
  }
  // CategoryForm: {
  //   post?: any;
  //   semi_categories?: any;
  // }
  // SemiCategoryForm: {
  //   category: any;
  //   post?: any;
  // };
  // ForestForm: {
  //   category?: any;
  //   semi_categories?: any;
  //   post?: any;
  // }
};

const Stack = createNativeStackNavigator<ForestStackParams>();

const Forest = ({navigation, route}:StackScreenProps<TabProps, '포레스트'>) => {
  const navigationToForest = useNavigation<StackNavigationProp<ForestStackParams>>();
  useFocusEffect(useCallback(()=>{
    console.error(route.params)
    if(route.params.id) {
      navigationToForest.navigate('PostDetail', {post_id: route.params.id})
    }
  },[]))
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
      {/* <Stack.Screen name='CategoryForm' component={CategoryForm} />
      <Stack.Screen name='SemiCategoryForm' component={SemiCategoryForm} />
      <Stack.Screen name='ForestForm' component={ForestForm} /> */}
      <Stack.Screen name="PostUpload" component={PostUploadScreen} />
    </Stack.Navigator>
  );
};


export default Forest;