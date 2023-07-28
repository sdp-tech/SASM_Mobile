import { SafeAreaView, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, FlatList, Image, Share, Alert, ImageBackground, ActivityIndicator } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { useState, useEffect, useRef, useContext } from 'react';
import { Request } from '../../common/requests';
import Heart from '../../common/Heart';
import Comment from './components/Comment';
import WriteComment from './components/WriteComment';
import Arrow from '../../assets/img/common/Arrow.svg';
import CardView from '../../common/CardView';
import CommentIcon from '../../assets/img/Story/Comment.svg';
import StoryDetailBox, { StoryDetail } from './components/StoryDetailBox';
import { StoryProps } from '../../pages/Story';
import { LoginContext } from '../../common/Context';
import ShareButton from "../../common/ShareButton";
import Report from '../../common/Report';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

interface PostRecommendSectionProps {
  item: any;
}

interface BottomBarSectionProps {
  post: any;
  email: string;
  onUpdate: () => void;
  onDelete: () => void;
  onRefresh: any;
  navigation: any;
}

const { width, height } = Dimensions.get('screen');

const PostRecommendSection = ({ item }: PostRecommendSectionProps) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10, flex: 1 }}>스토리가 포함된 큐레이션</Text>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {}}>
          <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
          <Arrow width={12} height={12} />
        </TouchableOpacity>
      </View>
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
    <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10, flex: 1 }}>이 장소의 다른 스토리</Text>
      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {}}>
        <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
        <Arrow width={12} height={12} />
      </TouchableOpacity>
    </View>
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

const BottomBarSection = ({ post, email, onUpdate, onDelete, onRefresh, navigation }: BottomBarSectionProps) => {
  const [like, setLike] = useState<boolean>(post.story_like)
  const request = new Request();

  const toggleLike = async () => {
    if (email) {
      const response = await request.post(`/stories/${post.id}/story_like/`);
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
      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
        <Heart color={'#202020'} like={like} onPress={toggleLike} size={18} ></Heart>
        <Text style={{fontSize: 14, color: '#202020', lineHeight: 20, marginLeft: 3, marginRight: 10}}>{post.like_cnt}</Text>
        <CommentIcon color={'#202020'} />
        <Text style={{fontSize: 14, color: '#202020', lineHeight: 20, marginLeft: 3}}>{post.comment_cnt}</Text>
      </View>
      <ShareButton color='black' message={`[SASM Story] ${post.title} - ${post.html_content}`} />
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
  const { isLogin, setLogin } = useContext(LoginContext);
  const [data, setData] = useState<StoryDetail>();
  const [comment, setComment] = useState([] as any);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [updateText, setUpdateText] = useState<string>('');
  const [commentId, setCommentId] = useState<number>(0);
  const [reported, setReported] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const request = new Request();

  const checkUser = async () => {
    const response = await request.get(`/mypage/me/`, {}, {});
    setEmail(response.data.data.email);
  }

  const loadItem = async () => {
    const response_detail = await request.get(`/stories/story_detail/${id}/`);
    const response_comment = await request.get("/stories/comments/", { story: id }, null);
    setData(response_detail.data.data);
    setComment(response_comment.data.data.results);
  };

  const reRenderScreen = () => {
    setRefreshing(true);
    setUpdateText('');
    setRefreshing(false);
  }

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

  const onReport = async (item: any) => {
    const response = await request.post('/report/create/', {
      target: `story:post:${id}`,
      reason: item
    }, {});
    setReported(item)
  }

  const callback = (text: string, id: number) => {
    setUpdateText(text);
    setCommentId(id);
  }

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  useEffect(() => {
    if (isLogin) checkUser();
  }, [isLogin]);

  useEffect(() => {
    loadItem();
    getStories();
  }, [refreshing]);

  const [item, setItem] = useState([])
  const getStories = async () => {
    const response = await request.get('/stories/story_search/', {
      page: 1,
      search: null,
      latest: true
    }, null);
    setItem(response.data.data.results);
  }

  return (
    <BottomSheetModalProvider>
    <View style={{flex: 1, backgroundColor: 'white'}}>
        {data == undefined ? (
            <ActivityIndicator />
        ) : (
            <>
            <FlatList
                ref={scrollRef}
                data = {comment}
                onRefresh = {reRenderScreen}
                refreshing = {refreshing}
                keyExtractor={(item, index) => item.id.toString()}
                ListHeaderComponent={
                <>
                    <StoryDetailBox data={data} navigation={navigation} isLogin={isLogin} />
                    <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1, marginTop: 40}} />
                    <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
                      <View style={{flexDirection: 'row', flex: 1}}>
                        <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10 }}>한줄평</Text>
                        <CommentIcon color={'black'}/>
                      </View>
                      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => {navigation.navigate('CommentList', { id: id, email: email })}}>
                        <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
                        <Arrow width={12} height={12} />
                      </TouchableOpacity>
                    </View>
                    <WriteComment id = {id} reRenderScreen = {reRenderScreen} data={updateText} commentId={commentId} isLogin={isLogin} navigation={navigation} />
                </>}
                renderItem = {({item}) => { 
                    return (
                        <Comment data = {item} story_id={id} reRenderScreen = {reRenderScreen} email={email} callback={callback} isLogin={isLogin} navigation={navigation}/>
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
            <BottomBarSection post={data} email={email} navigation={navigation} onDelete={deleteStory} onUpdate={() => { navigation.navigate('WriteStoryPage', { id: data!.id }) }} onRefresh={reRenderScreen} />
            <Report reported={reported} modalVisible={modalVisible} setModalVisible={setModalVisible} onReport={onReport} />
            </>
        )}
    </View>
    </BottomSheetModalProvider>
)}

export default StoryDetailPage;