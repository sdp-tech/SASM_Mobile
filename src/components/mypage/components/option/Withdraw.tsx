import React, { useState, useContext } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView, Alert } from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import styled, { css } from 'styled-components/native';
import { StackScreenProps } from '@react-navigation/stack';
import { MyPageProps } from '../../../../pages/MyPage';
import { removeNickname, removeAccessToken, removeRefreshToken, } from '../../../../common/storage';
import { LoginContext } from '../../../../common/Context';

import { Request } from '../../../../common/requests'


const WithdrawButton = styled.View`
    width: 300px;
    height: 40px;
    border-radius: 10px;
    border-color: #44ADF7;
    background: #44ADF7;
    align-items: center;
    justify-content: center;   
`;

const PasswordInput = styled.TextInput`
    width: 294px;
    height: 32px;
    margin: 12px;
    padding: 5px;
    borderWidth: 1px;
    background: #FFFFFF;
    border-radius: 3px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const request = new Request();

const Withdraw = ({ navigation }: StackScreenProps<MyPageProps, 'withdraw'>) => {
    const { isLogin, setLogin } = useContext(LoginContext);
    const withdrawConfirmAlert = () => {
        Alert.alert(
            "알림",
            "정말로 탈퇴하시겠습니까?",
            [
                {
                    text: "예",
                    onPress: withdraw,
                    style: 'destructive',
                },
                {
                    text: "아니오",
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }
    const withdraw = async () => {
        const response = await request.put(`/mypage/withdraw/`, {});
        if (response.status == 200) {
            Alert.alert('알림', '회원 탈퇴가 성공적으로 수행되었습니다.', [{ text: '확인' }]);
            removeAccessToken();
            removeNickname();
            removeRefreshToken();
            setLogin(false);
            navigation.navigate('mypage');
        }
        else {
            Alert.alert('알림', '회원 탈퇴가 실패하였습니다.', [{ text: '확인' }]);
        }
        navigation.navigate('mypage');

    }

    return (
        <SafeAreaView
            style={
                {
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center'
                }
            }
        >
            <View style={{ marginTop: 100 }}>
                <Text
                    style={{
                        fontSize: 24,
                    }}
                >회원 탈퇴</Text>
            </View>
            <View style={{ marginTop: 40 }}>
                <TouchableOpacity onPress={withdrawConfirmAlert}>
                    <WithdrawButton>
                        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>탈퇴</Text>
                    </WithdrawButton>
                </TouchableOpacity>
            </View>
        </SafeAreaView>)
}

export default Withdraw;
