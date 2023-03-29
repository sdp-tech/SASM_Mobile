import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { Request } from '../../common/requests';
import FindId from './function/FindId';
import IdExist from './IdExist';
import IdNotExist from './IdNotExist';
import InputWithMessage from '../mypage/components/InputWithMessage';
import FindPw from './function/FindPw';
import SetNewPassword from './SetNewPassword';

const TabsBox = styled.View`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 20px;
  width: 80%;
  margin: 30px auto;
`
const TabButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 50%;
  height: 40px;
  display: flex;
  justify-content: center;
  border-color: #44ADF7;
  border-bottom-width: ${props => (props.selected ? '3px' : '0px')};;
`
const TabText = styled.Text<{ selected: boolean }>`
  font-weight: 700;
  color: ${props => (props.selected ? '#000000' : '#808080')}
  font-size: 16px;
  text-align: center;
`

export type findScreenProps = {
  'home': any;
  'idExist': {
    email: string;
  };
  'idNotExist': {
    email: string;
  };
  'setNewpassword': any;
}

export default function FindIDPWScreen(): JSX.Element {
  const findStack = createStackNavigator<findScreenProps>();
  return (
    <findStack.Navigator
      screenOptions={() => ({
        headerShown: false,
      })}
    >
      <findStack.Screen name='home' component={FindIDPW} />
      <findStack.Screen name="idExist" component={IdExist} />
      <findStack.Screen name='idNotExist' component={IdNotExist} />
      <findStack.Screen name='setNewpassword' component={SetNewPassword} />
    </findStack.Navigator>
  )
}

const FindIDPW = ({ navigation, route }: StackScreenProps<findScreenProps, 'home'>): JSX.Element => {
  const [tab, setTab] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const request = new Request();
  // 이메일 체크
  const isEmail = (email: string): boolean => {
    const emailRegex: RegExp =
      /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return emailRegex.test(email);
  };
  // 이메일 체크
  let emailCheck: boolean = false;
  if (isEmail(email) || email === "") {
    emailCheck = true;
  }

  const getEmailExist = async () => {
    if (email.length == 0) {
      Alert.alert("이메일을 입력해주세요");
    }
    else {
      const response = await FindId(email);
      if (response.data.data === "존재하는 이메일입니다") {
        navigation.navigate('idExist', { email: email });
      }
      else if (response.data.ddata === "존재하지 않는 이메일입니다") {
        navigation.navigate('idNotExist', { email: email });
      }
    }
  }

  const postPassWordCode = async () => {
    const response = await FindId(email);
    if (response.data.data === "존재하는 이메일입니다") {
      await FindPw(email);
      navigation.navigate('setNewpassword');
    }
    else if (response.data.data === "존재하지 않는 이메일입니다") {
      navigation.navigate('idNotExist', { email: email });
    }
  }

  return (
    <View>
      <TabsBox>
        <TabButton selected={tab} onPress={() => { setTab(true) }}><TabText selected={tab}>아이디 찾기</TabText></TabButton>
        <TabButton selected={!tab} onPress={() => { setTab(false) }}><TabText selected={!tab}>비밀번호 찾기</TabText></TabButton>
      </TabsBox>
      {
        tab ?
          <View>
            <InputWithMessage
              label='아이디'
              buttonView={emailCheck}
              placeholder="이메일"
              onPress={getEmailExist}
              onChangeText={(text) => { setEmail(text) }}
              message={emailCheck ? "" : "이메일 형식이 올바르지 않습니다"}
              spellCheck={false}
              autoCapitalize="none"
              textContentType='emailAddress'
            />
          </View> :
          <View>
            <InputWithMessage
              label='아이디'
              buttonView={emailCheck}
              placeholder="이메일"
              onPress={postPassWordCode}
              onChangeText={(text) => { setEmail(text) }}
              message={emailCheck ? "" : "이메일 형식이 올바르지 않습니다"}
              spellCheck={false}
              autoCapitalize="none"
              textContentType='emailAddress'
            />
          </View>
      }
    </View>
  )
}