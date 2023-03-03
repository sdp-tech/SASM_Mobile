import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyPageMainScreen from '../components/mypage/Main'
import LoginScreen from '../components/mypage/Login';
import JoinScreen from '../components/mypage/Join';

import { getAccessToken, getRefreshToken } from '../common/storage';

const Stack = createNativeStackNavigator();

const MyPageScreen = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation, route }) => ({
                headerShown: true,
            })}
        >
            <Stack.Screen name="mypage" component={MyPageMainScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="join" component={JoinScreen} />
        </Stack.Navigator>
    )
}

export default MyPageScreen;