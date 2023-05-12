import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Dimensions, Image, View, Text, TouchableOpacity, StyleSheet, Button, Linking, Modal, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { detailDataProps } from '../Map';
import OpenTime from "../../../assets/img/PlaceDetail/OpenTime.svg";
import PlaceMarker from "../../../assets/img/PlaceDetail/PlaceMarker.svg";
import Heart from '../../../common/Heart';
import { Request } from '../../../common/requests';
import WriteReview from './WriteReview';
import UserReviews from './UserReviews';
import SharePlace from "../../../assets/img/Map/SharePlace.svg";
import LikePlace from "../../../assets/img/Map/LikePlace.svg";
import FilledLikePlace from "../../../assets/img/Map/FilledLikePlace.svg";
import PlusWhite from "../../../assets/img/Map/PlusWhite.svg";
import CardView from '../../../common/CardView';
import ToggleOpen from "../../../assets/img/Map/ToggleOpen.svg";
import ArrowTop from "../../../assets/img/common/ArrowTop.svg";

const TextBox = styled.View`
  position: absolute;
  top: 240px;
  left: 15px;
`
const TabsBox = styled.View`
  width:100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-horizontal: 20px;
`
const ButtonBox = styled.View`
  display: flex;
  justify-content: space-between;
  height: 125px;
  position: absolute;
  right: 15px;
  top: 100px;
`
const TabButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 15%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Section = styled.View`
  min-height: 200px;
`
const Box = styled.View`
  border-color: #DDDDDD;
  border-bottom-width: 1px;
  padding-vertical: 20px;
`
const PaddingBox = styled(Box)`
  padding-horizontal: 20px;
`
const TabText = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  color: ${props => props.selected ? '#000000' : '#CECECE'}
`
const GoToTop = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;  
  padding: 3px;
  width: 30px;
  height: 30px;
  position: absolute;
  right: 20px;
  bottom: 20px;
  border: 1px black solid;
  background-color: #FFFFFF;
`

interface DetailCardProps {
  detailData: detailDataProps;
}
export interface reviewDataProps {
  category: any[];
  contents: string;
  created: string;
  id: number;
  nickname: string;
  photos: any[];
  place: number;
  updated: string;
  writer: string;
}

export default function DetailCard({ detailData }: DetailCardProps): JSX.Element {
  const detailRef = useRef<ScrollView>(null);
  const [viewHours, setViewHours] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
  const [targetId, setTargetId] = useState<number>(0);
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const request = new Request();
  const [reviewData, setReviewData] = useState<reviewDataProps[]>();
  const [targetData, setTargetData] = useState<reviewDataProps | null>();
  const [like, setLike] = useState<boolean>(false);
  useEffect(() => {
    setTab(0);
    //나중에 BE에서 boolean으로 변환 필요
    if (detailData.place_like == 'ok') {
      setLike(true);
    }
  }, [detailData]);
  const tabs: { index: number, name: string }[] = [
    {
      index: 0,
      name: '홈',
    },
    {
      index: 1,
      name: '리뷰',
    },
    {
      index: 2,
      name: '스토리',
    }
  ]
  const toggleLike = async () => {
    const response = await request.post('/places/place_like/', { id: detailData.id });
    setLike(!like);
  }

  const getReview = async () => {
    const response_review = await request.get(`/places/place_review/`, { id: detailData.id });
    setReviewData(response_review.data.data.results);
  };
  const scrollToTop = () => {
    if (detailRef.current) {
      detailRef?.current.scrollTo(0);
    }
  }
  useEffect(() => {
    if (reviewData) {
      for (let i = 0; i < reviewData.length; i++) {
        if (reviewData[i].id == targetId) {
          setTargetData(reviewData[i]);
          break;
        }
      }
    }
  }, [targetId]);
  useEffect(() => {
    getReview();
    if (detailData.place_like == 'ok') {
      setLike(true);
    }
    else {
      setLike(false);
    }
  }, [])
  useEffect(() => {
    if (tab == 1) getReview();
  }, [tab]);
  return (
    <View>
      <Modal style={{ position: 'absolute' }} visible={reviewModal}>
        <WriteReview id={detailData.id} category={detailData.category} setReviewModal={setReviewModal} setTab={setTab}/>
      </Modal>
      <ScrollView style={{ position: 'relative' }} ref={detailRef}>
        <Image source={{ uri: detailData.rep_pic }} style={{ width: '100%', height: 350 }} />
        <ButtonBox>
          <TouchableOpacity>
            <SharePlace />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleLike}>
            {
              like ?
                <FilledLikePlace /> :
                <LikePlace />
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            //navigation.navigate('Review', { id: 1, category: 'test' })
            setReviewModal(true);
          }}>
            <PlusWhite />
          </TouchableOpacity>
        </ButtonBox>
        <TextBox>
          <Text style={TextStyles.info}>{detailData.category}</Text>
          <Text style={TextStyles.place_name}>{detailData.place_name}</Text>
          <Text style={TextStyles.info}>{detailData.place_review}</Text>
        </TextBox>
        <View>
          <TabsBox>
            {
              tabs.map((data: { index: number, name: string }) => {
                return (
                  <TabButton
                    key={data.index}
                    selected={tab == data.index}
                    onPress={() => { setTab(data.index) }}>
                    <TabText selected={tab == data.index}>{data.name}</TabText>
                  </TabButton>
                )
              })
            }
          </TabsBox>
          <View>
            {
              {
                0: <Section>
                  <PaddingBox>
                    <TouchableOpacity onPress={() => { Linking.openURL(`tel:${detailData.phone_num}`) }}>
                      <Text style={TextStyles.common}>
                        {detailData.phone_num}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setViewHours(!viewHours) }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={TextStyles.common}>
                        {detailData.open_hours}
                      </Text>
                      <View style={{ marginLeft: 20, transform: [{ rotate: viewHours ? '180deg' : '0deg' }] }}><ToggleOpen /></View>
                    </TouchableOpacity>
                    {
                      viewHours &&
                      <>
                        <Text>월 : {detailData.mon_hours}</Text>
                        <Text>화 : {detailData.tues_hours}</Text>
                        <Text>수 : {detailData.wed_hours}</Text>
                        <Text>목 : {detailData.thurs_hours}</Text>
                        <Text>금 : {detailData.fri_hours}</Text>
                        <Text>토 : {detailData.sat_hours}</Text>
                        <Text>일 : {detailData.sun_hours}</Text>
                      </>
                    }
                    <Text style={TextStyles.common}>
                      {detailData.short_cur}
                    </Text>
                  </PaddingBox>
                  <Box>
                    <CardView
                      height={200}
                      pageWidth={200}
                      offset={10}
                      gap={10}
                      dot={false}
                      data={detailData.photos}
                      renderItem={({ item }: any) => <Image source={{ uri: item.image }} style={{ width: 200, height: 200, marginHorizontal: 5 }} />}
                    />
                  </Box>
                  {
                    reviewData && <UserReviews reviewData={reviewData[0]} />
                  }
                </Section>,
                1: <Section>
                  {
                    reviewData && reviewData.map((data: reviewDataProps) => (
                      <UserReviews reviewData={data} />
                    ))
                  }
                </Section>,
                2: <Section></Section>,
              }[tab]
            }
          </View>
        </View>
      </ScrollView>
      <GoToTop onPress={scrollToTop}><ArrowTop /></GoToTop>
    </View>
  )
}


const TextStyles = StyleSheet.create({
  info: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  common: {
    fontSize: 14,
    marginVertical: 10
  },
  place_name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 20
  }
})