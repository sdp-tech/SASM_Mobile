import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import { HomeStackParams } from '../../pages/Home'
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Request } from '../../common/requests'
import Arrow from "../../assets/img/common/Arrow.svg";
import { ScrollView } from 'react-native-gesture-handler'
import styled from 'styled-components/native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppProps, TabProps } from '../../../App'
import CardView from '../../common/CardView'
import { CurationPlusButton } from './CurationHome'
import Heart from '../../common/Heart'

const { width, height } = Dimensions.get('window');

const InfoBox = styled.View`
  padding-horizontal: 25px;
  margin-vertical: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
`
const ContentBox = styled.View`
  margin-vertical: 25px;
  padding-horizontal: 25px;
`
const GotoMap = styled.TouchableOpacity`
  margin: 20px auto;
`
const StorySection = styled.View`
  border-top-width: 3px;
  border-color: #EAEAEA;
  padding-vertical: 25px;
`
const StoryInfoBox = styled.View`
  padding-horizontal: 25px;
`
const GotoStory = styled.TouchableOpacity`
  background-color: #75E59B;
  border-radius: 5px;
  padding: 2px 8px;
  margin-left: 25px;
  align-items: center;
  align-self: flex-start;
`
const StoryContentBox = styled.View`
  padding-horizontal: 25px;
  margin-top: 50px;
  amrgin-bottom: 20px;
`
interface CurationDetailProps {
  contents: string;
  created: string;
  like_curation: boolean;
  map_image: string;
  rep_pic: string;
  title: string;
  writer: string;
  writer_is_verified: boolean;
}

interface CuratedStoryProps {
  created: string;
  hashtags: string;
  like_story: boolean;
  nickname: string;
  place_address: string;
  place_category: string;
  place_name: string;
  preview: string;
  profile_image: string;
  rep_photos: string[];
  story_id: number;
  story_review: string;
  writer: string;
}


export default function CurationDetail({ navigation, route }: StackScreenProps<HomeStackParams, 'Detail'>): JSX.Element {
  const navigationTab = useNavigation<StackNavigationProp<TabProps>>();
  const request = new Request();
  const [curatedStory, setCuratedStory] = useState<CuratedStoryProps[]>([]);
  const [curationDetail, setCurationDetail] = useState<CurationDetailProps>({
    contents: '',
    created: '',
    like_curation: false,
    map_image: '',
    rep_pic: '',
    title: '',
    writer: '',
    writer_is_verified: false,
  });
  const [reppicSize, setReppicSize] = useState<{ width: number; height: number; }>({
    width: 1, height: 1
  })
  const [mapImageSize, setMapImageSize] = useState<{ width: number; height: number; }>({
    width: 1, height: 1
  })
  const getCurationDetail = async () => {
    const response_detail = await request.get(`/curations/curation_detail/${route.params.id}/`);
    setCurationDetail(response_detail.data.data[0]);
    console.error(response_detail.data.data);
    Image.getSize(response_detail.data.data[0].rep_pic, (width, height) => { setReppicSize({ width: width, height: height }) });
    Image.getSize(response_detail.data.data[0].map_image, (width, height) => { setMapImageSize({ width: width, height: height }) })
  }
  const getCurationStoryDetail = async () => {
    const reponse_story_detail = await request.get(`/curations/curated_story_detail/${route.params.id}/`);
    setCuratedStory(reponse_story_detail.data.data);
  }

  useFocusEffect(useCallback(() => {
    getCurationDetail();
    getCurationStoryDetail();
  }, []))

  return (
    <>
      <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
        <TouchableOpacity style={{ position: 'absolute', top: 50, left: 10, zIndex: 2 }} onPress={navigation.goBack}>
          <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} />
        </TouchableOpacity>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: curationDetail.rep_pic }} style={{ width: width, height: width * (reppicSize.height / reppicSize.width) }} />
          <Text style={TextStyles.title} numberOfLines={4}>{curationDetail.title}</Text>
        </View>
        <InfoBox>
          <View style={{ width: 50, height: 50, backgroundColor: '#CCCCCC', borderRadius: 25, marginRight: 20 }}></View>
          <View>
            <Text style={TextStyles.writer}>{curationDetail.writer}</Text>
            <Text style={TextStyles.created}>{curationDetail.created.slice(0, 10).replace(/-/gi, '.')}작성</Text>
          </View>
        </InfoBox>
        <ContentBox>
          <Text style={TextStyles.content}>{curationDetail.contents}</Text>
        </ContentBox>
        <Image source={{ uri: curationDetail.map_image }} style={{ width: width, height: width * (mapImageSize.height / mapImageSize.width) }} />
        <GotoMap onPress={() => { navigationTab.navigate('맵', {})}}>
          <Text style={TextStyles.gotomap}>맵페이지로 이동</Text>
        </GotoMap>
        {
          curatedStory.map(data =>
            <Storys data={data} navigation={navigationTab} />
          )
        }
      </ScrollView>
      <CurationPlusButton />
    </>
  )
}

const Storys = ({ navigation, data }: { navigation: StackNavigationProp<TabProps>, data: CuratedStoryProps }) => {
  const [like, setLike] = useState<boolean>(data.like_story);
  const request = new Request();
  const handleLike = async () => {
    const response_like = await request.post('/stories/story_like/', { id: data.story_id });
    setLike(!like);
  }
  return (
    <StorySection>
      <StoryInfoBox>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={TextStyles.place_name}>{data.place_name}</Text>
          <TouchableOpacity><Heart like={like} onPress={handleLike} /></TouchableOpacity>
        </View>
        <Text style={{ fontSize: 12 }}>{data.place_address}</Text>
      </StoryInfoBox>
      <InfoBox>
        <Image source={{ uri: data.profile_image }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 20 }} />
        <View>
          <Text style={TextStyles.writer}>{data.nickname}</Text>
          <Text style={TextStyles.created}>{data.created.slice(0, 10).replace(/-/gi, '.')}작성</Text>
        </View>
      </InfoBox>
      <StoryContentBox>
        <Text style={TextStyles.category}>{data.place_category}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>{data.story_review}</Text>
        <Text style={{ fontSize: 12 }}>{data.preview}...</Text>
        <Text style={TextStyles.hashtags}>{data.hashtags}</Text>
      </StoryContentBox>
      <GotoStory onPress={() => { navigation.navigate('스토리', { id: data.story_id }) }}>
        <Text style={{ fontSize: 12, color: '#FFFFFF' }}>스토리 보러 가기</Text>
      </GotoStory>
    </StorySection>
  )
}

const TextStyles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '700',
    position: 'absolute',
    paddingHorizontal: 20,
    bottom: 20,
    width: '100%',
  },
  content: {
    color: '#6B6B6B',
    fontSize: 12
  },
  writer: {
    fontSize: 12,
    fontWeight: '600'
  },
  created: {
    color: '#676767',
    fontSize: 8,
  },
  gotomap: {
    fontSize: 12,
    color: '#545454'
  },
  place_name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
    alignSelf: 'flex-start'
  },
  hashtags: {
    fontSize: 10,
    marginVertical: 20
  },
  category: {
    fontSize: 10,
    color: '#707070',
    borderColor: '#707070',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 20
  },
})
