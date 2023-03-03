import React from 'react'
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native';
import { DataTypes } from '../SpotList';

type ItemCardProps = {
  data: DataTypes;
  detailRef: any;
  setTarget: (id: number)=>void;
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

export default function ItemCard({ data, detailRef, setTarget }: ItemCardProps): JSX.Element {
  const { address, category, id, place_name, place_review, rep_pic, open_hours } = data
  return (
    <StyledCard>
      <TouchableOpacity onPress={()=>{detailRef.current.snapTo(0); setTarget(data.id)}}>
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
