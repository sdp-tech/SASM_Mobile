import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, View } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { ItemCardProps } from './ItemCard';
import styled from 'styled-components/native';
import { Request } from '../../../common/requests';
import { CategoryIcon } from '../../../common/Category';

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
    const response_detail = await request.get(`/places/place_detail/${placeData.id}`);
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
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <CategoryIcon data={placeData.category} />
          <Text style={[TextStyles.common, {marginLeft: 8.5}]}>{placeData.category}</Text>
        </View>
        <Text style={{...TextStyles.common, fontWeight:'700'}}>{placeData.place_name}</Text>
        <Text style={TextStyles.common}>{placeData.place_review}</Text>
        <Text style={TextStyles.page}>{index+1}/{max}</Text>
      </TextBox>
      <Image source={{ uri: placeData.rep_pic }} style={{ width: '100%', height: '100%' }} />
      <View style={{ position: 'absolute', width: '100%', height: 350, backgroundColor: 'rgba(0,0,0,0.3)' }} />
    </StyledCard>
  )
}

const TextStyles = StyleSheet.create({ 
  common: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  page: {
    marginTop: 5,
    fontSize: 10,
    lineHeight:12,
    color: '#FFFFFF',
    alignSelf:"flex-end",
  }
})