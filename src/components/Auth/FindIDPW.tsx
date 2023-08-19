import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import styled from 'styled-components/native';
import { Request } from '../../common/requests';
import FindId from './function/FindId';
import IdExist from './IdExist';
import IdNotExist from './IdNotExist';
import FindPw from './function/FindPw';
import SetNewPassword from './SetNewPassword';
import InputWithLabel from '../../common/InputWithLabel';
import Arrow from '../../assets/img/common/Arrow.svg';
import { useFocusEffect } from '@react-navigation/native';

const TabsBox = styled.View`
  display: flex;
  flex-flow: row wrap;
  width: 80%;
  margin: 30px auto;
`
const TabButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 50%;
  height: 40px;
  display: flex;
  justify-content: center;
  border-color: #67D393;
  border-bottom-width: ${props => (props.selected ? '3px' : '0px')};;
`
const TabText = styled.Text<{ selected: boolean }>`
  font-weight: 700;
  color: ${props => (props.selected ? '#000000' : '#808080')}
  font-size: 16px;
  text-align: center;
`
export type findScreenProps = {
  'home': {
    tab: boolean;
  };
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
      else if (response.data.data === "존재하지 않는 이메일입니다") {
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

  useFocusEffect(useCallback(()=>{
    if(route.params?.tab == false) setTab(false);
  },[route]))

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1, paddingTop: 10 }}>
      <View style={{ position: 'relative', marginTop: Platform.OS == 'ios' ? 5 : 0}}>
        <Text style={TextStyles.title}>아이디 / 비밀번호 찾기</Text>
        <TouchableOpacity style={{ left: 10, top: 5, position: 'absolute' }} onPress={() => { navigation.goBack() }}>
          <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} color={'black'} />
        </TouchableOpacity>
      </View>
      <TabsBox>
        <TabButton selected={tab} onPress={() => { setTab(true) }}><TabText selected={tab}>아이디 찾기</TabText></TabButton>
        <TabButton selected={!tab} onPress={() => { setTab(false) }}><TabText selected={!tab}>비밀번호 찾기</TabText></TabButton>
      </TabsBox>
      {
        tab ?
          <View style={{display:'flex', justifyContent:'center', flex:1}}>
            <InputWithLabel
              label='이메일'
              isAlert={!emailCheck}
              alertLabel='올바른 이메일을 입력해주세요'
              placeholder='이메일을 입력해주세요'
              onChangeText={text => setEmail(text)}
            />
            <TouchableOpacity style={{alignSelf:'center', marginTop: 80}}
              onPress={getEmailExist}>
                <Text style={TextStyles.button}>이메일 찾기</Text>
            </TouchableOpacity>
          </View> 
          :
          <View style={{display:'flex', justifyContent:'center', flex:1}}>
            <InputWithLabel
              label='이메일'
              isAlert={!emailCheck}
              alertLabel='올바른 이메일을 입력해주세요'
              placeholder='이메일을 입력해주세요'
              onChangeText={text => setEmail(text)}
            />
            <TouchableOpacity style={{alignSelf:'center', marginTop: 80}}
              onPress={postPassWordCode}>
                <Text style={TextStyles.button}>다음</Text>
            </TouchableOpacity>
          </View>
      }
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
  title: {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.6,
    fontWeight: '700',
    alignSelf: 'center'
  },
})