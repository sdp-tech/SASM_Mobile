import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, ImageBackground, Button, Dimensions } from "react-native";
import { TextPretendard as Text } from '../../../common/CustomText';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Request } from '../../../common/requests';
import Arrow from '../../../assets/img/common/Arrow.svg';
import { StackScreenProps } from '@react-navigation/stack';
import { MyPageProps } from '../../../pages/MyPage';
import styled from 'styled-components/native';


const Section = styled.View`
  padding: 15px 30px;
  border-color: #E3E3E3;
  border-bottom-width: 2px;
`
export default function UserInfoBox({ navigation, route }: StackScreenProps<MyPageProps, 'user'>) {

  // const Follow_Do_Undo = async () => {
  //   const response = await request.post('/mypage/follow/', { "targetEmail": email });
  //   console.log("팔로우 언팔로우 : ", response)
  //   if (response.data.data.follows == true) {
  //     Alert.alert('알림', '유저를 팔로우하였습니다.', [{ text: '확인' }])
  //   }
  //   else if (response.data.data.follows == false) {
  //     Alert.alert('알림', '유저를 언팔로우하였습니다.', [{ text: '확인' }])
  //   }
  // }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        <View style={{ position: 'relative' }}>
          <Text style={TextStyles.header}>프로필</Text>
          <TouchableOpacity style={{ left: 10, marginBottom: 30, position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.goBack() }}>
            <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} />
          </TouchableOpacity>
        </View>
        <Section>
          <Image source={{ uri: route.params.info.profile_image }} style={{ width: 80, height: 80, borderRadius: 40 }} />
          <Text style={TextStyles.nickname}>{route.params.info.nickname}</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => { navigation.navigate('follower', {email: route.params.info.email}) }}>
              <Text style={{ fontWeight: "400", fontSize: 10, color: "#848484", marginTop: 10 }}>팔로워 {route.params.follower}  |  </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('following', {email: route.params.info.email}) }}>
              <Text style={{ fontWeight: "400", fontSize: 10, color: "#848484", marginTop: 10 }}>팔로잉 {route.params.following}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={TextStyles.subtitle}>성별</Text>
            <Text style={TextStyles.detail}>{route.params.info.gender}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={TextStyles.subtitle}>생년월일</Text>
            <Text style={TextStyles.detail}>{route.params.info.birthdate}</Text>
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  )
}

const TextStyles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  nickname: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.6,
    fontWeight: '700',
    marginVertical: 10
  },
  subtitle: {
    fontSize: 10,
    lineHeight: 18,
    color: '#848484',
    letterSpacing: -0.6,
    width: 40
  },
  detail: {
    fontSize: 10,
    lineHeight: 18,
    color: '#202020'
  }
});

