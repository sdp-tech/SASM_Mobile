import React, { Dispatch, Ref, SetStateAction, useEffect } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Pagination from '../../common/Pagination';
import { Coord } from 'react-native-nmap';
import { detailDataProps } from './Map';
import ItemCard from './SpotList/ItemCard';
import RecommendItemCard from './SpotList/RecommendItemCard';
import CardView from '../../common/CardView';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { View } from 'react-native';

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

export default function MapList({ placeData, setSheetMode, setPage, page, total, setDetailData, setCenter }: MapListProps): JSX.Element {
  let recommends = [];
  for (let i = 0; i < Math.min(3, placeData.length); i++) {
    recommends.push(placeData[i]);
  }
  return (
    <View style={{borderTopLeftRadius:10, borderTopRightRadius:10, overflow:'hidden'}}>
      {
        placeData.length != 0 &&
        <FlatList
          data={placeData}
          renderItem={({ item }) => (
            <ItemCard setSheetMode={setSheetMode} key={item.id} placeData={item} setDetailData={setDetailData} setCenter={setCenter} />)}
          ListHeaderComponent={
            <CardView
              pageWidth={WINDOW_WIDTH}
              dot={false}
              data={recommends}
              gap={0}
              offset={0}
              renderItem={(data: any) => {
                return (<RecommendItemCard setSheetMode={setSheetMode} key={data.item.id} placeData={data.item} setDetailData={setDetailData} setCenter={setCenter} index={data.index} max={Math.min(3, placeData.length)} />)
              }}
            />
          }
          ListFooterComponent={
            <PaginationSection>
              <Pagination page={page} setPage={setPage} total={total} limit={20}></Pagination>
            </PaginationSection>}
        />}
    </View>

  )
}