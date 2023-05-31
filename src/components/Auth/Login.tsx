import React, { useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView, Alert } from "react-native";
import { TextPretendard as Text } from '../../common/CustomText';
import styled, { css } from 'styled-components/native';
import { NavigationScreenProp } from 'react-navigation';
import { setNickname, setAccessToken, setRefreshToken } from '../../common/storage';
import { Request } from '../../common/requests'
import { useNavigation } from '@react-navigation/native';
import { MyPageParams } from '../../pages/MyPage';
import InputWithLabel from '../../common/InputWithLabel';


const LoginInput = styled.TextInput`
    width: 85%;
    border-bottom-width: 1px;
    border-color: #C0C0C0;
    font-size: 16px;
    line-height: 24px;
    padding-vertical: 10px;
    margin-bottom: 30px;
`;
const InputWrapper = styled.View`
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 200px;
`


const LoginScreen = () => {
  const navigation = useNavigation<NavigationScreenProp<MyPageParams>>();
  const [form, setForm] = useState<{ email: string, password: string }>({
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState<{ isAlert: boolean, alertString: string }>({
    isAlert: false,
    alertString: ''
  })
  const request = new Request();

  const login = async () => {

    const response = await request.post('/users/login/', {
      email: form.email,
      password: form.password,
    });
    if (response.status == 200) {
      const nickname = response.data.data.nickname
      const accessToken = response.data.data.access
      const refreshToken = response.data.data.refresh
      setNickname(nickname)
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)
      navigation.navigate('mypage');
    } else if (response.status == 400) {
      setAlert({ alertString: '올바른 이메일과 비밀번호를 입력해주세요', isAlert: true })
    } else if (response.status == 404) {
      setAlert({ alertString: '존재하지 않는 이메일입니다', isAlert: true })
    }
    else {
      Alert.alert('예상치 못한 오류가 발생하였습니다.')
    }
  }

  useEffect(() => {
    if (alert.isAlert) {
      setTimeout(() => {
        setAlert({ alertString: '', isAlert: false })
      }, 3000)
    }
  }, [alert])

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', width: '100%', height: '100%', alignItems: 'center' }}>
      <Text style={TextStyles.title}>로그인</Text>
      <InputWrapper>
        <InputWithLabel
          containerStyle={{ width: '100%' }}
          label='아이디'
          value={form.email}
          keyboardType={'email-address'}
          placeholder="이메일을 입력해주세요"
          onChangeText={value => setForm({ ...form, email: value })}
          alertLabel={alert.alertString}
          isAlert={alert.isAlert}
        />
        <InputWithLabel
          label='비밀번호'
          containerStyle={{ width: '100%' }}
          value={form.password}
          secureTextEntry={true}
          placeholder="비밀번호를 입력해주세요"
          onChangeText={value => setForm({ ...form, password: value })}
          alertLabel={alert.alertString}
          isAlert={alert.isAlert}
        />
      </InputWrapper>
      <TouchableOpacity onPress={() => login()}>
        <Text style={TextStyles.button_login}>로그인하기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('register')}>
        <Text style={TextStyles.button_login}>회원가입하기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('findidpw')}><Text style={TextStyles.find}>아이디/비밀번호 찾기</Text></TouchableOpacity>
    </SafeAreaView>
  )
}

export default LoginScreen;

const TextStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.6,
    fontWeight: '700'
  },
  button_login: {
    overflow: 'hidden',
    width: 175,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#67D393',
    textAlign: 'center',
    lineHeight: 45,
    fontSize: 16,
    letterSpacing: -0.6,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  find: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.6
  }

})