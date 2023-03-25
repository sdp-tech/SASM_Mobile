import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UserInfoBox from '../components/mypage/components/UserInfoBox';
import LoginScreen from '../components/mypage/Login';
import JoinScreen from '../components/mypage/Join';
import ChangeForm from '../components/mypage/components/ChangeForm';
import PasswordChange from '../components/mypage/components/ChangePassword';
import Feedback from '../components/mypage/components/GetFeedback';

import { getAccessToken, getRefreshToken } from '../common/storage';

const Stack = createNativeStackNavigator();


const MyPageScreen = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={({ navigation, route }) => ({
                headerShown: true,
            })} >

            <Stack.Screen name="mypage" component={UserInfoBox} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="join" component={JoinScreen} />
            <Stack.Screen name='change' component={ChangeForm}/>
            <Stack.Screen name='changepw' component={PasswordChange}/>
            <Stack.Screen name='feedback' component={Feedback}/>
        </Stack.Navigator>
    )
}
export default MyPageScreen;