import React, { useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import styled from 'styled-components/native'
import { Request } from '../../common/requests'
import InputWithMessage from './components/InputWithMessage'

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

export default function JoinScreen(): JSX.Element {
  const [form, setForm] = useState<FormTypes>({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
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
  let passwordCheck = false;
  if (form.password === form.passwordConfirm || form.passwordConfirm === "")
    passwordCheck = true;

  const checkDuplicate = async (type: string, data: string): Promise<void> => {
    let response_check;
    if (type == "email") {
      response_check = await request.post('/users/rep_check/', {
        type: type,
        email: data,
      });
    }
    else {
      response_check = await request.post('/users/rep_check/', {
        type: type,
        nickname: data,
      })
    }
    Alert.alert(response_check.data.data);
  }
  const tryRegister = async () => {
    const response_register = await request.post('/users/signup/', form);
    Alert.alert('회원가입 인증 메일을 확인해주세요 : )');
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <InputWithMessage
          label='메일 주소'
          buttonView={emailCheck}
          style={emailCheck ? {} : { backgroundColor: "#F9E3E3" }}
          onPress={() => { checkDuplicate("email", form.email) }}
          placeholder='이메일'
          onChangeText={(text) => { setForm({ ...form, email: text }) }}
          message={emailCheck ? "" : "이메일 형식이 올바르지 않습니다"}
          spellCheck={false}
          autoCapitalize="none"
          keyboardType={'email-address'}
          textContentType="emailAddress"
        />
        <InputWithMessage
          label='비밀번호'
          buttonView={false}
          placeholder='비밀번호'
          onChangeText={(text) => { setForm({ ...form, password: text }) }}
          secureTextEntry={true}
          textContentType="newPassword"
        />
        <InputWithMessage
          label='메일 주소'
          buttonView={false}
          style={passwordCheck ? {} : { backgroundColor: "#F9E3E3" }}
          placeholder='이메일'
          onChangeText={(text) => { setForm({ ...form, passwordConfirm: text }) }}
          message={passwordCheck ? "" : "입력한 비밀번호와 일치하지 않습니다"}
          secureTextEntry={true}
        />
        <InputWithMessage
          label='닉네임'
          buttonView={true}
          onPress={() => { checkDuplicate("nickname", form.nickname) }}
          placeholder='닉네임'
          onChangeText={(text) => { setForm({ ...form, nickname: text }) }}
          textContentType="nickname"
        />
        <TouchableOpacity onPress={tryRegister}><Text>회원가입</Text></TouchableOpacity>
      </ScrollView>
    </View>
  )
}