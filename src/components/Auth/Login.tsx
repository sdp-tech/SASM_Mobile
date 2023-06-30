import React, { useContext, useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView, Alert } from "react-native";
import { TextPretendard as Text } from '../../common/CustomText';
import styled, { css } from 'styled-components/native';
import { NavigationScreenProp } from 'react-navigation';
import { setNickname, setAccessToken, setRefreshToken } from '../../common/storage';
import { Request } from '../../common/requests'
import { useNavigation } from '@react-navigation/native';
import { MyPageParams } from '../../pages/MyPage';
import InputWithLabel from '../../common/InputWithLabel';

// Social login
// kakao
import * as KakaoLogin from '@react-native-seoul/kakao-login';
// naver
import NaverLogin from '@react-native-seoul/naver-login';
// google
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { GOOGLE_WEB_CLIENT_ID, NAVER_APP_CLIENT_ID, NAVER_APP_CLIENT_SECRET, NAVER_APP_SERVICE_URL_SCHEME } from 'react-native-dotenv';
import { LoginContext } from '../../common/Context';


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
  const {isLogin, setLogin} = useContext(LoginContext);
  const [form, setForm] = useState<{ email: string, password: string }>({
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState<{ isAlert: boolean, alertString: string }>({
    isAlert: false,
    alertString: ''
  })
  const request = new Request();

  const processLoginResponse = (response: any) => {
    if (response.status == 200) {
      const nickname = response.data.data.nickname
      const accessToken = response.data.data.access
      const refreshToken = response.data.data.refresh
      setNickname(nickname)
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)
      setLogin(true);
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

  const login = async () => {

    const response = await request.post('/users/login/', {
      email: form.email,
      password: form.password,
    });
    processLoginResponse(response);
  }

  const kakao_login = () => {
    KakaoLogin.login().then((result) => {
      console.log("카카오 로그인 성공", JSON.stringify(result));
      return request.get('/users/kakao/callback/', {
        access_token: result.accessToken,
      });
    }).then((response) => {
      processLoginResponse(response);
    }).catch((error) => {
      setAlert({ alertString: '카카오 로그인이 실패하였습니다.', isAlert: true })
    });
  };

  const naver_login = async () => {
    NaverLogin.login({
      appName: 'SASM',
      consumerKey: NAVER_APP_CLIENT_ID,
      consumerSecret: NAVER_APP_CLIENT_SECRET,
      serviceUrlScheme: NAVER_APP_SERVICE_URL_SCHEME,
    }).then(({ isSuccess, successResponse }) => {
      if (isSuccess) {
        console.log("네이버 로그인 성공", successResponse?.accessToken);
        return request.get('/users/naver/callback/', {
          access_token: successResponse?.accessToken,
        });
      }
      else {
        throw new Error("undefined error");
      }
    }).then((response) => {
      processLoginResponse(response);
    }).catch((error) => {
      setAlert({ alertString: '네이버 로그인이 실패하였습니다.', isAlert: true })
    });

  };

  const google_configure = () => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  };

  const google_login = () => {
    GoogleSignin.signIn().then(({ idToken }) => {
      console.log("구글 로그인 성공", idToken);
      GoogleSignin.getTokens().then((res) => {
        console.log("access token!!", res.accessToken);
        return request.get('/users/google/callback/', {
          access_token: res.accessToken,
        });
      }).then((response) => {
        processLoginResponse(response);
      });
    }).catch((error) => {
      setAlert({ alertString: '구글 로그인이 실패하였습니다.', isAlert: true })
    });
  }


  useEffect(() => {
    if (alert.isAlert) {
      setTimeout(() => {
        setAlert({ alertString: '', isAlert: false })
      }, 3000)
    }
    google_configure();
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
      <TouchableOpacity onPress={() => kakao_login()}>
        <Text style={TextStyles.button_login}>카카오톡으로 로그인하기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => naver_login()}>
        <Text style={TextStyles.button_login}>네이버로 로그인하기</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => google_login()}>
        <Text style={TextStyles.button_login}>구글로 로그인하기</Text>
      </TouchableOpacity>
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