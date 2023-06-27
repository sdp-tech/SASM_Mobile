import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { findScreenProps } from './FindIDPW';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { MyPageProps } from '../../pages/MyPage';
import InputWithLabel from '../../common/InputWithLabel';

const StyledButton = styled.TouchableOpacity`
  border: 1px #000000 solid;
  width: 60%;
  margin: 10px auto;
  padding: 10px;
`

export default function IdNotExist({ navigation, route }: StackScreenProps<findScreenProps, 'idNotExist'>): JSX.Element {
  const navigateToMyPage = useNavigation<StackNavigationProp<MyPageProps>>();
  return (
    <SafeAreaView style={{backgroundColor:'#FFFFFF', flex:1, display:'flex', justifyContent:'center'}}>
      <InputWithLabel
        label='이메일'
        value={route.params.email}
        editable={false}
        isAlert={true}
        alertLabel='존재하지 않는 이메일입니다'
        
      />
      <TouchableOpacity style={{alignSelf:'center', marginTop: 60}}
        onPress={() => { navigateToMyPage.navigate('register') }}>
        <Text style={TextStyles.button}>회원가입하기</Text>
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
