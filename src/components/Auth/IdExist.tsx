import { NavigationContext, NavigationProp, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { MyPageNavProps } from '../../pages/MyPage';
import { findScreenProps } from './FindIDPW';

const StyledButton = styled.TouchableOpacity`
  border: 1px #000000 solid;
  width: 60%;
  margin: 10px auto;
  padding: 10px;
`

export default function IdExist({ navigation, route }: StackScreenProps<findScreenProps, 'idExist'>): JSX.Element {
  const navigateToMyPage = useNavigation<MyPageNavProps>();
  return (
    <View>
      <Text>{route.params.email}은 존재하는 이메일입니다.</Text>
      <StyledButton onPress={() => { navigateToMyPage.navigate('login') }}><Text>로그인하기</Text></StyledButton>
      <StyledButton onPress={() => { navigation.goBack(); }}><Text>비밀번호 찾기</Text></StyledButton>
    </View>
  )
}
