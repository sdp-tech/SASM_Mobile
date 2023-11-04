import React, { Dispatch, Ref, SetStateAction, useEffect, useState } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { TextPretendard as Text } from "../../common/CustomText";
import styled from 'styled-components/native';
import Pagination from '../../common/Pagination';
import { Coord } from 'react-native-nmap';
import { detailDataProps } from './Map';
import ItemCard from './SpotList/ItemCard';
import RecommendItemCard from './SpotList/RecommendItemCard';
import CardView from '../../common/CardView';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import { View, Modal } from 'react-native';
import { CategoryDescription } from '../../common/Category';

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
  setIndex: Dispatch<SetStateAction<number>>;
  checkedList: Array<string>;
}

export default function MapList({ placeData, setSheetMode, setPage, page, total, setDetailData, setCenter, setIndex, checkedList }: MapListProps): JSX.Element {
  let recommends = [];
  for (let i = 0; i < Math.min(3, placeData.length); i++) {
    recommends.push(placeData[i]);
  }
  const [modal, setModal] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setModal(false);
    }, 3000)
  }, [])
  return (
    <View style={{borderTopLeftRadius:10, borderTopRightRadius:10, overflow:'hidden', flex:1}}>
      {
        placeData.length != 0 &&
        <FlatList
          data={placeData}
          renderItem={({ item }) => (
            <ItemCard setSheetMode={setSheetMode} key={item.id} placeData={item} setDetailData={setDetailData} setCenter={setCenter} />)}
          ListHeaderComponent={
            <>
              <CardView
                pageWidth={WINDOW_WIDTH}
                dot={false}
                data={recommends}
                gap={0}
                offset={0}
                renderItem={(data: any) => {
                  return (
                    <>
                      {checkedList.length > 0 && 
                        <Modal visible={modal} animationType='fade' transparent>
                          <View style={{ position: 'absolute', zIndex: 2, bottom: WINDOW_HEIGHT * 0.6, width: WINDOW_WIDTH-20, left: 10}}>
                            <CategoryDescription data={checkedList[checkedList.length-1]} />
                          </View>
                        </Modal>
                      }
                      <RecommendItemCard setSheetMode={setSheetMode} key={data.item.id} placeData={data.item} setDetailData={setDetailData} setCenter={setCenter} index={data.index} max={Math.min(3, placeData.length)} />
                    </>
                  )
                }}
              />
            </>
          }
          onEndReached={()=>{
            if(placeData.length != 1) setIndex(2);
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            <PaginationSection>
              <Pagination page={page} setPage={setPage} total={total} limit={20}></Pagination>
            </PaginationSection>}
        />}
    </View>

  )
}