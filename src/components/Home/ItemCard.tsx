import React from 'react';
import { TextStyle } from 'react-native';
import { Image, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { CurationProps } from './CurationHome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParams } from '../../pages/Home';

const CardWrapper = styled.TouchableOpacity`
  position: relative;
`
const CardTitle = styled.Text`
  position: absolute;
  width: 90%;
  left: 10px;
  bottom: 10px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 16px;
`

interface ItemCardProps {
  style: TextStyle;
  data: CurationProps;
  onPress?: () => void;
}

export default function ItemCard({ style, data, onPress }: ItemCardProps): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<HomeStackParams>>();
  return (
    <CardWrapper style={style} onPress={onPress ? onPress : () => { navigation.navigate('Detail', { id: data.id }) }} >
      <Image
        style={{ width: '100%', height: '100%' }}
        source={{
          uri: data.rep_pic
        }}
      />
      <CardTitle numberOfLines={2}>{data.title}</CardTitle>
    </CardWrapper>
  )
}
