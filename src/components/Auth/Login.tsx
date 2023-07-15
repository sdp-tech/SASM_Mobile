import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView, Alert, Dimensions } from "react-native";
import { TextPretendard as Text } from '../../common/CustomText';
import styled, { css } from 'styled-components/native';
import { NavigationScreenProp } from 'react-navigation';
import { Request } from '../../common/requests'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MyPageParams } from '../../pages/MyPage';
import InputWithLabel from '../../common/InputWithLabel';
import { LoginContext } from '../../common/Context';
import Arrow from "../../assets/img/common/Arrow.svg";
import SocialLogin, {processLoginResponse} from './SocialLogin';

const InputWrapper = styled.View`
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 120px;
`

const LoginScreen = () => {
  const {isLogin, setLogin} = useContext(LoginContext);
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

    const response = await request.post('users/login/', {
      email: form.email,
      password: form.password,
    });
    processLoginResponse(response, navigation, setLogin);
  }

  useEffect(() => {
    if (alert.isAlert) {
      setTimeout(() => {
        setAlert({ alertString: '', isAlert: false })
      }, 3000)
    }
  }, [alert])

  useFocusEffect(useCallback(()=>{
    if(isLogin) navigation.navigate('mypage')
  },[]))

  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', width: '100%', height: '100%', alignItems: 'center' }}>
      <View style={{ position: 'relative', marginBottom: 30, width:'100%', display:'flex', justifyContent:'center' }}>
        <Text style={TextStyles.header}>로그인</Text>
        <TouchableOpacity style={{ left: 10, marginBottom: 30, position: 'absolute' }} onPress={() => { navigation.goBack() }}>
          <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} />
        </TouchableOpacity>
      </View>
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
      <TouchableOpacity style={{marginBottom: 60}} onPress={() => navigation.navigate('findidpw')}><Text style={TextStyles.find}>아이디/비밀번호 찾기</Text></TouchableOpacity>
      <SocialLogin type='login'/>
    </SafeAreaView>
  )
}

export default LoginScreen;

const TextStyles = StyleSheet.create({
  header: {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.6,
    fontWeight: '700',
    alignSelf:'center'
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
  },
})