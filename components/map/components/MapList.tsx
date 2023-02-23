import React from 'react'
import { TouchableOpacity, ScrollView, Text, View } from 'react-native';
import styled from 'styled-components/native';
import ItemCard from './ItemCard';

const ListSection = styled.View`
  width: 100%;
  height: 40%;
  position: absolute;
  bottom: 0;
  background-color: #FFFFFF;
  
`

type MapListProps = {
  placeData: any[];
  page: number;
  setPage: (num:number)=>void;
}

export type DataTypes = {
  address: string;
  category: string;
  id: number;
  place_name: string;
  place_review: string;
  rep_pic: string;
  open_hours: string;
}

export default function MapList({placeData, setPage, page}:MapListProps):JSX.Element {
  return (
    <ListSection>
      <ScrollView>
      {placeData.map(data=>{
        return(
          <ItemCard key={data.id} data={data}/>
        )
      })}</ScrollView>
      <TouchableOpacity onPress={()=>{setPage(page+1)}}><Text>+</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>{setPage(page-1)}}><Text>-</Text></TouchableOpacity>
    </ListSection>  
  )
}