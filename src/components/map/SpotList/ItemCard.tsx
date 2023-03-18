import React, { Dispatch, SetStateAction } from 'react'
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native';
import { Request } from '../../../common/requests';
import { detailDataProps } from '../SpotDetail';
import { DataTypes } from '../SpotList';

type ItemCardProps = {
  data: DataTypes;
  detailRef: any;
  setDetailData: Dispatch<SetStateAction<detailDataProps>>;
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

export default function ItemCard({ data, detailRef, setDetailData }: ItemCardProps): JSX.Element {
  const request = new Request();
  const { address, category, id, place_name, place_review, rep_pic, open_hours } = data
  const getDetail = async () => {
    const response_detail = await request.get('/places/place_detail/', { id: id });
    setDetailData(response_detail.data.data);
    detailRef.current.snapTo(0);
  }

  return (
    <StyledCard>
      <TouchableOpacity onPress={getDetail}>
        <ImageBox>
          <Image source={{ uri: rep_pic }} style={{ width: 130, height: 130 }} />
        </ImageBox>
      </TouchableOpacity>
      <TextBox>
        <Text>{place_name}</Text>
        <Text>{address}</Text>
      </TextBox>
    </StyledCard>
  )
}
