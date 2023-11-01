import React from 'react';
import { StyleSheet, TextStyle, Image, ImageBackground, View } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import styled from 'styled-components/native';
import { CurationProps } from './CurationHome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParams } from '../../pages/Home';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';

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
        <FastImage
          style={{ width: '100%', height: '100%' }}
          source={{
            uri: data.rep_pic,
            priority: FastImage.priority.normal
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
        <FastImage
          style={{ width: '100%', height: '100%'}}
          source={{
            uri: data.rep_pic,
            priority: FastImage.priority.normal
          }}
        >
        <View style={{backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
          <Text style={TextStyles.writer}>{data.nickname}</Text>
          <Text numberOfLines={2} style={TextStyles.title_email}>{data.title}</Text>
        </View>
        </FastImage>
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
    marginLeft: 10,
    marginBottom: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  writer: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 10,
    marginBottom: 5
  }
})