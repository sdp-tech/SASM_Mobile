import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import NaverMapView, { Align, Circle, Marker, Path, Polygon, Polyline } from "./components/map/NaverMap";
import { Image, ImageBackground, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View, TextInput, StyleSheet, Button } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LayerGroup } from './components/map/NaverMap';

import VectorImage from 'react-native-vector-image';

import MapViewScreen from './components/map/Map';
import LoginScreen from './components/mypage/Login';
import MyPageScreen from './components/mypage/MyPage';
import CommunityScreen from './components/community/Community';
import StoryScreen from './components/story/Story';
import MyPickScreen from './components/mypick/MyPick';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


const App = () => {
    return <NavigationContainer>
        <Stack.Navigator
            screenOptions={({ navigation, route }) => ({
                headerShown: false,
            })}
        >
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
        </Stack.Navigator>
    </NavigationContainer >
}

const NavbarIcon = (source) => {
    return (
        ({ color, size }) => (<VectorImage
            source={source} // 새로운 .svg 파일 사용 시, 'yarn react-native-vector-image generate' 수행 필요
            style={{
                tintColor: color,
                resizeMode: 'center'
            }}
        />))
}

const HomeScreen = () => {
    const tabBarActiveTintColor = '#FFFFFF'
    const tabBarInactiveTintColor = '#808080'

    return (
        <Tab.Navigator
            initialRouteName='Map'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#000000',
                },
            })}
        >
            <Tab.Screen
                name={"맵"}
                component={MapViewScreen}
                options={{
                    tabBarActiveTintColor: tabBarActiveTintColor,
                    tabBarInactiveTintColor: tabBarInactiveTintColor,
                    tabBarIcon: NavbarIcon(require('./assets/navbar/map.svg'))
                }}
            />
            <Tab.Screen
                name={"스토리"}
                component={StoryScreen}
                options={{
                    tabBarActiveTintColor: tabBarActiveTintColor,
                    tabBarInactiveTintColor: tabBarInactiveTintColor,
                    tabBarIcon: NavbarIcon(require('./assets/navbar/map.svg'))
                }}
            />
            <Tab.Screen
                name={"커뮤니티"}
                component={CommunityScreen}
                options={{
                    tabBarActiveTintColor: tabBarActiveTintColor,
                    tabBarInactiveTintColor: tabBarInactiveTintColor,
                    tabBarIcon: NavbarIcon(require('./assets/navbar/map.svg'))
                }}
            />
            <Tab.Screen
                name={"마이 픽"}
                component={MyPickScreen}
                options={{
                    tabBarActiveTintColor: tabBarActiveTintColor,
                    tabBarInactiveTintColor: tabBarInactiveTintColor,
                    tabBarIcon: NavbarIcon(require('./assets/navbar/map.svg'))
                }}
            />
            <Tab.Screen
                name={"마이 페이지"}
                component={MyPageScreen}
                options={{
                    tabBarActiveTintColor: tabBarActiveTintColor,
                    tabBarInactiveTintColor: tabBarInactiveTintColor,
                    tabBarIcon: NavbarIcon(require('./assets/navbar/map.svg'))
                }}
            />
        </Tab.Navigator>
    )
}



export default App;