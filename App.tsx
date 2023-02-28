import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import NaverMapView, { Align, Circle, Marker, Path, Polygon, Polyline } from "./components/map/NaverMap";
import { Image, ImageBackground, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View, TextInput, StyleSheet, Button } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { LayerGroup } from './components/map/NaverMap';

import VectorImage from 'react-native-vector-image';

import MapViewScreen from './components/map/Map';
import LoginScreen from './components/mypage/Login';
import MyPageScreen from './components/mypage/MyPage';
import CommunityScreen from './components/community/Community';
import StoryScreen from './components/story/Story';
import MyPickScreen from './components/mypick/MyPick';

export type AppProps = {
    'Home': any;
    'Login': any;
}

const Stack = createNativeStackNavigator();


const App = (): JSX.Element => {
    return <NavigationContainer>
        <Stack.Navigator
            screenOptions={() => ({
                headerShown: false,
            })}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    </NavigationContainer >
}

const NavbarIcon = (source: number) => {
    type VectorProps = {
        color: string,
        size: number
    }
    return (
        ({ color }: VectorProps) => (<VectorImage
            source={source} // 새로운 .svg 파일 사용 시, 'yarn react-native-vector-image generate' 수행 필요
            style={{
                tintColor: color,
                resizeMode: 'center'
            }}
        />)
    )
}


const Tab = createBottomTabNavigator();
type Props = NativeStackScreenProps<AppProps, 'Home'>
const HomeScreen = ({navigation, route}:Props):JSX.Element => {
    const tabBarActiveTintColor: string = '#FFFFFF'
    const tabBarInactiveTintColor: string = '#808080'

    const tabOptions = {
        tabBarActiveTintColor: tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        tabBarIcon: NavbarIcon(require('./assets/navbar/map.svg'))
    }

    return (
        <Tab.Navigator
            initialRouteName='맵'
            screenOptions={() => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#000000',
                },
            })}
        >
            <Tab.Screen
                name={"맵"}
                component={MapViewScreen}
                options={tabOptions}
            />
            <Tab.Screen
                name={"스토리"}
                component={StoryScreen}
                options={tabOptions}
            />
            <Tab.Screen
                name={"커뮤니티"}
                component={CommunityScreen}
                options={tabOptions}
            />
            <Tab.Screen
                name={"마이 픽"}
                component={MyPickScreen}
                options={tabOptions}
            />
            <Tab.Screen
                name={"마이 페이지"}
                component={MyPageScreen}
                options={tabOptions}
            />
        </Tab.Navigator>
    )
}



export default App;