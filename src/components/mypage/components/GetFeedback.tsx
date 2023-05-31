import React, { useState } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView,Alert } from "react-native";
import { TextPretendard as Text } from '../../../common/CustomText';
import styled, { css } from 'styled-components/native';
import { setNickname, setAccessToken, setRefreshToken } from '../../../common/storage';
import { Request } from '../../../common/requests'
import { color } from 'react-native-reanimated';

const request = new Request;

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

const FeedbackBox = styled.TextInput`
width: 350px;
    height: 100px;
    margin: 12px;
    padding: 5px;
    borderWidth: 1px;
    background: #FFFFFF;
    border-radius: 3px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);`;


const LoginInput = styled.TextInput`
    width: 350px;
    height: 100px;
    margin: 12px;
    padding: 5px;
    borderWidth: 1px;
    background: #FFFFFF;
    border-radius: 3px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Feedback = () =>{
  const [info, setInfo] = useState({});
    const request = new Request();

    const FeedbackPost = async () => {
        console.log("확인 ",info);
      const response = await request.post('/sdp_admin/voc/',
          info, 
          );
          
          console.log(response);
          Alert.alert('알림','발송 완료되었습니다. 의견 감사합니다.',[{text:'확인'}])

          //console.log('발송완료');
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
            >의견 보내기</Text>
            <View style={{ marginTop: 10 }}>
            <Text style={{color:'red', fontSize:12 }}>*문제를 설명하거나 아이디어를 공유해주세요(필수)</Text>
        </View>
        </View>
        <View style={{ marginTop: 40 }}>
        <FeedbackBox
                placeholder="ex> oo식당이 폐업했는데 아직 지도에 남아있습니다.          삭제부탁드립니다."
                onChangeText={text=>{
                    setInfo(prev=>({
                        ...prev,
                        content : text
                    }))
                }} />
        </View>
        <View style={{ marginTop: 40 }}>
            <TouchableOpacity onPress={async() => await FeedbackPost()}>
                <SignUpButton>
                    <Text style={{ color: '#FFFFFF', fontSize: 16 }}>저장하기</Text>
                </SignUpButton>
            </TouchableOpacity>
        </View>
    </SafeAreaView>)
}

export default Feedback;
