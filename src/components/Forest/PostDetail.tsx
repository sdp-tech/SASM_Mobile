import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import { TextPretendard as Text } from "../../common/CustomText";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  ImageBackground,
  Dimensions,
  Share
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import RenderHTML from 'react-native-render-html';
import styled from "styled-components/native";
import Heart from "../../common/Heart";
import Arrow from "../../assets/img/common/Arrow.svg";
import Report from '../../assets/img/Forest/Report.svg';
import WriteComment from "./components/WriteComment";
import Comment from "./components/Comment";
import CommentIcon from '../../assets/img/Story/Comment.svg';
import ShareIcon from '../../assets/img/common/Share.svg';
import Check from '../../assets/img/common/Check.svg';
import { LoginContext } from "../../common/Context";
import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import CardView from "../../common/CardView";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

interface Post {
  id: number;
  board: number;
  title: string;
  subtitle: string;
  category: any;
  content: string;
  writer: any;
  email: string;
  created: string;
  updated: string;
  like_cnt: number;
  comment_cnt: number;
  viewCount: number;
  user_likes: boolean;
  rep_pic: string;
  photos: Array<string>;
  hashtags: Array<string>;
  semi_categories: Array<string>;
}

interface PostDetailSectionProps {
  post: Post;
  navigation: any;
  onReport: () => void;
}

interface UserInfoSectionProps {
  user: any;
  posts: any;
  isLogin: boolean;
  navigation: any;
  onRefresh: any;
}

interface PostRecommendSectionProps {
  data: any;
}

const { width, height } = Dimensions.get('screen');

const PostDetailSection = ({
  post,
  navigation,
  onReport
}: PostDetailSectionProps) => {
  const markup = {
    html: `${post?.content}`
  }

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true
    }
  };
  return (
    <View>
      <ImageBackground
        style={{ height: 400 }}
        source={{
          uri: post.rep_pic,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: 45,
            alignSelf: "center",
            flex: 1,
            padding: 10
          }}
        >
          <TouchableOpacity style={{ marginTop: 5 }} onPress={() => { navigation.goBack() }}>
            <Arrow width={18} height={18} transform={[{ rotate: '180deg' }]} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 15,
              marginLeft: width / 2 - 50,
              flex: 1
            }}
          >
            {post.category.name}
          </Text>
        </View>
        <View style={{ flex: 1, padding: 20, justifyContent: 'flex-end' }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 15,
              color: "white",
            }}
            numberOfLines={2}
          >
            {post.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#F4F4F4",
              marginBottom: 15,
              opacity: 0.8,
            }}
            numberOfLines={2}
          >
            {post.subtitle}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: '#F4F4F4', fontSize: 12, fontWeight: '400' }}>작성: {post.created.slice(0, 10)}</Text>
            <Text style={{ color: '#F4F4F4', fontSize: 12, fontWeight: '400' }}> / 마지막 수정: {post.updated.slice(0, 10)}</Text>
            <Text style={{ flex: 1, textAlign: 'right', color: '#67D393', fontSize: 14, fontWeight: '400' }}>{post.writer.nickname}</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={{ padding: 15 }}>
        <RenderHTML
          contentWidth={width}
          source={markup}
          renderersProps={renderersProps}
        />
        <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {post.hashtags && (
              post.hashtags.map((name, index) => {
                return (
                  <Text style={{ color: '#848484', fontSize: 14 }} key={index}>#{name} </Text>
                )
              })
            )}
          </View>
          <TouchableOpacity onPress={onReport}>
            <Report />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'flex-start' }}>
          <CardView data={post.semi_categories} offset={0} gap={0} pageWidth={100} dot={false} renderItem={({ item }: any) => {
            return (
              <View style={{ borderRadius: 16, backgroundColor: '#67D393', paddingVertical: 4, paddingHorizontal: 16, marginRight: 8, justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{item.name}</Text>
              </View>
            )
          }} />
        </View>
      </View>
    </View>
  );
};

