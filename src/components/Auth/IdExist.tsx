import { NavigationContext, NavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import styled from 'styled-components/native';
import { MyPageProps } from '../../pages/MyPage';
import { findScreenProps } from './FindIDPW';
import InputWithLabel from '../../common/InputWithLabel';


export default function IdExist({ navigation, route }: StackScreenProps<findScreenProps, 'idExist'>): JSX.Element {
  const navigateToMyPage = useNavigation<StackNavigationProp<MyPageProps>>();
  return (
    <SafeAreaView style={{backgroundColor:'#FFFFFF', flex:1, display:'flex', justifyContent:'center'}}>
      <InputWithLabel
        label='이메일'
        value={route.params.email}
        editable={false}
        isAlert={true}
        alertLabel='존재하는 이메일입니다'
        
      />
      <TouchableOpacity style={{alignSelf:'center', marginTop: 60}}
        onPress={() => { navigateToMyPage.navigate('login') }}>
        <Text style={TextStyles.button}>로그인하기</Text>
        </TouchableOpacity>
      <TouchableOpacity style={{alignSelf:'center'}}
        onPress={navigation.goBack}>
        <Text style={TextStyles.button}>비밀번호 찾기</Text>
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
})