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
import { StoryDetail } from '../../story/components/StoryDetailBox';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabProps } from '../../../../App';

const { width, height } = Dimensions.get('window');

const TextBox = styled.View`
  position: absolute;
  top: 220px
  left: 0px;
  padding-horizontal: 15px;
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
  color: ${props => props.selected ? '#000000' : '#C0C0C0'}
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
const StorySection = styled.View`
  width: ${width - 30}px;
  margin: 15px;
  position: relative;
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
  const navigationToTab = useNavigation<StackNavigationProp<TabProps, '스토리'>>();
  const detailRef = useRef<ScrollView>(null);
  const [viewHours, setViewHours] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
  const [targetId, setTargetId] = useState<number>(0);
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const request = new Request();
  const [reviewData, setReviewData] = useState<reviewDataProps[]>();
  const [storyData, setStoryData] = useState<StoryDetail>({
    id: 1,
    title: '',
    created: '',
    profile: '',
    rep_pic: '',
    extra_pics: [],
    story_review: '',
    tag: '',
    story_like: false,
    category: '',
    semi_category: '',
    place_name: '',
    views: 1,
    html_content: '',
    writer: '',
    nickname: '',
    map_image: '',
    writer_is_verified: '',
    preview: '',
  });
  const [likePlace, setLikePlace] = useState<boolean>(false);
  const [likeStory, setLikeStory] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

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

  //화면 재 렌더링
  const rerenderScreen = () => {
    setRefresh(true);
    setRefresh(false);
  }

  const handlePlaceLike = async () => {
    const response = await request.post('/places/place_like/', { id: detailData.id });
    setLikePlace(!likePlace);
  }
  const handleStoryLike = async () => {
    const response_like = await request.post('/stories/story_like/', { id: detailData.story_id });
    setLikeStory(!likeStory);
  }

  const getReview = async () => {
    const response_review = await request.get(`/places/place_review/`, { id: detailData.id });
    if (response_review.data.data.place_like == 'ok') {
      setLikePlace(true);
    }
    setReviewData(response_review.data.data.results);
  };
  const getStory = async () => {
    if (detailData.story_id != null) {
      const response_story = await request.get(`/stories/story_detail/${detailData.story_id}/`);
      setLikeStory(response_story.data.data.story_like);
      setStoryData(response_story.data.data);
    }
    else return;
  }

  const scrollToTop = () => {
    if (detailRef.current) {
      detailRef?.current.scrollTo(0);
    }
  }

  useEffect(() => {
    getReview();
    getStory();
  }, [refresh]);

  return (
    <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden' }}>
      <Modal style={{ position: 'absolute' }} visible={reviewModal}>
        <WriteReview rerender={rerenderScreen} id={detailData.id} category={detailData.category} setReviewModal={setReviewModal} setTab={setTab} />
      </Modal>
      <ScrollView style={{ position: 'relative' }} ref={detailRef}>
        <Image source={{ uri: detailData.rep_pic }} style={{ width: '100%', height: 350 }} />
        <ButtonBox>
          <TouchableOpacity onPress={() => {
            //navigation.navigate('Review', { id: 1, category: 'test' })
            setReviewModal(true);
          }}>
            <PlusWhite />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlaceLike}>
            {
              likePlace ?
                <FilledLikePlace /> :
                <LikePlace />
            }
          </TouchableOpacity>
          <TouchableOpacity>
            <SharePlace />
          </TouchableOpacity>
        </ButtonBox>
        <TextBox>
          <Text style={TextStyles.info}>{detailData.category}</Text>
          <Text style={{ ...TextStyles.info, marginBottom: 20 }}>{detailData.place_name}</Text>
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
                    <Text style={TextStyles.commonColor}>{detailData.address}</Text>
                    <TouchableOpacity onPress={() => { Linking.openURL(`tel:${detailData.phone_num}`) }}>
                      <Text style={TextStyles.commonColor}>
                        {detailData.phone_num}
                      </Text>
                    </TouchableOpacity>
                    <Text style={TextStyles.common}>영업시간</Text>
                    <TouchableOpacity onPress={() => { setViewHours(!viewHours) }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={TextStyles.common}>
                        {detailData.open_hours}
                      </Text>
                      <View style={{ marginLeft: 20, transform: [{ rotate: viewHours ? '180deg' : '0deg' }] }}><ToggleOpen /></View>
                    </TouchableOpacity>
                    {
                      viewHours &&
                      <>
                        <Text style={{ fontSize: 12, color: '#000000' }}>월 : {detailData.mon_hours}</Text>
                        <Text style={{ fontSize: 12, color: '#000000' }}>화 : {detailData.tues_hours}</Text>
                        <Text style={{ fontSize: 12, color: '#000000' }}>수 : {detailData.wed_hours}</Text>
                        <Text style={{ fontSize: 12, color: '#000000' }}>목 : {detailData.thurs_hours}</Text>
                        <Text style={{ fontSize: 12, color: '#000000' }}>금 : {detailData.fri_hours}</Text>
                        <Text style={{ fontSize: 12, color: '#000000' }}>토 : {detailData.sat_hours}</Text>
                        <Text style={{ fontSize: 12, color: '#000000' }}>일 : {detailData.sun_hours}</Text>
                      </>
                    }
                    {
                      detailData.etc_hours &&
                      <>
                        <Text style={TextStyles.common}>브레이크타임</Text>
                        <Text style={TextStyles.common}>{detailData.etc_hours}</Text>
                      </>
                    }
                    <Text style={TextStyles.common}>
                      {detailData.short_cur}
                    </Text>
                    {detailData.pet_category && <Text style={TextStyles.common}>반려동물 출입 가능</Text>}
                    {detailData.reusable_con_category && <Text style={TextStyles.common}>재사용 용기 사용 가능</Text>}
                    {detailData.tumblur_category && <Text style={TextStyles.common}>텀블러 할인 가능</Text>}
                    <Text style={TextStyles.common}>{detailData.vegan_category}</Text>
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
                    reviewData && <UserReviews category={detailData.category} rerender={rerenderScreen} reviewData={reviewData[0]} />
                  }
                  {
                    detailData.story_id != null &&
                    <StorySection>
                      <Image source={{ uri: storyData.rep_pic }} style={{ width: '100%', height: 450 }} />
                      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', position: 'absolute', width: '100%', height: '100%', paddingVertical: 35, paddingHorizontal: 20 }}>
                        <Text style={TextStyles.story_title}>{storyData.title}</Text>
                        <Text style={TextStyles.story_place_name}>{storyData.place_name}</Text>
                        <Text style={TextStyles.story_category}>{storyData.category}</Text>
                        <Text style={TextStyles.story_writer}>{storyData.nickname}님의 이야기</Text>
                        <Text numberOfLines={3} style={TextStyles.story_preview}>{storyData.preview}...<TouchableOpacity onPress={() => { navigationToTab.navigate('스토리', { id: detailData.story_id }) }} style={{ height: 18, paddingTop: 3 }}><Text style={TextStyles.story_preview}>더보기</Text></TouchableOpacity></Text>
                      </View>
                      <View style={{ position: 'absolute', top: 34, right: 30 }}><Heart white={true} like={likeStory} onPress={handleStoryLike} /></View>
                    </StorySection>
                  }
                </Section>,
                1: <Section>
                  {
                    reviewData && reviewData.map((data: reviewDataProps) => (
                      <UserReviews category={detailData.category} rerender={rerenderScreen} reviewData={data} />
                    ))
                  }
                </Section>,
                2: <Section>
                  {
                    detailData.story_id == null ? <Text style={{ margin: 15, fontWeight: '700', color: '#000000' }}>스토리가 없습니다.</Text> :
                      <StorySection>
                        <Image source={{ uri: storyData.rep_pic }} style={{ width: '100%', height: 450 }} />
                        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', position: 'absolute', width: '100%', height: '100%', paddingVertical: 35, paddingHorizontal: 20 }}>
                          <Text style={TextStyles.story_title}>{storyData.title}</Text>
                          <Text style={TextStyles.story_place_name}>{storyData.place_name}</Text>
                          <Text style={TextStyles.story_category}>{storyData.category}</Text>
                          <Text style={TextStyles.story_writer}>{storyData.nickname}님의 이야기</Text>
                          <Text numberOfLines={3} style={TextStyles.story_preview}>{storyData.preview}...<TouchableOpacity onPress={() => { navigationToTab.navigate('스토리', { id: detailData.story_id }) }} style={{ height: 18, paddingTop: 3 }}><Text style={TextStyles.story_preview}>더보기</Text></TouchableOpacity></Text>
                        </View>
                        <View style={{ position: 'absolute', top: 34, right: 30 }}><Heart white={true} like={likeStory} onPress={handleStoryLike} /></View>
                      </StorySection>
                  }
                </Section>,
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
    fontSize: 12,
    color: '#000000',
    marginVertical: 5
  },
  commonColor: {
    fontSize: 12,
    color: '#848484',
    lineHeight: 15,
    marginBottom: 5
  },
  story_title: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  story_place_name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 10
  },
  story_category: {
    fontSize: 10,
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 7,
    paddingVertical: 2
  },
  story_writer: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 250,
    marginBottom: 10
  },
  story_preview: {
    fontSize: 10,
    color: '#FFFFFF',
    lineHeight: 18,
  }
})