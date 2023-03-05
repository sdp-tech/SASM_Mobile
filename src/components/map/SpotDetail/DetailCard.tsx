import React, { useEffect, useState, useCallback } from 'react'
import { Dimensions, Image, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import styled from 'styled-components/native';
import { detailDataProps } from '../SpotDetail';
import OpenTime from "../../../assets/img/PlaceDetail/OpenTime.svg";
import PlaceMarker from "../../../assets/img/PlaceDetail/PlaceMarker.svg";
import { useFocusEffect } from '@react-navigation/native';

const TextBox = styled.View`
  padding: 20px;
`
const InfoBox = styled.View`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 20px;
`
const ButtonBox = styled.View`
  width: 30%;
  display: flex;
  justify-content: center;
`
const TabsBox = styled.View`
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 20px;
`
const TabButton = styled.TouchableOpacity<{selected:boolean}>`
  width: 50%;
  height: 40px;
  display: flex;
  justify-content: center;
  border-color: #44ADF7;
  border-bottom-width: ${props => (props.selected ? '3px' : '0px')};;
`
const TabText = styled.Text<{selected: boolean}>`
  font-weight: 700;
  color: ${props => (props.selected ? '#44ADF7' : '#808080')}
  font-size: 20px;
  text-align: center;
`
const Tab = styled.View`
`
const ReviewBox = styled.View`
  padding: 5px 10px;
  border-radius: 10px;
  background: #E5E5E5;
  margin-bottom: 20px;
`;
const ImageBox = styled.View`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`
const ShortCurBox = styled.View`
  padding: 5px 10px;
  border-radius: 10px;
  background: #E5E5E5;
  margin-bottom: 20px;
`;
interface DetailCardProps {
  detailData: detailDataProps,
}

export default function DetailCard({ detailData }: DetailCardProps): JSX.Element {
  const WindowWidth = Dimensions.get('window').width;
  const [tab, setTab] = useState<boolean>(true);
  useEffect(() => {
    setTab(true);
  }, [detailData])
  return (
    <ScrollView>
      <Image source={{ uri: detailData.rep_pic }} style={{ width: WindowWidth, height: 200 }} />
      <TextBox>
        <InfoBox>
          <Text style={{ width: '70%', fontSize: 20, fontWeight: '700' }}>{detailData.place_name}</Text>
          <ButtonBox>
            <View style={{ width: 15, height: 15, backgroundColor: 'red' }}></View>
            {
              detailData.story_id ?
                <View style={{ width: 15, height: 15, backgroundColor: 'blue' }}></View> : null
            }
          </ButtonBox>
          <Text style={{ fontSize: 16 }}>{detailData.category}</Text>
        </InfoBox>
        <TabsBox>
          <TabButton selected={tab} onPress={() => { setTab(true) }}><TabText selected={tab}>홈</TabText></TabButton>
          <TabButton selected={!tab} onPress={() => { setTab(false) }}><TabText selected={!tab}>리뷰</TabText></TabButton>
        </TabsBox>
        <Tab>
          {
            tab ?
              <View>
                <ReviewBox>
                  <Text>{detailData.place_review}</Text>
                </ReviewBox>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", marginBottom: 10 }}>
                  <PlaceMarker width={25} height={25} style={{ marginRight: 15 }} />
                  <Text>{detailData.address}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", marginBottom: 10 }}>
                  <OpenTime width={25} height={25} style={{ marginRight: 15 }} />
                  <Text>{detailData.open_hours}</Text>
                </View>
                <ImageBox>
                  <Image source={{ uri: detailData.photos[0].image }} style={{ width: 100, height: 100 }} />
                  <Image source={{ uri: detailData.photos[1].image }} style={{ width: 100, height: 100 }} />
                  <Image source={{ uri: detailData.photos[2].image }} style={{ width: 100, height: 100 }} />
                </ImageBox>
                <ShortCurBox>
                  <Text>
                    {detailData.short_cur}
                  </Text>
                </ShortCurBox>
              </View>
              :
              <View></View>
          }
        </Tab>
      </TextBox>
    </ScrollView>
  )
}