import React, { useState } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView, Alert } from "react-native";
import { TextPretendard as Text } from '../../../common/CustomText';
import styled, { css } from 'styled-components/native';

import { Request } from '../../../common/requests'

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

const request = new Request();

const PasswordChange = () =>{
    
  const [password,setPassword] = useState('');
  const [checkpw, setCheckpw] = useState('');
  const changePW = async()=>{
    if(password!=checkpw) Alert.alert('알림','입력한 비밀번호와 비밀번호 확인이 \n불일치합니다.',[{text:'확인'}])
    else{
        const response = await request.put(`/users/pw_change/`,{password:password});
        console.log("비밀번호 변경 결과 : ",response)
    }

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
            >비밀번호 변경</Text>
        </View>
        <View style={{ marginTop: 40 }}>
            <LoginInput
                secureTextEntry={true}
                placeholder="새로운 비밀번호"
                placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                onChangeText={text => setPassword(text)}

            />
              <LoginInput
                secureTextEntry={true}
                placeholder="새로운 비밀번호 확인"
                placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                onChangeText={text => setCheckpw(text)}
            />
        </View>
        <View style={{ marginTop: 40 }}>
            <TouchableOpacity onPress={() => changePW()}>
                <SignUpButton>
                    <Text style={{ color: '#FFFFFF', fontSize: 16 }}>완료</Text>
                </SignUpButton>
            </TouchableOpacity>
        </View>
    </SafeAreaView>)
}

export default PasswordChange;
