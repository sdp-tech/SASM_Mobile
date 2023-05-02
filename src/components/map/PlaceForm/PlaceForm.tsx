import React, { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Close from "../../../assets/img/common/Close.svg";
import styled from 'styled-components/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px;
  right: 20px;
  z-index: 2;
`
const Section = styled.View`
  height: 100%;
  padding-horizontal: 35px;
  display: flex;
  justify-content: center;
`
const Link = styled.TouchableOpacity`
  width: 100%;
  height: 100px;
  background-color: #75E59B;
  margin-vertical: 10px;
  padding-horizontal: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

`
interface PlaceFormProps {
  setPlaceformModal: Dispatch<SetStateAction<boolean>>;
}

export type PlaceFormParamList = {
  'Home': undefined;
  'User': undefined;
  'Owner': undefined
}

export default function PlaceForm({ setPlaceformModal }: PlaceFormProps): JSX.Element {
  return (
    <SafeAreaView>
      <CloseButton onPress={() => { setPlaceformModal(false) }}>
        <Close color={'#000000'} />
      </CloseButton>
      <Section>
        <Text>SASM에 없는 장소를 제보해주세요</Text>
        <Link>
          <Text style={TextStyles.Link}>이미지로 제보하기</Text>
        </Link>
        <Link>
          <Text style={TextStyles.Link}>사업주입니다!</Text>
        </Link>
      </Section>
    </SafeAreaView>
  )
}

const TextStyles = StyleSheet.create({
  Link: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: "700"
  }
})
