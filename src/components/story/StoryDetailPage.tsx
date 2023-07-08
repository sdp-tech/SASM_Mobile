import { SafeAreaView, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, FlatList, Image, Share, Alert, ImageBackground } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { useState, useEffect, useRef } from 'react';
import Loading from '../../common/Loading';
import { Request } from '../../common/requests';
import Heart from '../../common/Heart';
import RenderHTML from 'react-native-render-html';
import Comment from './components/Comment';
import WriteComment from './components/WriteComment';
import Place from '../../assets/img/Story/Place.svg';
import Arrow from '../../assets/img/common/Arrow.svg';
import CardView from '../../common/CardView';
import ShareIcon from '../../assets/img/common/Share.svg';
import Scrap from '../../assets/img/Forest/Scrap.svg';
import CommentIcon from '../../assets/img/Story/Comment.svg';
import StoryDetailBox, { StoryDetail } from './components/StoryDetailBox';
import { StoryProps } from '../../pages/Story';

interface PostRecommendSectionProps {
  item: any;
}

interface BottomBarSectionProps {
  post: any;
  email: string;
  onUpdate: () => void;
  onDelete: () => void;
  onShare: () => void;
  onRefresh: any;
  navigation: any;
}

const { width, height } = Dimensions.get('screen');

const PostRecommendSection = ({item}: PostRecommendSectionProps) => {
  return (
    <View>
      <Text style={textStyles.subject}>스토리가 포함된 큐레이션</Text>
      <CardView 
                        gap={10}
                        offset={12}
                        data={item}
                        pageWidth={width*0.6}
                        dot={false}
                        renderItem={({item}: any) => (
                            <TouchableOpacity style={{marginHorizontal: 8}}>
                                <ImageBackground
                                    style={{width: width*0.5, height: width*0.5}}
                                    source={{uri: item.rep_pic}}
                                    imageStyle={{borderRadius: 5}}
                                    resizeMode='cover'
                                >
                                    <View style={{width: width*0.5, height: width*0.5, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'flex-end'}}>
                                    <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 10, marginLeft: 10, color: 'white'}}>서울 어쩌구 저쩌구{"\n"}비건 카페 5곳</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                            
                        )}
                    />
                    <Text style={textStyles.subject}>이 장소의 다른 스토리</Text>
                    <CardView 
                        gap={10}
                        offset={12}
                        data={item}
                        pageWidth={width*0.6}
                        dot={false}
                        renderItem={({item}: any) => (
                            <TouchableOpacity style={{marginHorizontal: 8}}>
                                <ImageBackground
                                    style={{width: width*0.5, height: width*0.25}}
                                    source={{uri: item.rep_pic}}
                                    imageStyle={{borderRadius: 5}}
                                    resizeMode='cover'
                                >
                                    <View style={{width: width*0.5, height: width*0.25, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'flex-end'}}>
                                    <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 10, marginLeft: 10, color: 'white'}}>서울 어쩌구 저쩌구{"\n"}비건 카페 5곳</Text>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                            
                        )}
                    />
    </View>
  )
}

