import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserInfoBox from '../components/mypage/components/UserInfoBox';
import LoginScreen from '../components/mypage/Login';
import JoinScreen from '../components/mypage/Join';
import ChangeForm from '../components/mypage/components/ChangeForm';
import PasswordChange from '../components/mypage/components/ChangePassword';
import Feedback from '../components/mypage/components/GetFeedback';
import FindIDPWScreen from '../components/mypage/FindIDPW';
import { StackNavigationProp } from '@react-navigation/stack';

export type MyPageProps = {
    'mypage': any;
    'login': any;
    'join': any;
    'change': any;
    'changepw': any;
    'feedback': any;
    'findidpw': any;
}
export type MyPageNavProps = StackNavigationProp<MyPageProps>;
const MyPageStack = createNativeStackNavigator<MyPageProps>();

const MyPageScreen = () => {
    return (
        <MyPageStack.Navigator
            screenOptions={() => ({
                headerShown: true,
            })} >
            <MyPageStack.Screen name="mypage" component={UserInfoBox} />
            <MyPageStack.Screen name="login" component={LoginScreen} />
            <MyPageStack.Screen name="join" component={JoinScreen} />
            <MyPageStack.Screen name='change' component={ChangeForm} />
            <MyPageStack.Screen name='changepw' component={PasswordChange} />
            <MyPageStack.Screen name='feedback' component={Feedback} />
            <MyPageStack.Screen name="findidpw" component={FindIDPWScreen} />
        </MyPageStack.Navigator>
    )
}
export default MyPageScreen;