import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Request } from '../../common/requests';
import InputWithMessage from '../mypage/components/InputWithMessage';
import { MyPageProps } from '../../pages/MyPage';

const StyledInput = styled.TextInput`
  height: 30px;
  width: 200px;
  border-color: black;
  border-width: 1px;
  background-color: #FFFFFF;
`

interface FormTypes {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

interface CheckTypes {
  email: boolean;
  nickname: boolean;
}

export default function RegisterScreen({ navigation, route }: StackScreenProps<MyPageProps, 'register'>): JSX.Element {
  const [form, setForm] = useState<FormTypes>({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  })
  const [check, setCheck] = useState<CheckTypes>({
    email: false,
    nickname: false,
  })
  const request = new Request();
  // 이메일 체크
  const isEmail = (email: string): boolean => {
    const emailRegex =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return emailRegex.test(email);
  };
  // 이메일 체크
  let emailCheck: boolean = false;
  if (isEmail(form.email) || form.email === "") {
    emailCheck = true;
  }
  // 비밀번호 확인 체크
  let passwordCheck: boolean = false;
  if (form.password === form.passwordConfirm || form.passwordConfirm === "")
    passwordCheck = true;

  const checkRepetition = async (type: string, data: string) => {
    const response_check = await request.post('/users/rep_check/', {
      type: type,
      value: data,
    })
    if (response_check.data.data.includes("가능")) {
      if (type == 'email') {
        setCheck({ ...check, email: true });
      }
      else {
        setCheck({ ...check, nickname: true });
      }
    }
    Alert.alert(response_check.data.data);
  }
  const tryRegister = async () => {
    if (form.email.length * form.nickname.length * form.passwordConfirm.length == 0 || !passwordCheck || !check.email || !check.nickname) {
      if (form.email.length * form.nickname.length * form.passwordConfirm.length == 0) {
        Alert.alert('빈 칸을 입력해주세요', '', [{ text: '취소', style: 'destructive' }]);
      }
      else if (!passwordCheck) {
        Alert.alert('입력한 비밀번호와 일치하지 않습니다', '', [{ text: '취소', style: 'destructive' }]);
      }
      else if (!check.email) {
        Alert.alert('이메일 중복확인을 해주세요', '', [{ text: '취소', style: 'destructive' }]);
      }
      else if (!check.nickname) {
        Alert.alert('닉네임 중복확인을 해주세요', '', [{ text: '취소', style: 'destructive' }]);
      }
    }
    else {
      const response_register = await request.post('/users/signup/', form);
      Alert.alert('회원가입 인증 메일을 확인해주세요 : )', '', [{ text: 'OK', onPress: () => { navigation.navigate('login'); } }]);
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <InputWithMessage
          label='메일 주소'
          buttonView={emailCheck}
          style={emailCheck ? { width: '65%' } : { width: '100%', backgroundColor: "#F9E3E3" }}
          onPress={() => { checkRepetition("email", form.email) }}
          placeholder='이메일'
          onChangeText={(text) => { setForm({ ...form, email: text }); setCheck({ ...check, email: false }) }}
          message={emailCheck ? "" : "이메일 형식이 올바르지 않습니다"}
          buttonText="중복확인"
        />
        <InputWithMessage
          style={{ width: '100%' }}
          label='비밀번호'
          buttonView={false}
          placeholder='비밀번호'
          onChangeText={(text) => { setForm({ ...form, password: text }) }}
          secureTextEntry={true}
        />
        <InputWithMessage
          label='비밀번호 확인'
          buttonView={passwordCheck}
          style={passwordCheck ? { width: '100%' } : { width: '100%', backgroundColor: "#F9E3E3" }}
          placeholder='비밀번호'
          onChangeText={(text) => { setForm({ ...form, passwordConfirm: text }) }}
          message={passwordCheck ? "" : "입력한 비밀번호와 일치하지 않습니다"}
          secureTextEntry={true}
        />
        <InputWithMessage
          style={{ width: '65%' }}
          label='닉네임'
          buttonView={true}
          onPress={() => { checkRepetition("nickname", form.nickname) }}
          placeholder='닉네임'
          onChangeText={(text) => { setForm({ ...form, nickname: text }); setCheck({ ...check, nickname: false }) }}
          buttonText="중복확인"
        />
        <TouchableOpacity onPress={tryRegister}><Text>회원가입</Text></TouchableOpacity>
      </ScrollView>
    </View>
  )
}