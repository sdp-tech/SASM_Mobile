import React from 'react';
import { StyleSheet, TextStyle, Image } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import styled from 'styled-components/native';
import { CurationProps } from './CurationHome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParams } from '../../pages/Home';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const CardWrapper = styled.View`
  position: relative;
`
interface ItemCardProps {
  style: TextStyle;
  data: CurationProps;
  onPress?: () => void;
  rep?: boolean;
}

export default function CurationItemCard({ style, data, onPress, rep }: ItemCardProps): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<HomeStackParams>>();
  return (
    <TouchableWithoutFeedback onPress={onPress ? onPress : () => { navigation.navigate('Detail', { id: data.id }) }}>
      <CardWrapper style={style} >
        <Image
          style={{ width: '100%', height: '100%' }}
          source={{
            uri: data.rep_pic
          }}
        />
        <Text numberOfLines={2} style={{ ...TextStyles.title, fontSize: rep ? 28 : 16 }}>{data.title}</Text>
      </CardWrapper>
    </TouchableWithoutFeedback>
  )
}

export function SearchItemCard({ style, data, onPress }: ItemCardProps): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<HomeStackParams>>();
  return (
    <TouchableWithoutFeedback onPress={onPress ? onPress : () => { navigation.navigate('Detail', { id: data.id }) }}>
      <CardWrapper style={style}>
        <Image
          style={{ width: '100%', height: '100%' }}
          source={{
            uri: data.rep_pic
          }}
        />
        <Text numberOfLines={2} style={TextStyles.title_email}>{data.title}</Text>
        <Text style={TextStyles.writer}>{data.writer_email}</Text>
      </CardWrapper>
    </TouchableWithoutFeedback>
  )
}

const TextStyles = StyleSheet.create({
  title: {
    position: 'absolute',
    width: '90%',
    left: 20,
    bottom: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  title_email: {
    position: 'absolute',
    width: '90%',
    left: 10,
    bottom: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  writer: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 10,
    left: 10,
    bottom: 30
  }
})