const BottomBarSection = ({ post, email, onUpdate, onDelete, onShare, onRefresh, navigation }: BottomBarSectionProps) => {
  const [like, setLike] = useState<boolean>(post.story_like)
  const request = new Request();

  const toggleLike = async () => {
    if(email){
    const response = await request.post(`/stories/story_like/`, {
      id: post.id
    });
    setLike(!like);
    onRefresh();
    } else {
      Alert.alert(
        "로그인이 필요합니다.",
        "로그인 항목으로 이동하시겠습니까?",
        [
            {
                text: "이동",
                onPress: () => navigation.navigate('Login')

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
    <View style={{ flexDirection: "row", padding: 10 }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Heart like={like} onPress={toggleLike}></Heart>
        {/* <Text>{post.like_cnt}</Text> */}
        <CommentIcon />
        {/* <Text>{post.comment_cnt}</Text> */}
      </View>
      <TouchableOpacity>
        <Scrap fill={'black'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onShare}>
        <ShareIcon />
      </TouchableOpacity>
      {post.writer === email && (
        <>
          <TouchableOpacity onPress={onUpdate}>
            <Text>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Text>삭제</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const StoryDetailPage = ({ navigation, route }: StoryProps) => {
  const id = route.params.id;
  const scrollRef = useRef<FlatList>(null);
  const [data, setData] = useState<StoryDetail>();
  const [comment, setComment] = useState([] as any);
  const [like, setLike] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [updateText, setUpdateText] = useState<string>('');
  const [commentId, setCommentId] = useState<number>(0);
  const request = new Request();

  const checkUser = async () => {
      const response = await request.get(`/mypage/me/`,{},{});
      setEmail(response.data.data.email);
      console.log('email', email);
  }
  
  const loadItem = async () => {
      setLoading(true);
      const response_detail = await request.get(`/stories/story_detail/${id}/`);
      const response_comment = await request.get("/stories/comments/", { story: id }, null);
      setData(response_detail.data.data);
      setComment(response_comment.data.data.results);
      setLoading(false);
  };

  const reRenderScreen = () => {
      setRefreshing(true);
      setUpdateText('');
      setRefreshing(false);
  }

  const onRefresh = async () => {
      if(!refreshing){
          setRefreshing(true);
          await loadItem();
          setRefreshing(false);
      }
  }

  const onShare = async () => {
      try {
        const result = await Share.share({
          message:
            'React Native | A framework for building native apps using React',
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error: any) {
        Alert.alert(error.message);
      }
  };

  const deleteStory = async () => {
      const _delete = async () => {
          await request.delete(`/stories/${id}/delete/`, {});
          navigation.goBack();
      }
      Alert.alert(
          "게시글 삭제 확인",
          "정말로 삭제하시겠습니까?",
          [
              {
                  text: "삭제",
                  onPress: () => _delete(),

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

  const callback = (text: string, id: number) => {
      setUpdateText(text);
      setCommentId(id);
      console.log(updateText);
  }

  const scrollToTop = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    };

  useEffect(() => {
      checkUser();
      loadItem();
      getStories();
  }, [refreshing]);

  const [item,setItem] = useState([])
  const getStories = async () => {
      const response = await request.get('/stories/story_search/', {
          page: 1,
          search: null,
          latest: true
      }, null);
      setItem(response.data.data.results);
  }

  return (
    <>
        {loading ? (
            <Loading />
        ) : (
            <View style={{flex: 1, backgroundColor: 'white'}}>
            <FlatList
                ref={scrollRef}
                data = {comment}
                onRefresh = {onRefresh}
                refreshing = {refreshing}
                disableVirtualization = {false}
                ListHeaderComponent={
                <>
                    <StoryDetailBox data={data} navigation={navigation}/>
                    <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1, marginTop: 40}} />
                    <View style={{flexDirection: 'row'}}>
                        <Text style={textStyles.subject}>한줄평</Text>
                        <View style={{marginTop: 15}}><CommentIcon /></View>
                        <TouchableOpacity style={{marginLeft: 260, marginTop: 15}} onPress={() => {navigation.navigate('CommentList', { id: id, email: email })}}>
                            <Text style={{fontSize: 10}}>더보기{'>'}</Text>
                        </TouchableOpacity>
                    </View>
                    <WriteComment id = {id} reRenderScreen = {reRenderScreen} data={updateText} commentId={commentId} />
                </>}
                renderItem = {({item}) => { 
                    return (
                        <Comment data = {item} reRenderScreen = {reRenderScreen} email={email} callback={callback} />
                    )
                }}
                ListFooterComponent = {
                <>
                    <PostRecommendSection item={item} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                        <TouchableOpacity onPress={scrollToTop} style={{ flexDirection: 'row' }}>
                            <Arrow width={18} height={18} transform={[{rotate: '270deg'}]} />
                            <Text style={{color: '#666666', fontWeight: '600', marginTop: 3}}>맨 위로 이동</Text>
                        </TouchableOpacity>
                    </View>
                </>}
            />
            <BottomBarSection post={data} email={email} navigation={navigation} onShare={onShare} onDelete={deleteStory} onUpdate={() => { navigation.navigate('WriteStoryPage', { id: data!.id }) }} onRefresh={reRenderScreen} />
            </View>
        )}
    </>
)}

const textStyles = StyleSheet.create({
  title: {
      fontSize: 16,
      fontWeight: '700',
      marginVertical: 5
  },
  semi_title: {
      fontSize: 12,
      fontWeight: '400'
  },
  date: {
      fontSize: 10,
      fontWeight: '400',
      marginTop: 4,
      color: '#676767'
  },
  category: {
      fontSize: 12,
      fontWeight: '400',
      marginVertical: 10,
      alignSelf: 'flex-start', 
      borderRadius: 12, 
      paddingHorizontal: 16, 
      paddingVertical: 4, 
      overflow: 'hidden', 
      lineHeight: 14, 
      color: '#ADADAD', 
      borderColor: '#B1B1B1', 
      borderWidth: 1
  },
  verified: {
      fontSize: 8,
      fontWeight: '600',
      color: 'white', 
      alignSelf: 'center', 
      justifyContent: 'center'
  },
  writer: {
      fontSize: 8,
      fontWeight: '600',
      marginTop: 8,
      marginLeft: 15
  },
  subject: {
      fontSize: 14,
      fontWeight: '500',
      margin: 15
  }
})

export default StoryDetailPage;