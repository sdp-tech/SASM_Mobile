import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CurationList from '../components/Home/CurationList ';
import CurationDetail from '../components/Home/CurationDetail';
import CurationForm from '../components/Home/CurationForm';
import CurationHome, { CurationProps } from '../components/Home/CurationHome';

const { width, height } = Dimensions.get('screen');

export type HomeStackParams = {
  "Home": undefined;
  "List": {
    data: CurationProps[];
  };
  "Detail": {
    id: number;
  }
  "Form": undefined;
}

export default function HomeScreen(): JSX.Element {
  const HomeStack = createNativeStackNavigator<HomeStackParams>();

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