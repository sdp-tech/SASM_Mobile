import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View, Alert, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import styled from 'styled-components/native';
import { Request } from '../../common/requests';
import InputWithMessage from '../mypage/components/InputWithMessage';
import { MyPageParams, MyPageProps } from '../../pages/MyPage';
import InputWithLabel from '../../common/InputWithLabel';
import Arrow from "../../assets/img/common/Arrow.svg";
import DropDown from '../../common/DropDown';
import DatePicker from '../../common/DatePicker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Logo from '../../assets/img/common/Logo.svg';
import { useNavigation } from '@react-navigation/native';
import { SocialLogin } from './function/SocialLogin';


const { width, height } = Dimensions.get('window');

interface FormTypes {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  birthdate: string;
}

interface CheckTypes {
  email: boolean;
  nickname: boolean;
}

export type RegisterParams = {
  home: undefined;
  email: undefined;
}

export default function RegisterScreen({ navigation, route }: StackScreenProps<MyPageProps, 'register'>): JSX.Element {
  const RegisterStack = createNativeStackNavigator<RegisterParams>();
  return (
    <RegisterStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <RegisterStack.Screen name='home' component={RegisterHome} />
      <RegisterStack.Screen name='email' component={RegisterEmail} />
    </RegisterStack.Navigator>
  )
}

function RegisterHome({ navigation, route }: StackScreenProps<RegisterParams>) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', width: '100%' }}>
      <Logo width={56} height={56} style={{marginTop: 60}}/>
      <Text style={TextStyles.home_title}>SASM</Text>
      <Text style={TextStyles.home_subtitle}>당신의 발자국에 녹색을 더합니다</Text>
      <Text style={TextStyles.home_label}>지속가능한 공간들을 둘러보고 공유해보세요</Text>
      <SocialLogin type='register'/>
    </SafeAreaView>
  )
}

function RegisterEmail({ navigation, route }: StackScreenProps<RegisterParams>) {
  const navigationToMypage = useNavigation<StackNavigationProp<MyPageProps, 'register'>>();
  const [form, setForm] = useState<FormTypes>({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    birthdate: ''
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
  if (isEmail(form.email) || form.email == "") {
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
    if (form.email.length * form.nickname.length * form.passwordConfirm.length == 0 || !passwordCheck || !emailCheck || !check.email || !check.nickname) {
      if (form.email.length * form.nickname.length * form.passwordConfirm.length == 0) {
        Alert.alert('빈 칸을 입력해주세요', '', [{ text: '취소', style: 'destructive' }]);
      }
      else if (!emailCheck) {
        Alert.alert('이메일 형식이 올바르지 않습니다', '', [{ text: '취소', style: 'destructive' }]);
      }
      else if (!check.email) {
        Alert.alert('이메일 중복확인을 해주세요', '', [{ text: '취소', style: 'destructive' }]);
      }
      else if (!passwordCheck) {
        Alert.alert('입력한 비밀번호와 일치하지 않습니다', '', [{ text: '취소', style: 'destructive' }]);
      }
      else if (!check.nickname) {
        Alert.alert('닉네임 중복확인을 해주세요', '', [{ text: '취소', style: 'destructive' }]);
      }
    }
    else {
      const response_register = await request.post('/users/signup/', form);
      Alert.alert('회원가입 인증 메일을 확인해주세요 : )', '', [{ text: 'OK', onPress: () => { navigationToMypage.navigate('login'); } }]);
    }
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      <View style={{ position: 'relative', marginBottom: 30 }}>
        <Text style={TextStyles.header}>회원가입</Text>
        <TouchableOpacity style={{ left: 10, marginBottom: 30, position: 'absolute' }} onPress={() => { navigation.goBack() }}>
          <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} />
        </TouchableOpacity>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <InputWithLabel
          containerStyle={{ width: '75%', paddingLeft: width * 0.15 / 8 }}
          label='이메일'
          placeholder='이메일을 입력해주세요'
          onChangeText={(text) => { setForm({ ...form, email: text }); setCheck({ ...check, email: false }) }}
          isRequired={true}
          isAlert={!emailCheck}
          alertLabel='이메일 형식이 올바르지 않습니다'
          inputMode='email'
        />
        <TouchableOpacity
          style={{ width: '20%' }}
          onPress={() => { checkRepetition("email", form.email) }}>
          <Text style={TextStyles.button}>중복확인</Text>
        </TouchableOpacity>
      </View>
      <InputWithLabel
        isRequired={true}
        label='비밀번호'
        placeholder='비밀번호를 입력해주세요'
        onChangeText={(text) => { setForm({ ...form, password: text }) }}
        secureTextEntry={true}
      />
      <InputWithLabel
        isRequired={true}
        label='비밀번호 확인'
        placeholder='비밀번호를 입력해주세요'
        onChangeText={(text) => { setForm({ ...form, passwordConfirm: text }) }}
        secureTextEntry={true}
        isAlert={!passwordCheck}
        alertLabel='입력한 비밀번호와 일치하지 않습니다'
      />
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <InputWithLabel
          containerStyle={{ width: '75%', paddingLeft: width * 0.15 / 8 }}
          label='닉네임'
          placeholder='닉네임을 입력해주세요'
          onChangeText={(text) => { setForm({ ...form, nickname: text }); setCheck({ ...check, nickname: false }) }}
        />
        <TouchableOpacity
          style={{ width: '20%' }}
          onPress={() => { checkRepetition("nickname", form.nickname) }}>
          <Text style={TextStyles.button}>중복확인</Text>
        </TouchableOpacity>
      </View>
      <DatePicker
        containerStyle={{ marginBottom: 200 }}
        callback={(date) => { setForm({ ...form, birthdate: `${date.year}-${date.month}-${date.date}` }) }}
        isBorder={true}
        label={true}
      />
      <TouchableOpacity onPress={tryRegister}><Text style={TextStyles.submit}>지속가능한 공간 탐방하기</Text></TouchableOpacity>
    </SafeAreaView>
  )
}

const TextStyles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    padding: 10,
    lineHeight: 14,
    borderRadius: 17,
    color: '#FFFFFF',
    fontWeight: '700',
    overflow: 'hidden',
    backgroundColor: '#67D393'
  },
  header: {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.6,
    fontWeight: '700',
    alignSelf: 'center'
  },
  submit: {
    alignSelf: 'center',
    color: '#848484',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.6,
    borderRadius: 12,
    borderColor: '#848484',
    borderWidth: 1,
    paddingHorizontal: 10
  },
  home_title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    marginVertical: 15
  },
  home_subtitle: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.6,
    fontWeight: '700',
    marginTop: 5,
    marginBottom: 150
  },
  home_label: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.6,
    color:'#202020',
    marginBottom: 10
  }
})