const UserInfoSection = ({
  user, posts, isLogin, navigation, onRefresh
}: UserInfoSectionProps) => {
  const [follow, setFollow] = useState<boolean>(false);
  const request = new Request();
  const onFollow = async () => {
    if (isLogin) {
      const response = await request.post('/mypage/follow/', {
        targetEmail: user.email
      }, {});
      setFollow(response.data.data.follows);
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
  }
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 20,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: "#E3E3E3",
        borderBottomColor: "#E3E3E3",
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <Image
          style={{ width: 56, height: 56, borderRadius: 60 }}
          source={{
            uri: user.profile,
          }}
        />
        <TouchableOpacity style={{ width: 75, borderColor: '#67D393', borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 15, marginTop: 20 }} onPress={onFollow}>
          <Text style={{ color: '#202020', fontSize: 12 }}>{follow ? '팔로잉' : '+ 팔로우'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginLeft: 20 }}>
        <View style={{ flexDirection: 'row', marginBottom: 10, flex: 1 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: user.is_verified ? '#209DF5' : '#67D393' }}>{user.is_verified ? 'Editor' : 'User'}</Text>
          <Text style={{ color: '#202020', fontSize: 12, fontWeight: '600' }}> {user.nickname}님의 다른 글</Text>
        </View>
        <FlatList data={posts.slice(0, 4)} scrollEnabled={false} renderItem={({ item }: any) => {
          return (
            <TouchableOpacity style={{ borderBottomColor: '#EDF8F2', borderBottomWidth: 0.5 }} onPress={() => { navigation.push('PostDetail', { post_id: item.id }) }}>
              <Text style={{ color: '#3C3C3C', fontSize: 10, lineHeight: 18, opacity: 0.6, }} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          )
        }} />
      </View>
      <View style={{ justifyContent: 'center' }}>
      </View>
    </View>
  );
};

