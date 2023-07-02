import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { TextPretendard as Text } from './CustomText';
import styled from 'styled-components/native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Add from '../assets/img/common/Add.svg';


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
  position: 'leftbottom' | 'lefttop' | 'rightbottom' | 'righttop';
}

export default function PlusButton({ onPress, position }: PlusProps) {
  
  let style;
  switch (position) {
    case ('leftbottom'):
      style = { left: 15, bottom: 15 }
      break;
    case ('lefttop'):
      style = { left: 15, top: 15 }
      break;
    case ('rightbottom'):
      style = { right: 15, bottom: 15 }
      break;
    case ('righttop'):
      style = { right: 15, top: 15 }
      break;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ position: "absolute",  ...style ,shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3 }}>
      <Add />
    </TouchableOpacity>
  )
}
