import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyPageMainScreen from './Main'
import LoginScreen from './Login';

import { getAccessToken, getRefreshToken } from '../../common/storage';

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
        </Stack.Navigator>
    )
}

export default MyPageScreen;