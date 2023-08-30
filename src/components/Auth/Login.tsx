import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView } from "react-native";
import { TextPretendard as Text } from '../../common/CustomText';
import styled, { css } from 'styled-components/native';
import { NavigationScreenProp } from 'react-navigation';
import { Request } from '../../common/requests'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MyPageProps } from '../../pages/MyPage';
import InputWithLabel from '../../common/InputWithLabel';
import { LoginContext } from '../../common/Context';
import Arrow from "../../assets/img/common/Arrow.svg";
import NextButton from '../../common/NextButton';
import SocialLogin, {processLoginResponse} from './SocialLogin';

const InputWrapper = styled.View`
    display: flex;
    align-items: center;
    width: 100%;
    justifyContent: center;
    flex: 1
`

const LoginScreen = () => {
  const {isLogin, setLogin} = useContext(LoginContext);
  const navigation = useNavigation<NavigationScreenProp<MyPageProps>>();
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
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'height' : undefined} keyboardVerticalOffset={0} style={{flex: 1}}>
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1, alignItems: 'center' }}>
      <View style={{ position: 'relative', marginBottom: 30, width:'100%', display:'flex', justifyContent:'center', marginTop: 10 }}>
        <Text style={TextStyles.header}>로그인</Text>
        <TouchableOpacity style={{ left: 10, marginBottom: 30, position: 'absolute' }} onPress={() => { navigation.goBack() }}>
          <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} color={'black'} />
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
      <NextButton label='로그인' onPress={() => login()} style={{marginBottom: 10}}/>
      <TouchableOpacity style={{marginBottom: 30}} onPress={() => navigation.navigate('findidpw')}><Text style={TextStyles.find}>아이디/비밀번호 찾기</Text></TouchableOpacity>
      <SocialLogin type='login'/>
      </InputWrapper>
    </SafeAreaView>
    </KeyboardAvoidingView>
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
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.6
  },
})