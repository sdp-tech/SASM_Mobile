import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const ButtonWrapper = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  position: absolute;
  right: 20px;
  bottom: 20px;
  background-color: #75E59B;
  border-radius: 25px;
`

interface PlusProps {
  onPress: () => void;
}

export default function PlusButton({ onPress }: PlusProps): JSX.Element {
  const { width, height } = Dimensions.get('screen');
  //modal 보이기
  const [modalView, setModalView] = useState<boolean>(false);
  //탭 전환 시 modal 자동 닫기
  useFocusEffect(useCallback(() => {
    setModalView(false);
  }, []))
  return (
    <>
      {
        modalView &&
        <View style={{ width: width, height: height, backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', right: 0, bottom: 0 }}>
        </View>
      }
      <ButtonWrapper onPress={() => { setModalView(!modalView) }}>
        <Text>{modalView ? 'down' : 'up'}</Text>
      </ButtonWrapper>
    </>
  )
}
