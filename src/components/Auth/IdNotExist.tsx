import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import { findScreenProps } from './FindIDPW';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { MyPageProps } from '../../pages/MyPage';

const StyledButton = styled.TouchableOpacity`
  border: 1px #000000 solid;
  width: 60%;
  margin: 10px auto;
  padding: 10px;
`

export default function IdNotExist({ navigation, route }: StackScreenProps<findScreenProps, 'idNotExist'>): JSX.Element {
  const navigatetToMyPage = useNavigation<StackNavigationProp<MyPageProps>>();
  return (
    <View>
      <Text>{route.params.email}는 SASM에 등록되지 않은 이메일입니다.</Text>
      <StyledButton onPress={()=>{navigatetToMyPage.navigate('register')}}><Text>회원가입 하기</Text></StyledButton>
      <StyledButton onPress={()=>{navigation.goBack();}}><Text>다른 아이디 확인</Text></StyledButton>
    </View>
  )
}
