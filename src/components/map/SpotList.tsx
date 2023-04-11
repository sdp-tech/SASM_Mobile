import React, { Dispatch, Ref, SetStateAction, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Pagination from '../../common/Pagination';
import { Coord } from 'react-native-nmap';
import { detailDataProps } from './Map';
import ItemCard from './SpotList/ItemCard';

const PaginationSection = styled.View`
  height: 40px;
  display: flex;
  align-items: center;
`
type MapListProps = {
  setSheetMode: Dispatch<SetStateAction<boolean>>;
  placeData: any[];
  page: number;
  total: number;
  setPage: (num: number) => void;
  setDetailData: Dispatch<SetStateAction<detailDataProps>>;
  setCenter: Dispatch<SetStateAction<Coord>>;
}

export default function MapList({ placeData,setSheetMode,  setPage, page, total, setDetailData, setCenter }: MapListProps): JSX.Element {
  return (
      <ScrollView>
        {
          placeData.map(data => {
            return (
              <ItemCard setSheetMode={setSheetMode} key={data.id} placeData={data} setDetailData={setDetailData} setCenter={setCenter} />
            )
          })
        }
        <PaginationSection>
          <Pagination page={page} setPage={setPage} total={total} limit={20}></Pagination>
        </PaginationSection>
      </ScrollView>
  )
}