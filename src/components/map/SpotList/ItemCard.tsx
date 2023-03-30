import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native';
import Heart from '../../../common/Heart';
import { Request } from '../../../common/requests';
import { Coordinate } from '../../../pages/SpotMap';
import { detailDataProps } from '../SpotDetail';
import { DataTypes } from '../SpotList';

type ItemCardProps = {
  placeData: DataTypes;
  listRef: any;
  detailRef: any;
  setDetailData: Dispatch<SetStateAction<detailDataProps>>;
  setCenter: Dispatch<SetStateAction<Coordinate>>;
}

const StyledCard = styled.View`
  display: flex;
  flex-direction: row;
  border-color: #535351;
  border-bottom-width: 1px;
`
const ImageBox = styled.View`
  padding: 10px;
`
const TextBox = styled.View`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
`
const TitleBox = styled.View`
  border-color: #999999;
  border-bottom-width: 1px;
`

export default function ItemCard({ placeData, listRef, detailRef, setDetailData, setCenter }: ItemCardProps): JSX.Element {
  const request = new Request();
  const [like, setLike] = useState<boolean>(false);
  const getDetail = async () => {
    const response_detail = await request.get('/places/place_detail/', { id: placeData.id });
    setDetailData(response_detail.data.data);
    setCenter({
      latitude: response_detail.data.data.latitude,
      longitude: response_detail.data.data.longitude
    })
		listRef.current.snapToIndex(0);
		detailRef.current.snapToIndex(1);
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
    <View>
      <StyledCard>
        <TouchableOpacity onPress={getDetail}>
          <ImageBox>
            <Image source={{ uri: placeData.rep_pic }} style={{ width: 130, height: 130 }} />
          </ImageBox>
        </TouchableOpacity>
        <TextBox>
          <TitleBox>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={getDetail}>
                <Text style={TextStyle.placeName}>{placeData.place_name}</Text>
              </TouchableOpacity>
              <Heart like={like} onPress={toggleLike} />
            </View>
            <Text style={TextStyle.category}>{placeData.category}</Text>
          </TitleBox>
          <View>
            <Text style={TextStyle.placeReview}>{placeData.place_review}</Text>
            <Text style={TextStyle.address}>{placeData.address}</Text>
            <Text style={TextStyle.openHours}>{placeData.open_hours}</Text>
          </View>
        </TextBox>
      </StyledCard>
    </View>
  )
}

const TextStyle = StyleSheet.create({
  placeName: {
    fontSize: 18
  },
  category: {
    fontSize: 14,
  },
  placeReview: {
    fontSize: 14,
    color: '#999999',
  },
  address: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  openHours: {
    fontSize: 14,
  }
})