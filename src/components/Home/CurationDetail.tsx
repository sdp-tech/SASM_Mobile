import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import { HomeStackParams } from '../../pages/Home';
import { Alert, Dimensions, Image, ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { Request } from '../../common/requests';
import Arrow from "../../assets/img/common/Arrow.svg";
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppProps, TabProps } from '../../../App';
import CardView from '../../common/CardView';
import Heart from '../../common/Heart';
import ShareButton from "../../common/ShareButton";
import CommentIcon from '../../assets/img/Story/Comment.svg';
import { LoginContext } from '../../common/Context';
import { getStatusBarHeight } from 'react-native-safearea-height';

const { width, height } = Dimensions.get('window');

const InfoBox = styled.View`
  padding-horizontal: 25px;
  margin-vertical: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
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
  flex-direction: row;
  padding: 2px 8px;
  margin-right: 10px;
  align-self: flex-end;
  align-items: center;
`
const StoryContentBox = styled.View`
  padding-horizontal: 25px;
  margin-vertical: 20px;
`
interface CurationDetailProps {
  contents: string;
  created: string;
  updated: string;
  like_curation: boolean;
  like_cnt: number;
  nickname: string;
  profile_image: string;
  map_image: string;
  rep_pic: string;
  title: string;
  writer_email: string;
  writer_is_verified: boolean;
  writer_is_followed: boolean;
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
  writer_email: string;
  writer_is_followed: boolean;
}

const handleFollow = async (target: string, isLogin: boolean, navigation: StackNavigationProp<TabProps>, following?: boolean, setFollowing?: Dispatch<SetStateAction<boolean>>) => {
  const request = new Request();
  if (!isLogin) {
    Alert.alert('로그인이 필요합니다', "",
      [
        {
          text: "로그인",
          onPress: () => navigation.navigate('마이페이지'),
          style: "cancel"
        },
        {
          text: "ok",
          style: "cancel"
        },
      ])
    return;
  }

  const response = await request.post('/mypage/follow/',
    {
      targetEmail: target
    })
  if (setFollowing) {
    setFollowing(!following);
  }
  if (response.data.status == 'fail') Alert.alert(response.data.message)
}

