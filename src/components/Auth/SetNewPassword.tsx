import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Request } from '../../common/requests';
import { MyPageNavProps } from '../../pages/MyPage';
import InputWithMessage from '../mypage/components/InputWithMessage';
import ChangePw, { formProps } from './function/ChangePw';

export default function SetNewPassword(): JSX.Element {
  const navigationToMyPage = useNavigation<MyPageNavProps>();
  const request = new Request();
  const [form, setForm] = useState<formProps>({
    code: "",
    password: "",
    passwordConfirm: ""
  })
  // 비밀번호 확인 체크
  let passwordCheck: boolean = false;
  if (form.password === form.passwordConfirm || form.passwordConfirm === "")
    passwordCheck = true;
  const updateNewPassword = async () => {
    const response = await ChangePw(form);
    if (response.data.status == 'success') {
      Alert.alert('비밀번호가 변경되었습니다.');
      navigationToMyPage.navigate('login');
    }
    else if (response.data.status === "error") {
      Alert.alert('인증번호가 일치하지 않습니다.')
    }
    else if (response.data.status === "fail") {
      Alert.alert('기존 비밀번호와 일치합니다.')
    }
  }
  return (
    <View>
      <InputWithMessage
        label='인증코드'
        placeholder='인증코드'
        style={{ width: '100%' }}
        onChangeText={(text) => { setForm({ ...form, code: text }) }}
        textContentType='oneTimeCode'
      />
      <InputWithMessage
        label='새 비밀번호'
        placeholder='비밀번호'
        style={passwordCheck ? { width: '100%' } : { width: '100%', backgroundColor: "#F9E3E3" }}
        onChangeText={(text) => { setForm({ ...form, password: text }) }}
        textContentType='newPassword'
        secureTextEntry={true}
      />
      <InputWithMessage
        label='새 비밀번호'
        placeholder='비밀번호'
        buttonView={passwordCheck}
        onPress={() => { updateNewPassword(); }}
        message={passwordCheck ? "" : "입력한 비밀번호와 일치하지 않습니다"}
        style={passwordCheck ? {} : { backgroundColor: "#F9E3E3" }}
        onChangeText={(text) => { setForm({ ...form, passwordConfirm: text }) }}
        spellCheck={false}
        autoCapitalize="none"
        textContentType='newPassword'
        secureTextEntry={true}
      />
    </View>
  )
}
