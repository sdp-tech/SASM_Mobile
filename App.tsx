import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './src/pages/SpotMap';
import LoginScreen from './src/components/Auth/Login';
import MyPageScreen from './src/pages/MyPage';
import CommunityScreen from './src/pages/Community';
import StoryScreen from './src/pages/Story';
import Navbar0 from "./src/assets/navbar/Navbar0.svg";
import Navbar1 from "./src/assets/navbar/Navbar1.svg";
import Navbar2 from "./src/assets/navbar/Navbar2.svg";
import Navbar3 from "./src/assets/navbar/Navbar3.svg";
import Navbar4 from "./src/assets/navbar/Navbar4.svg";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './src/pages/Home';
import { Coord } from 'react-native-nmap';

export type AppProps = {
  'Home': any;
  'Login': any;
}

const Stack = createNativeStackNavigator();


const App = (): JSX.Element => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={() => ({
            headerShown: false,
          })}
        >
          <Stack.Screen name="Home" component={HomeScreens} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer >
    </GestureHandlerRootView>
  )
}

export type TabProps = {
  '홈': undefined;
  '맵': {
    id?: number;
    coor?: Coord;
  };
  '스토리': {
    id: number | undefined;
  };
  '커뮤니티': undefined;
  '마이페이지': undefined;
}

const CustomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={{ height: 75, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderColor: '#E3E3E3', borderTopWidth: 1,paddingHorizontal:10 }}>
      {
        state.routes.map((route, index) => {
          const isFocused = state.index == index;
          const onPress = () => {
            if (route.name == '맵') {
              if (isFocused) navigation.reset({ routes: [{ name: route.name, params: { id: undefined, coor: undefined } }] });
              else navigation.navigate(route.name, { id: undefined, coor: undefined });
            }
            else if (route.name == '스토리') {
              if (isFocused) navigation.reset({ routes: [{ name: route.name, params: { id: undefined } }] });
              else navigation.navigate(route.name, { id: undefined });
            }
            else {
              if (isFocused) navigation.reset({ routes: [{ name: route.name }] });
              else navigation.navigate(route.name);
            }
          }
          return (
            <TouchableOpacity onPress={onPress} style={{ width: '20%',display: 'flex', alignItems: 'center', justifyContent:'center' }}>
              {
                {
                  0: <Navbar0 color={isFocused ? '#67D393' : '#202020'} />,
                  1: <Navbar1 color={isFocused ? '#67D393' : '#202020'} />,
                  2: <Navbar2 color={isFocused ? '#67D393' : '#202020'} />,
                  3: <Navbar3 color={isFocused ? '#67D393' : '#202020'} />,
                  4: <Navbar4 color={isFocused ? '#67D393' : '#202020'} />,

                }[index]
              }

              <Text style={{ color: isFocused ? '#67D393' : '#202020', marginVertical:5, fontSize:12 }}>{route.name}</Text>
            </TouchableOpacity>
          )
        }
        )}
    </View>
  )
}

const Tab = createBottomTabNavigator<TabProps>();
const HomeScreens = (): JSX.Element => {

  return (
    <Tab.Navigator
      tabBar={props => <CustomTab {...props} />}
      initialRouteName='홈'
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <Tab.Screen
        name={"홈"}
        component={HomeScreen}
      />
      <Tab.Screen
        name={"스토리"}
        component={StoryScreen}
      />
      <Tab.Screen
        name={"맵"}
        component={MapScreen}
      />
      <Tab.Screen
        name={"커뮤니티"}
        component={CommunityScreen}
      />
      <Tab.Screen
        name={"마이페이지"}
        component={MyPageScreen}
      />
    </Tab.Navigator>
  )
}

export default App;