const BottomBarSection = ({ id, post, isLogin, onRefresh, navigation }:{id: number; post: CurationDetailProps, isLogin: boolean, onRefresh: () => void, navigation: any;}) => {
  const [like, setLike] = useState<boolean>(false)
  const request = new Request();

  useEffect(()=> {
    post.like_curation ? setLike(true) : setLike(false)
  }, [post.like_curation])

  useEffect(() => {
    console.error(post.rep_pic);
  }, [])
  const toggleLike = async () => {
    if (isLogin) {
      const response = await request.post(`/curations/curation_like/${id}/`);
      setLike(!like);
      onRefresh();
    } else {
      Alert.alert(
        "로그인이 필요합니다.",
        "로그인 항목으로 이동하시겠습니까?",
        [
          {
            text: "이동",
            onPress: () => navigation.navigate('마이페이지')

          },
          {
            text: "취소",
            onPress: () => { },
            style: "cancel"
          },
        ],
        { cancelable: false }
      );
    }
  };
  return (
    <View style={{ flexDirection: "row", padding: 10, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
        <Heart color={'#202020'} like={like} onPress={toggleLike} size={18} ></Heart>
        <Text style={{fontSize: 14, color: '#202020', lineHeight: 20, marginLeft: 3, marginRight: 10}}>{post.like_cnt}</Text>
        {/* <TouchableOpacity onPress={scrollToComment}>
          <CommentIcon color={'#202020'} />
        </TouchableOpacity>
        <Text style={{fontSize: 14, color: '#202020', lineHeight: 20, marginLeft: 3}}>{post.comment_cnt}</Text> */}
      </View>
      <ShareButton color={'black'} message={`[SASM Curation] ${post.title}`} image={post.rep_pic} description={post.contents} id={id} />
    </View>
  )
}

export default function CurationDetail({ navigation, route }: StackScreenProps<HomeStackParams, 'Detail'>): JSX.Element {
  const { isLogin, setLogin } = useContext(LoginContext);
  const navigationTab = useNavigation<StackNavigationProp<TabProps>>();
  const request = new Request();
  const [like, setLike] = useState<boolean>(false);
  const [following, setFollowing] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [curatedStory, setCuratedStory] = useState<CuratedStoryProps[]>([]);
  const [curationDetail, setCurationDetail] = useState<CurationDetailProps>({
    contents: '',
    created: '',
    updated: '',
    like_curation: false,
    like_cnt: 0,
    map_image: '',
    rep_pic: '',
    title: '',
    nickname: '',
    profile_image: '',
    writer_email: '',
    writer_is_verified: false,
    writer_is_followed: false,
  });
  const [reppicSize, setReppicSize] = useState<{ width: number; height: number; }>({
    width: 1, height: 1
  })
  const [mapImageSize, setMapImageSize] = useState<{ width: number; height: number; }>({
    width: 1, height: 1
  })
  const statusBarHeight = getStatusBarHeight();
  const getCurationDetail = async () => {
    const response_detail = await request.get(`/curations/curation_detail/${route.params.id}/`);
    setCurationDetail(response_detail.data.data);
    setLike(response_detail.data.data.like_curation);
    setFollowing(response_detail.data.data.writer_is_followed);
    Image.getSize(response_detail.data.data.rep_pic, (width, height) => { setReppicSize({ width: width, height: height }) });
    Image.getSize(response_detail.data.data.map_image, (width, height) => { setMapImageSize({ width: width, height: height }) })
  }
  const getCurationStoryDetail = async () => {
    const response_story_detail = await request.get(`/curations/curated_story_detail/${route.params.id}/`);
    setCuratedStory(response_story_detail.data.data);
  }

  const handleLike = async () => {
    if (!isLogin) {
      Alert.alert(
        "로그인이 필요합니다.",
        "로그인 항목으로 이동하시겠습니까?",
        [
          {
            text: "이동",
            onPress: () => navigationTab.navigate('마이페이지')

          },
          {
            text: "취소",
            onPress: () => { },
            style: "cancel"
          },
        ],
        { cancelable: false }
      );
      return;
    }
    const response = await request.post(`/curations/curation_like/${route.params.id}/`);
    setCurationDetail({ ...curationDetail, like_curation: !curationDetail.like_curation });
    setLike(!like);
  }

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  }

  useFocusEffect(useCallback(() => {
    getCurationDetail();
    getCurationStoryDetail();
  }, [refreshing]))

  return (
    <>
      <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
        <TouchableOpacity style={{ position: 'absolute', top: statusBarHeight, left: 10, zIndex: 2 }} onPress={navigation.goBack}>
          <Arrow width={18} height={18} transform={[{ rotate: '180deg' }]} color={'white'} />
        </TouchableOpacity>
          <ImageBackground source={{ uri: curationDetail.rep_pic }} style={{ width: width, height: width * (reppicSize.height / reppicSize.width), position:'relative' }}>
            <View style={{width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.3)', justifyContent: 'flex-end', padding: 20}}>
              <Text style={TextStyles.title} numberOfLines={4}>{curationDetail.title}</Text>
              <Text style={[TextStyles.created, {color: '#D7D7D7', marginLeft: 3}]}>
                작성 : {curationDetail.created.slice(0, 10).replace(/-/gi, '.')}  / 마지막 수정: {curationDetail.updated.slice(0, 10).replace(/-/gi, '.')}
              </Text>
            </View>
          </ImageBackground>
        <InfoBox>
          <Image source={{ uri: curationDetail.profile_image }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
          <View>
            <Text style={TextStyles.writer}>{curationDetail.nickname}</Text>
            <Text style={TextStyles.created}>{curationDetail.created.slice(0, 10).replace(/-/gi, '.')} 작성</Text>
          </View>
          <TouchableOpacity style={{ position: 'absolute', right: 25 }}
            onPress={() => { handleFollow(curationDetail.writer_email, isLogin, navigationTab, following, setFollowing) }}>
            {
              following ?
                <Text style={TextStyles.unfollow}>취소</Text> :
                <Text style={TextStyles.following}>+ 팔로잉</Text>
            }
          </TouchableOpacity>
        </InfoBox>
        <ContentBox>
          <Text style={TextStyles.content}>{curationDetail.contents}</Text>
        </ContentBox>
        <Image source={{ uri: curationDetail.map_image }} style={{ width: width, height: width * (mapImageSize.height / mapImageSize.width) }} />
        <GotoMap onPress={() => { navigationTab.navigate('맵', {}) }}>
          <Text style={TextStyles.gotomap}>맵페이지로 이동</Text>
        </GotoMap>
        {
          curatedStory.map((data, index) =>
            <Storys key={index} data={data} navigation={navigationTab} />
          )
        }
      </ScrollView>
      {/* <View style={{ flexDirection: "row", padding: 10, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <Heart color={'#202020'} like={like} onPress={handleLike} size={18} ></Heart>
          <Text style={{ fontSize: 14, color: '#202020', lineHeight: 20, marginLeft: 3, marginRight: 10 }}>{curationDetail.like_cnt}</Text>
        </View>
        <ShareButton color={'black'} message={`[SASM Curation] ${curationDetail.title}`} />
      </View> */}
      <BottomBarSection id={route.params.id} post={curationDetail} isLogin={isLogin} onRefresh={onRefresh} navigation={navigation} />
    </>
  )
}

const Storys = ({ navigation, data }: { navigation: StackNavigationProp<TabProps>, data: CuratedStoryProps }) => {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [like, setLike] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(false);
  const previewNavigation = useNavigation<StackNavigationProp<HomeStackParams>>();

  const request = new Request();
  const handleLike = async () => {
    if (!isLogin) {
      Alert.alert(
        "로그인이 필요합니다.",
        "로그인 항목으로 이동하시겠습니까?",
        [
          {
            text: "이동",
            onPress: () => navigation.navigate('마이페이지')

          },
          {
            text: "취소",
            onPress: () => { },
            style: "cancel"
          },
        ],
        { cancelable: false }
      );
      return;
    }
    const response = await request.post(`/stories/${data.story_id}/story_like/`);
    setLike(!like);
  }

  useEffect(() => {
    setFollowed(data.writer_is_followed);
    setLike(data.like_story);
  }, [])
  return (
    <StorySection>
      <StoryInfoBox>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={TextStyles.place_name}>{data.place_name}</Text>
          <TouchableOpacity><Heart color={'#202020'} like={like} onPress={handleLike} /></TouchableOpacity>
        </View>
        <Text style={{ fontSize: 14 }}>{data.place_address}</Text>
      </StoryInfoBox>
      <InfoBox>
        <Image source={{ uri: data.profile_image }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
        <View>
          <Text style={TextStyles.writer}>{data.nickname}</Text>
          <Text style={TextStyles.created}>{data.created.slice(0, 10).replace(/-/gi, '.')} 작성</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 25 }}
          onPress={() => { handleFollow(data.writer_email, isLogin, navigation, followed, setFollowed) }}>
          {
            followed ?
              <Text style={TextStyles.unfollow}>취소</Text> :
              <Text style={TextStyles.following}>+ 팔로잉</Text>
          }
        </TouchableOpacity>
      </InfoBox>
      {
        data.rep_photos != null &&
        <CardView
          pageWidth={250}
          data={data.rep_photos}
          renderItem={({ item }: any) => 
            <TouchableOpacity onPress={() => previewNavigation.navigate('PhotoPreview', { photoUri: item })}>
              <Image source={{ uri: item }} style={{ width: 250, height: 300, marginHorizontal: 5 }} />
            </TouchableOpacity>
            }
          gap={10}
          offset={15}
          dot={false} />
      }
      <StoryContentBox>
        <Text style={TextStyles.category}>{data.place_category}</Text>
        <Text style={TextStyles.story_review}>{data.story_review}</Text>
        <Text>{data.preview}</Text>
        <Text style={TextStyles.hashtags}>{data.hashtags}</Text>
      </StoryContentBox>
      <GotoStory onPress={() => { navigation.navigate('스토리', { id: data.story_id }) }}>
        <Text style={{ fontSize: 14, color: 'black' }}>스토리 보러 가기</Text>
        <Arrow width={14} height={14} style={{marginLeft: 5}} color={'black'} />
      </GotoStory>
    </StorySection>
  )
}

const TextStyles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    color: '#6B6B6B',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.6
  },
  writer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#67D393',

  },
  created: {
    color: '#676767',
    fontSize: 12,
    lineHeight: 18
  },
  gotomap: {
    fontSize: 14,
    color: '#545454'
  },
  story_review: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '700',
  },
  place_name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  hashtags: {
    fontSize: 14,
    marginVertical: 20,
  },
  category: {
    fontSize: 12,
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
  following: {
    width: 75,
    height: 28,
    borderRadius: 14,
    color: '#FFFFFF',
    backgroundColor: '#4DB1F7',
    letterSpacing: -0.6,
    fontSize: 14,
    lineHeight: 28,
    textAlign: 'center',
    overflow: 'hidden'
  },
  unfollow: {
    width: 75,
    height: 28,
    borderRadius: 14,
    borderColor: '#4DB1F7',
    borderWidth: 1,
    letterSpacing: -0.6,
    fontSize: 14,
    lineHeight: 28,
    textAlign: 'center',
    overflow: 'hidden'
  }
})
