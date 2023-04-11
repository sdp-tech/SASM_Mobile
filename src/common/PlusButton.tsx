import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import styled from 'styled-components/native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


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
  }, []));
  const animatedPosition = useSharedValue(0);
  const animatedStyle1 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(animatedPosition.value, { duration: 500 }) }]
    };
  })
  const animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(2 * animatedPosition.value, { duration: 500 }) }]
    };
  })
  useEffect(() => {
    if (modalView) {
    }
  }, [modalView]);
  return (
    <>
      {
        modalView &&
        <Pressable
          onPress={() => { setModalView(!modalView); animatedPosition.value = modalView ? 0 : -60 }}
          style={{ width: width, height: height, backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', right: 0, bottom: 0 }}>
        </Pressable>
      }
      <Animated.View style={animatedStyle2}>
        <ButtonWrapper onPress={() => { }}>
        </ButtonWrapper>
      </Animated.View>
      <Animated.View style={animatedStyle1}>
        <ButtonWrapper onPress={() => { }}>
        </ButtonWrapper>
      </Animated.View>
      <Animated.View>
        <ButtonWrapper onPress={() => { setModalView(!modalView); animatedPosition.value = modalView ? 0 : -60 }}>
          <Text>{modalView ? 'down' : 'up'}</Text>
        </ButtonWrapper>
      </Animated.View>
    </>
  )
}
