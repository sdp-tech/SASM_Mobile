import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { MyPageProps } from '../../../pages/MyPage';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

const Register = styled.TouchableOpacity`
  background-color: #67D393;
  width: 175px;
  height: 45px;
  border-radius: 22.5px;
  display: flex;
  justify-content: center;
  align-self: center;
  margin-bottom: 15px;
`
const Login = styled.TouchableOpacity`
  border: 1px #67D393 solid;
  width: 175px;
  height: 34px;
  border-radius: 17px;
  display: flex;
  justify-content: center;
  align-self: center;
`
export default function RequireLogin({ index }: { index: number }) {
  const navigation = useNavigation<StackNavigationProp<MyPageProps>>();
  return (
    <View>
      <Text style={{ ...TextStyles.label, marginTop: (index == 0) ? 130 : 180 }}>
        {
          {
            0: 'SASM의 지속가능한 장소를 저장해보세요!',
            1: 'SASM의 다양한 스토리를 저장해보세요!',
            2: 'SASM의 다양한 큐레이션을 저장해보세요!',
            3: 'SASM의 다양한 정보글을 저장해보세요!'
          }[index]
        }
      </Text>
      <Register onPress={() => navigation.navigate('register')}><Text style={TextStyles.button_regiter}>회원가입</Text></Register>
      <Login onPress={() => navigation.navigate('login')}><Text style={TextStyles.button_login}>로그인</Text></Login>
    </View>
  )
}

const TextStyles = StyleSheet.create({
  label: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.6,
    marginBottom: 100,
    alignSelf: 'center'
  },
  button_regiter: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: -0.6,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  button_login: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.6,
    fontWeight: '700',
  }
})