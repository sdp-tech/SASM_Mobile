import React, { useEffect, useState } from 'react';
import { Text, View, SafeAreaView } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageTabView, { IUserInfo } from '../components/mypage/MyPageTabView';
import UserInfoBox from '../components/mypage/components/UserInfoBox';
import LoginScreen from '../components/Auth/Login';
import RegisterScreen from '../components/Auth/Register';
import ChangeForm from '../components/mypage/components/ChangeForm';
import PasswordChange from '../components/mypage/components/ChangePassword';
import Feedback from '../components/mypage/components/GetFeedback';
import FindIDPWScreen from '../components/Auth/FindIDPW';
import { StackNavigationProp } from '@react-navigation/stack';
import Following from '../components/mypage/components/Following_List';
import Follower from '../components/mypage/components/Follower_List';
import Options from '../components/mypage/components/OptionPage';
import PlaceList from '../components/mypage/components/myplace/PlaceList';

export interface MyPageParams {
    navigation: any;
    route?: any;
}

export type MyPageProps = {
    'mypage': any;
    'place_list': any;
    'login': any;
    'register': any;
    'user': {
        info: IUserInfo;
        follower: number;
        following: number;
    }
    'change': any;
    'changepw': any;
    'feedback': any;
    'findidpw': any;
    'following': {
        email: string;
    }
    'follower': {
        email: string;
    }
    'options': any;
}
const MyPageStack = createNativeStackNavigator<MyPageProps>();

const MyPageScreen = () => {
    return (
        <MyPageStack.Navigator
            screenOptions={() => ({
                headerShown: false,
            })} >
            <MyPageStack.Screen name="mypage" component={MyPageTabView} />
            <MyPageStack.Screen name="place_list" component={PlaceList} />
            <MyPageStack.Screen name="user" component={UserInfoBox} />
            <MyPageStack.Screen name="login" component={LoginScreen} />
            <MyPageStack.Screen name="register" component={RegisterScreen} />
            <MyPageStack.Screen name='change' component={ChangeForm} />
            <MyPageStack.Screen name='changepw' component={PasswordChange} />
            <MyPageStack.Screen name='feedback' component={Feedback} />
            <MyPageStack.Screen name="findidpw" component={FindIDPWScreen} />
            <MyPageStack.Screen name="following" component={Following} />
            <MyPageStack.Screen name="follower" component={Follower} />
            <MyPageStack.Screen name="options" component={Options} />
        </MyPageStack.Navigator>
    )
}
export default MyPageScreen;