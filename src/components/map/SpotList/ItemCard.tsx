import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import Heart from '../../../common/Heart';
import { Request } from '../../../common/requests';
import { Coord } from 'react-native-nmap';
import { detailDataProps, placeDataProps } from '../Map';
import { DataTypes } from '../Map';

export interface ItemCardProps {
  placeData: placeDataProps;
  setSheetMode: Dispatch<SetStateAction<boolean>>;
  setDetailData: Dispatch<SetStateAction<detailDataProps>>;
  setCenter: Dispatch<SetStateAction<Coord>>;
}

const StyledCard = styled.TouchableOpacity`
  height: 100px;
  display: flex;
  flex-direction: row;
  margin: 10px 0;
`
const ImageBox = styled.View`
  width: 65%;
  display: flex;
  flex-direction: row;
`
const TextBox = styled.View`
  width: 35%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  flex: 1;
`
const TitleBox = styled.View`
  border-color: #999999;
  border-bottom-width: 1px;
`

export default function ItemCard({ placeData, setSheetMode, setDetailData, setCenter }: ItemCardProps): JSX.Element {
  const request = new Request();
  const [like, setLike] = useState<boolean>(false);
  const getDetail = async () => {
    const response_detail = await request.get('/places/place_detail/', { id: placeData.id });
    setDetailData(response_detail.data.data);
    setCenter({
      latitude: response_detail.data.data.latitude,
      longitude: response_detail.data.data.longitude
    })
    setSheetMode(false);
  }

  const toggleLike = async () => {
    const response = await request.post('/places/place_like/', { id: placeData.id });
    setLike(!like);
  }
  useEffect(() => {
    if (placeData.place_like == "ok") setLike(true);
    else setLike(false);
  }, [placeData]);
  return (
    <StyledCard onPress={getDetail}>
      <TextBox>
        <View>
          <Text style={TextStyle.placeName}>{placeData.place_name}</Text>
          <Text style={TextStyle.category}>{placeData.category}</Text>
        </View>
        <View>
          <Text style={TextStyle.openHours}>{placeData.open_hours}</Text>
          <Text style={TextStyle.openHours}>
            {
              placeData.distance >=1 ? placeData.distance.toFixed(2) + "km" : Math.floor(placeData.distance * 1000) + "m"
            }
          </Text>
        </View>
      </TextBox>
      <ImageBox>
        <Image source={{ uri: placeData.rep_pic }} style={{ width: '33%', height: '100%' }} />
        <Image source={{ uri: placeData.rep_pic }} style={{ width: '33%', height: '100%' }} />
        <Image source={{ uri: placeData.rep_pic }} style={{ width: '33%', height: '100%' }} />
      </ImageBox>
    </StyledCard>
  )
}

const TextStyle = StyleSheet.create({
  placeName: {
    fontSize: 14,
    fontWeight: '800',
  },
  category: {
    fontSize: 14,
  },
  openHours: {
    fontSize: 12,
    color: '#707070'
  }
})