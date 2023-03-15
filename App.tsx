import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import NaverMapView, { Align, Circle, Marker, Path, Polygon, Polyline } from "./src/components/map/NaverMap";
import { Image, ImageBackground, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View, TextInput, StyleSheet, Button } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import MapScreen from './src/pages/SpotMap';
import LoginScreen from './src/components/mypage/Login';
import MyPageScreen from './src/pages/MyPage';
import CommunityScreen from './src/pages/Community';
import StoryScreen from './src/pages/Story';
import MyPickScreen from './src/pages/MyPick';
import MenuIcon from "./src/assets/navbar/map.svg";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            </NavigationContainer >
        </GestureHandlerRootView>
    )
}

const NavbarIcon = (): JSX.Element => {
    return (
        <MenuIcon />
    )
}

export type TabProps = { 
    '맵' : any;
    '스토리': {
        id: number;
    };
    '커뮤니티': any;
    '마이 픽': any;
    '마이 페이지': any;
}

const Tab = createBottomTabNavigator<TabProps>();
const HomeScreen = (): JSX.Element => {
    const tabBarActiveTintColor: string = '#FFFFFF'
    const tabBarInactiveTintColor: string = '#808080'
    const tabOptions = {
        tabBarActiveTintColor: tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        tabBarIcon: NavbarIcon
    }

    return (
        <Tab.Navigator
            initialRouteName='맵'
            screenOptions={() => ({
                headerShown: false,
                tabBarStyle: {
                    height:75,
                    backgroundColor: '#000000',
                },
            })}
        >
            <Tab.Screen
                name={"맵"}
                component={MapScreen}
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