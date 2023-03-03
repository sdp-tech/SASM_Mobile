import React, { Ref } from 'react'
import { TouchableOpacity, ScrollView, Text, View, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import Pagination from '../../common/Pagination';
import ItemCard from './SpotList/ItemCard';

const ListSection = styled.View`
  background-color: #FFFFFF;
  height: 600px;
`
const PaginationSection = styled.View`
  height: 40px;
  display: flex;
  align-items: center;
`
type MapListProps = {
  placeData: any[];
  page: number;
  total: number;
  setPage: (num: number) => void;
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

export default function MapList({ placeData, setPage, page, total }: MapListProps): JSX.Element {
  return (
    <ListSection>
      <ScrollView>
        {
          placeData.map(data => {
            return (
              <ItemCard key={data.id} data={data} />
            )
          })
        }
        <PaginationSection>
          <Pagination page={page} setPage={setPage} total={total} limit={20}></Pagination>
        </PaginationSection>
      </ScrollView>
    </ListSection>
  )
}