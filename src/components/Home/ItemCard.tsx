import React from 'react';
import { TextStyle } from 'react-native';
import { Image, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';

const CardWrapper = styled.TouchableOpacity`
  position: relative;
`
const CardTitle = styled.Text`
  position: absolute;
  left: 10px;
  bottom: 10px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 16px;
`

interface ItemCardProps {
  style: TextStyle;
  data: any;
  onPress: () => void;

}



export default function ItemCard({ style, data, onPress }: ItemCardProps): JSX.Element {
  return (
    <CardWrapper style={style} onPress={onPress}>
      <Image
        style={{ width: '100%', height: '100%' }}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
      <CardTitle>{data.text}</CardTitle>
    </CardWrapper>
  )
}
