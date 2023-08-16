import React, { useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import CurationList from '../components/Home/CurationList ';
import CurationDetail from '../components/Home/CurationDetail';
import CurationForm from '../components/Home/CurationForm';
import CurationHome, { CurationProps } from '../components/Home/CurationHome';
import { TabProps } from '../../App';

const { width, height } = Dimensions.get('screen');

export type HomeStackParams = {
  "Home": undefined;
  "List": {
    from: 'search' | 'admin' | 'verify';
  };
  "Detail": {
    id: number;
  }
  "Form": undefined;
}

export default function HomeScreen({navigation, route}:StackScreenProps<TabProps, '홈'>): JSX.Element {
  const HomeStack = createNativeStackNavigator<HomeStackParams>();

  const navigationToHome = useNavigation<StackNavigationProp<HomeStackParams>>();
  useEffect(()=>{
    if(route.params?.id) {
      navigationToHome.push('Detail', {id: route.params.id})
    }
  },[route.params?.id])

  return (
    <HomeStack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <HomeStack.Screen name="Home" component={CurationHome} />
      <HomeStack.Screen name="List" component={CurationList} />
      <HomeStack.Screen name="Detail" component={CurationDetail} />
      <HomeStack.Screen name="Form" component={CurationForm} />
    </HomeStack.Navigator>
  )
}