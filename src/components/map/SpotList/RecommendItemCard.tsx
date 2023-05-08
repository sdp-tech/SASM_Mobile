import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ItemCardProps } from './ItemCard';
import styled from 'styled-components/native';
import { Request } from '../../../common/requests';

const { width, height } = Dimensions.get('screen');

const StyledCard = styled.TouchableOpacity`
  width: ${width};
  height: 350px;
`
const TextBox = styled.View`
  width: ${width - 30}px;
  position: absolute;
  bottom: 15px;
  left: 15px;
  z-index: 2;
`

interface RecommendItemCardProps extends ItemCardProps {
  index: number;
  max: number;
}

export default function RecommendItemCard({ placeData, setSheetMode, setDetailData, setCenter, index, max }: RecommendItemCardProps): JSX.Element {
  const request = new Request();
  const getDetail = async () => {
    const response_detail = await request.get('/places/place_detail/', { id: placeData.id });
    setDetailData(response_detail.data.data);
    setCenter({
      latitude: response_detail.data.data.latitude,
      longitude: response_detail.data.data.longitude
    })
    setSheetMode(false);
  }
  return (
    <StyledCard onPress={getDetail}>
      <TextBox>
        <Text style={TextStyles.common}>{placeData.category}</Text>
        <Text style={TextStyles.place_name}>{placeData.place_name}</Text>
        <Text style={TextStyles.common}>{placeData.place_review}</Text>
        <Text style={TextStyles.page}>{index+1}/{max}</Text>
      </TextBox>
      <Image source={{ uri: placeData.rep_pic }} style={{ width: '100%', height: '100%' }} />
    </StyledCard>
  )
}

const TextStyles = StyleSheet.create({
  common: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  place_name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 20
  },
  page: {
    marginTop: 5,
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'right'
  }
})