const PostRecommendSection = ({ data }: PostRecommendSectionProps) => {
  return (
    <View style={{
      marginVertical: 20,
      padding: 20,
      borderTopWidth: 2,
      borderBottomWidth: 2,
      borderTopColor: "#E3E3E3",
      borderBottomColor: "#E3E3E3",
    }}>
      <Text>추천글</Text>
      <CardView
        gap={0}
        offset={0}
        dot={false}
        pageWidth={120}
        data={data}
        renderItem={({ item }: any) => {
          return (
            <TouchableOpacity style={{ marginLeft: 10 }}>
              <ImageBackground
                source={{ uri: item.uri }}
                style={{
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white" }}>{item.title}</Text>
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

interface BottomBarSectionProps {
  post: Post;
  email: string;
  onUpdate: () => void;
  onDelete: () => void;
  onShare: () => void;
  onRefresh: any;
  navigation: any;
}

const BottomBarSection = ({ post, email, onUpdate, onDelete, onShare, onRefresh, navigation }: BottomBarSectionProps) => {
  const [like, setLike] = useState<boolean>(post.user_likes)
  const request = new Request();

  const toggleLike = async () => {
    if(email){
    const response = await request.post(`/forest/${post.id}/like/`);
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
      <TouchableOpacity style={{marginRight: 5}} onPress={onShare}>
        <ShareIcon />
      </TouchableOpacity>
      {post.writer.email === email && (
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

const PostDetailScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ForestStackParams, "PostDetail">) => {
  const scrollRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState<Post>();
  const [comment, setComment] = useState([] as any);
  const [commentId, setCommentId] = useState<number>(0);
  const [user, setUser] = useState([] as any);
  const [updateText, setUpdateText] = useState<string>('');
  const [writerPosts, setWriterPosts] = useState([] as any);
  const {isLogin, setLogin} = useContext(LoginContext);

  const request = new Request();
  const post_id = route.params.post_id;

  const checkUser = async () => {
    const response = await request.get(`/mypage/me/`, {}, {});
    setUser(response.data.data);
  }

  const loadItem = async () => {
    setLoading(true);
    const response_detail = await request.get(`/forest/${post_id}/`, {}, {});
    setPost(response_detail.data.data);
    const response_comment = await request.get(`/forest/${post_id}/comments/`, {}, {});
    setComment(response_comment.data.data.results);
    const response_writer = await request.get('/forest/', { writer_filter: response_detail.data.data.writer.email })
    setWriterPosts(response_writer.data.data.results);
    setLoading(false);
  };

  const reRenderScreen = () => {
    setRefreshing(true);
    setUpdateText('');
    setRefreshing(false);
  };

  const deletePost = async () => {
    const _delete = async () => {
      await request.delete(`/forest/${post_id}/delete/`);
      navigation.goBack();
    };
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
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

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

  // 신고하기
  const reportLists = [
    "지나친 광고성 컨텐츠입니다.(상업적 홍보)",
    "욕설이 포함된 컨텐츠입니다.",
    "성희롱이 포함된 컨텐츠입니다.",
  ]

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [reported, setReported] = useState<string>('');
  const snapPoints = useMemo(() => ["40%"], []);

  const openModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" appearsOnIndex={0} disappearsOnIndex={-1} />,
    [],
  );

  const onReport = async (item: any) => {
    const response = await request.post(`/forest/${post_id}/report/`, {
      category: item
    }, {});
    setReported(item);
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

  const data = [
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
  ];

  useEffect(() => {
    if(isLogin) checkUser();
  }, [isLogin]);

  useEffect(() => {
    loadItem();
  }, [refreshing]);

  return (
    <BottomSheetModalProvider>
    <View style={styles.container}>
      {loading || post == undefined ? (
        <ActivityIndicator />
      ) : (
        <>
          <FlatList
            ref={scrollRef}
            data={comment}
            style={styles.container}
            onRefresh={reRenderScreen}
            refreshing={refreshing}
            ListHeaderComponent={
              <>
                <PostDetailSection post={post} navigation={navigation} onReport={openModal}/>
                <UserInfoSection user={post.writer} posts={writerPosts} isLogin={isLogin} navigation={navigation} onRefresh={reRenderScreen}/>
                <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10 }}>한줄평</Text>
                    <CommentIcon color={'black'}/>
                  </View>
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={() => { navigation.navigate('PostComments', { id: post_id, email: user.email }) }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
                    <Arrow width={12} height={12} />
                  </TouchableOpacity>
                </View>
                <WriteComment id={post_id} reRenderScreen={reRenderScreen} data={updateText} commentId={commentId} isLogin={isLogin} navigation={navigation} />
              </>
            }
            ListFooterComponent={
              <>
                <PostRecommendSection data={data} />
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                  <TouchableOpacity onPress={scrollToTop} style={{ flexDirection: 'row' }}>
                    <Arrow width={18} height={18} transform={[{rotate: '270deg'}]} />
                    <Text style={{color: '#666666', fontWeight: '600', marginTop: 3}}>맨 위로 이동</Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            renderItem={({ item }) => {
              return (
                <Comment data={item} reRenderScreen={reRenderScreen} post_id={post_id} email={user.email} isLogin={isLogin} navigation={navigation} callback={callback} />
              )
            }}
          />
          <BottomBarSection post={post} email={user.email} navigation={navigation} onShare={onShare} onDelete={deletePost} onUpdate={() => { navigation.navigate('CategoryForm', { post: post }) }} onRefresh={reRenderScreen} />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor: '#D9D9D9'}}
          >
            {reported.length == 0 ? (  
            <>         
            <View style={{alignItems: 'center', marginTop: 35, marginBottom: 15}}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Report width={20} height={20} />
                <Text style={{marginLeft: 8, fontSize: 16, fontWeight: '700',  letterSpacing: -0.6}}>이 글을 신고하는 이유가 무엇인가요?</Text>
              </View>
              <Text style={{textAlign: 'center', marginTop: 10, fontSize: 12, lineHeight: 18, letterSpacing: -0.6, color: '#848484'}}>지적재산권 침해를 신고하는 경우를 제외하고{"\n"}회원님의 신고는 익명으로 처리됩니다.</Text>
            </View>
            <FlatList data={reportLists} renderItem={({item}) => {
              return (
                <TouchableOpacity onPress={() => {onReport(item);}} style={{flexDirection: 'row', padding: 15, borderTopColor: '#E3E3E3', borderTopWidth: 1, alignItems: 'center'}}>
                  <Text style={{color: '#202020', fontSize: 14, fontWeight: '500', flex: 1}}>{item}</Text>
                  <Arrow width={18} height={18} />
                </TouchableOpacity>
              )
            }}
            />
            </>) : (
            <View style={{alignItems: 'center', justifyContent: 'center', margin: 50}}>
              <Check color={'#67D393'} width={37} height={37} />
              <Text style={{marginTop: 15, fontSize: 16, fontWeight: '700',  letterSpacing: -0.6, color: '#FF4C00'}}>{reported}</Text>
              <Text style={{marginLeft: 8, fontSize: 16, fontWeight: '700',  letterSpacing: -0.6}}>이 글을 신고해주셔서 감사합니다.</Text>
              <Text style={{textAlign: 'center', marginTop: 10, fontSize: 12, lineHeight: 18, letterSpacing: -0.6, color: '#848484'}}>글을 검토한 후 결과를 알려드리겠습니다.{'\n'}안전한 SASM 환경을 만들 수 있도록 도와주셔서 감사합니다.</Text>
            </View>
            )}
          </BottomSheetModal>
        </>
      )}
    </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default PostDetailScreen;
