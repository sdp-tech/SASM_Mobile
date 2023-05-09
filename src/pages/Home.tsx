import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CurationList from '../components/Home/CurationList ';
import CurationDetail from '../components/Home/CurationDetail';
import CurationHome from '../components/Home/CurationHome';
import CurationForm from '../components/Home/CurationForm';


export type HomeStackParams = {
  "Home": undefined;
  "List": undefined;
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