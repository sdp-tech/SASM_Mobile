import React, { useEffect, useState, useCallback } from 'react'
import { Dimensions, Image, View, Text, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { detailDataProps } from '../SpotDetail';
import OpenTime from "../../../assets/img/PlaceDetail/OpenTime.svg";
import PlaceMarker from "../../../assets/img/PlaceDetail/PlaceMarker.svg";
import Heart from '../../../common/Heart';
import { Request } from '../../../common/requests';
import WriteReview from './WriteReview';
import UserReviews from './UserReviews';
import { MapScreenProps } from '../../../pages/SpotMap';

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
const TabButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 50%;
  height: 40px;
  display: flex;
  justify-content: center;
  border-color: #44ADF7;
  border-bottom-width: ${props => (props.selected ? '3px' : '0px')};;
`
const TabText = styled.Text<{ selected: boolean }>`
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
const StatisticsBox = styled.View`
  margin: 10px 0;
`
const StatisticsTitle = styled.View`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`
interface DetailCardProps extends MapScreenProps {
  detailData: detailDataProps;
  rerenderScreen: ()=>void;
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
export default function DetailCard({ detailData, navigation, route, rerenderScreen }: DetailCardProps): JSX.Element {
  const WindowWidth = Dimensions.get('window').width;
  const [tab, setTab] = useState<boolean>(true);
  const [targetId, setTargetId] = useState<number>(0);
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const request = new Request();
  const [reviewData, setReviewData] = useState<reviewDataProps[]>();
  const [targetData, setTargetData] = useState<reviewDataProps | null>();
  const [like, setLike] = useState<boolean>(false);
  useEffect(() => {
    setTab(true);
    //나중에 BE에서 boolean으로 변환 필요
    if (detailData.place_like == 'ok') {
      setLike(true);
    }
  }, [detailData]);

  const toggleLike = async () => {
    const response = await request.post('/places/place_like/', { id: detailData.id });
    setLike(!like);
    rerenderScreen();
  }

  const getReview = async () => {
    const response_review = await request.get(`/places/place_review`, { id: detailData.id });
    setReviewData(response_review.data.data.results);
  };

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
    if (!tab) {
      getReview();
    }
  }, [tab]);
  return (
    <ScrollView>
      <Image source={{ uri: detailData.rep_pic }} style={{ width: WindowWidth, height: 200 }} />
      <TextBox>
        <InfoBox>
          <Text style={{ width: '70%', fontSize: 20, fontWeight: '700' }}>{detailData.place_name}</Text>
          <ButtonBox>
            <Heart like={like} onPress={toggleLike}></Heart>
            {
              detailData.story_id ?
                <TouchableOpacity onPress={() => { navigation.navigate('스토리', { id: detailData.story_id }) }}><Text>스토리로 이동</Text></TouchableOpacity> : null
            }
          </ButtonBox>
          <Text style={{ fontSize: 16 }}>{detailData.category}</Text>
        </InfoBox>
        <TabsBox>
          <TabButton selected={tab} onPress={() => { setTab(true) }}><TabText selected={tab}>홈</TabText></TabButton>
          <TabButton selected={!tab} onPress={() => { setTab(false); setTargetId(0); setTargetData(null); }}><TabText selected={!tab}>리뷰</TabText></TabButton>
        </TabsBox>
        <Tab>
          {
            tab ?
              //홈
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
                  <Image source={{ uri: detailData?.photos[0]?.image }} style={{ width: 100, height: 100 }} />
                  <Image source={{ uri: detailData?.photos[1]?.image }} style={{ width: 100, height: 100 }} />
                  <Image source={{ uri: detailData?.photos[2]?.image }} style={{ width: 100, height: 100 }} />
                </ImageBox>
                <ShortCurBox>
                  <Text>
                    {detailData.short_cur}
                  </Text>
                </ShortCurBox>
              </View>
              :
              //리뷰
              <View>
                <StatisticsBox>
                  {
                    detailData.category_statistics.map((data, index) => {
                      return (
                        <StatisticsTitle key={index}><Text>{data[0]}</Text><Text>{data[1]}%</Text></StatisticsTitle>
                      )
                    })
                  }
                </StatisticsBox>
                <ReviewBox>
                  <TouchableOpacity style={{ display: 'flex', justifyContent: 'center' }} onPress={() => { setReviewModal(!reviewModal); setTargetData(undefined); }}>
                    <Text style={{ textAlign: 'center' }}>리뷰를 작성해주세요</Text>
                  </TouchableOpacity>
                </ReviewBox>
                {
                  reviewModal ?
                    <WriteReview tab={tab} setTab={setTab} category={detailData.category} id={detailData.id} targetData={targetData} setReviewModal={setReviewModal} />
                    :
                    null
                }
                <UserReviews tab={tab} setTab={setTab} reviewData={reviewData} setReviewModal={setReviewModal} setTargetId={setTargetId} />
              </View>
          }
        </Tab>
      </TextBox>
    </ScrollView>
  )
}
