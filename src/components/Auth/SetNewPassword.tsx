import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Alert, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { Request } from '../../common/requests';
import { MyPageProps } from '../../pages/MyPage';
import ChangePw, { formProps } from './function/ChangePw';
import InputWithLabel from '../../common/InputWithLabel';
import Check from '../../assets/img/common/Check.svg';
import FinishModal from '../../common/FinishModal';

export default function SetNewPassword(): JSX.Element {
  const navigationToMyPage = useNavigation<StackNavigationProp<MyPageProps>>();
  const [finishModal, setFinishModal] = useState<boolean>(false);
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
    if (!passwordCheck) Alert.alert('조건을 맞춰라')
    const response = await ChangePw(form);
    console.error(response);
    if (response.status == 200) {
      setFinishModal(true);
    }
    // else if (response.data.status === "error") {
    //   Alert.alert('인증번호가 일치하지 않습니다.')
    // }
    // else if (response.data.status === "fail") {
    //   Alert.alert('기존 비밀번호와 일치합니다.')
    // }
    else {
      Alert.alert('인증번호가 일치하지 않습니다.');
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }}>
      <Modal visible={finishModal}>
        <FinishModal
          navigation={()=>navigationToMyPage.navigate('login')}
          setModal={setFinishModal}
          title='비밀번호 변경 완료!'
          subtitle={['다시 로그인해주세요']}
        />
      </Modal>
      <InputWithLabel
        label='인증번호'
        placeholder='이메일로 전송된 인증번호를 입력해주세요'
        onChangeText={text => setForm({ ...form, code: text })}
      />
      <InputWithLabel
        label='새로운 비밀번호'
        placeholder='새로운 비밀번호를 입력해주세요'
        isAlert={!passwordCheck}
        alertLabel='비밀번호가 동일하지 않습니다'
        secureTextEntry={true}
        onChangeText={text => setForm({ ...form, password: text })}
      />
      <InputWithLabel
        label='비밀번호 확인'
        placeholder='비밀번호를 다시 입력해주세요'
        isAlert={!passwordCheck}
        alertLabel='비밀번호가 동일하지 않습니다'
        secureTextEntry={true}
        onChangeText={text => setForm({ ...form, passwordConfirm: text })}
      />
      <TouchableOpacity style={{ alignSelf: 'center', marginTop: 60 }}
        onPress={updateNewPassword}
      ><Text style={TextStyles.button}>비밀번호 변경</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const TextStyles = StyleSheet.create({
  button: {
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
  finish_title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    marginVertical: 21,
  },
  finish_subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#777777',
    fontWeight: '300'
  }
})