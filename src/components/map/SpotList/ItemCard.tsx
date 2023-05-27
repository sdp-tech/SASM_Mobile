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
  justify-content: space-between;
`
const TextBox = styled.View`
  width: 35%;
  padding-horizontal: 30px;
  padding-vertical: 10px;
  display: flex;
  justify-content: space-between;
  flex: 1;
`

export default function ItemCard({ placeData, setSheetMode, setDetailData, setCenter }: ItemCardProps): JSX.Element {
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
        <View>
          <Text numberOfLines={2} style={TextStyle.placeName}>{placeData.place_name}</Text>
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
        <Image source={{ uri: placeData.rep_pic }} style={{ width: '33.3333%', height: '100%' }} />
        <Image source={{ uri: placeData.extra_pic[0] }} style={{ width: '33.3333%', height: '100%' }} />
        <Image source={{ uri: placeData.extra_pic[1] }} style={{ width: '33.3333%', height: '100%' }} />
      </ImageBox>
    </StyledCard>
  )
}

const TextStyle = StyleSheet.create({
  placeName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000'
  },
  category: {
    fontSize: 12,
    color: '#000000',
  },
  openHours: {
    fontSize: 10,
    color: '#707070'
  }
})