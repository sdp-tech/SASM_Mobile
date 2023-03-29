import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView } from "react-native";
import styled, { css } from 'styled-components/native';

import { setNickname, setAccessToken, setRefreshToken } from '../../common/storage';
import { Request } from '../../common/requests'

const SignUpButton = styled.View`
    width: 300px;
    height: 40px;
    border-radius: 10px;
    border-color: #44ADF7;
    background: #44ADF7;
    align-items: center;
    justify-content: center;   
`;

const LoginButton = styled.View`
    width: 150px;
    height: 40px;
    border-width: 2px;
    border-radius: 10px;
    backgroundColor: #FFFFFF;
    align-items: center;
    justify-content: center;
    border-color: #44ADF7;
`;

const LoginInput = styled.TextInput`
    width: 294px;
    height: 32px;
    margin: 12px;
    padding: 5px;
    borderWidth: 1px;
    background: #FFFFFF;
    border-radius: 3px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const PasswordChange = ({navigation}) =>{
  

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
                    fontWeight: 600,
                }}
            >비밀번호 변경</Text>
        </View>
        <View style={{ marginTop: 40 }}>
            <LoginInput
                autoCapitalize={'none'}
                placeholder="인증번호"
                placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                onChangeText={value => updateInput('email', value)}
            />
            <LoginInput
                secureTextEntry={true}
                placeholder="새로운 비밀번호"
                placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                onChangeText={value => updateInput('password', value)}
            />
              <LoginInput
                secureTextEntry={true}
                placeholder="새로운 비밀번호 확인"
                placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                onChangeText={value => updateInput('password', value)}
            />
        </View>
        <View style={{ marginTop: 40 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <SignUpButton>
                    <Text style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 16 }}>완료</Text>
                </SignUpButton>
            </TouchableOpacity>
        </View>
    </SafeAreaView>)
}

export default PasswordChange;
