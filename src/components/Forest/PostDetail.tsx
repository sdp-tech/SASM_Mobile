import React, { useState, useEffect } from "react";
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
  Dimensions
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
import Share from '../../assets/img/common/Share.svg';
import Scrap from '../../assets/img/Forest/Scrap.svg';

import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import CardView from "../../common/CardView";

interface Post {
  id: number;
  board: number;
  title: string;
  subtitle: string;
  category: string;
  content: string;
  writer: any;
  email: string;
  created: string;
  updated: string;
  like_cnt: number;
  viewCount: number;
  likes: boolean;
  photos: Array<string>;
  hashtags: Array<string>;
  semi_categories: Array<string>;
}

interface PostDetailSectionProps {
  post: Post;
  boardname: string;
  //navToPostUpload: any;
  // deletePost: any;
  navToPhotoPreview: any;
}

interface UserInfoSectionProps {
  user: any;
  onFollow: () => void;
}

interface PostRecommendSectionProps {
  data: any;
}

const { width, height } = Dimensions.get('screen');

const PostDetailSection = ({
  post,
  boardname,
  //navToPostUpload,
  // deletePost,
  navToPhotoPreview,
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
          uri: post.photos[0],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginTop: 45,
            alignSelf: "center",
            flex: 1,
          }}
        >
          <TouchableOpacity>
            <Arrow transform={[{ rotate: '180deg'}]}/>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 15,
              textAlign: "center",
              flex: 1
            }}
          >
            {boardname}
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
          <View style={{flexDirection: "row"}}>
            <Text style={{color: '#F4F4F4', fontSize: 12, fontWeight: '400'}}>작성: {post.created.slice(0, 10)}</Text>
            <Text style={{color: '#F4F4F4', fontSize: 12, fontWeight: '400'}}> / 마지막 수정: {post.updated.slice(0, 10)}</Text>
            <Text style={{flex: 1, textAlign: 'right',color: '#67D393', fontSize: 14, fontWeight: '400'}}>{post.writer.nickname}</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={{padding: 15}}>
        <RenderHTML
          contentWidth = {width}
          source = {markup}
          renderersProps = {renderersProps} 
          />
        <View style={{flexDirection: 'row', paddingVertical: 15 }}>
          <View style={{flexDirection: 'row', flex: 1}}>
          {post.hashtags && (
            post.hashtags.map((name, index) => {
              return (
                <Text style={{color: '#848484', fontSize: 14}} key={index}>#{name} </Text>
              )
            })
          )}
          </View>
          <TouchableOpacity>
            <Report />
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'flex-start'}}>
        <CardView data={post.semi_categories} offset={0} gap={0} pageWidth={100} dot={false} height={30} renderItem={({item}: any) => {
          return (
            <View style={{borderRadius: 16, backgroundColor: '#67D393', paddingVertical: 4, paddingHorizontal: 16, marginRight: 8, justifyContent: 'center'}}>
              <Text style={{color: 'white', fontSize: 14, fontWeight: '600'}}>{item.name}</Text>
            </View>
          )
        }} />
        </View>
      </View>
    </View>
  );
};

const UserInfoSection = ({
  user, onFollow
}: UserInfoSectionProps) => {
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
      <Image
        style={{ width: 50, height: 50, borderRadius: 60 }}
        source={{
          uri: user.profile,
        }}
      />
      <View style={{ flex: 1, padding: 5 }}>
        <Text style={{color: '#67D393', fontWeight: '700', fontSize: 16, lineHeight: 22}}>{user.nickname}</Text>
        <Text style={{color: '#848484', fontSize: 10, lineHeight: 18}}>자기소개 한 줄</Text>
      </View>
      <View style={{justifyContent: 'center'}}>
      <TouchableOpacity style={{borderColor: '#67D393', borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 2, paddingHorizontal: 15}} onPress={onFollow}>
        <Text style={{color: '#202020', fontSize: 12}}>+ 팔로우</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const PostRecommendSection = ({ data }: PostRecommendSectionProps) => {
  return (
    <View style={{
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
        height={120}
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
  onUpdate: () => void;
  onDelete: () => void;
  like: boolean,
  toggleLike: () => void;
}

const BottomBarSection = ({post, onUpdate, onDelete, like, toggleLike}: BottomBarSectionProps) => {
  return (
    <View style={{ flexDirection: "row", padding: 10 }}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <Heart like={like} onPress={toggleLike}></Heart>
        <Text>{post.like_cnt}</Text>
        <CommentIcon />
        <Text>30</Text>
      </View>
      <TouchableOpacity>
        <Scrap fill={'black'}/>
      </TouchableOpacity>
      <TouchableOpacity>
        <Share />
      </TouchableOpacity>
      <TouchableOpacity onPress={onUpdate}>
        <Text>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete}>
        <Text>삭제</Text>
      </TouchableOpacity>
    </View>
  )
}

const PostDetailScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ForestStackParams, "PostDetail">) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState<Post>();
  const [comment, setComment] = useState([] as any);
  const [commentId, setCommentId] = useState<number>(0);
  const [user, setUser] = useState([] as any);
  const [updateText, setUpdateText] = useState<string>('');
  const [follow, setFollow] = useState<boolean>(false);
  // const [category, setCategory] = useState({id: 0, name: ''});
  const [like, setLike] = useState<boolean>(false);
  // const [semiCategories, setSemiCategories] = useState([] as any);

  const request = new Request();

  const board_id = route.params.board_id;
  const post_id = route.params.post_id;
  const board_name = route.params.board_name;
 
  const toggleLike = async () => {
    const response = await request.post(`/forest/${post_id}/like/`);
    setLike(!like);
    onRefresh();
  };

  const checkUser = async () => {
    const response = await request.get(`/mypage/me/`,{},{});
    setUser(response.data.data); 
  }

  const loadItem = async () => {
    setLoading(true);
    const response_detail = await request.get(`/forest/${post_id}/`, {}, {});
    const response_comment = await request.get(`/forest/${post_id}/comments/`, {}, {});
    setPost(response_detail.data.data);
    setComment(response_comment.data.data);
    setLoading(false);
  };

  const reRenderScreen = () => {
    setRefreshing(true);
    setUpdateText('');
    setRefreshing(false);
  };

  const onRefresh = async () => {
    if(!refreshing){
      setRefreshing(true);
      await loadItem();
      setRefreshing(false);
    }
  }

  const deletePost = async () => {
    const _delete = async () => {
      await request.delete(`/forest/${post_id}/delete/`);
      navigation.replace("PostList", {
        board_id: board_id,
        board_name: board_name,
      });
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
          onPress: () => {},
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const onFollow = async () => {
    const response = await request.post('/mypage/follow/', {}, {});
    setFollow(response.data.data.follows);
  }

  const callback = (text: string, id: number) => {
    setUpdateText(text);
    setCommentId(id);
    console.log(updateText);
  }

  const data = [
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
  ];

  // const matchCategory = async () => {
  //   let post_category = {id: 0, name: ''};
  //   const categories = [
  //     { id: 1, name: "시사" },
  //     { id: 2, name: "문화" },
  //     { id: 3, name: "라이프스타일" },
  //     { id: 4, name: "뷰티" },
  //     { id: 5, name: "푸드" },
  //     { id: 6, name: "액티비티" },
  //   ];
  //   for (let _category of categories) {
  //     if (_category.id.toString() == post?.category){
  //       post_category.id = _category.id;
  //       post_category.name = _category.name;
  //     }
  //   }
  //   setCategory(post_category);
  //   let semi_category = [];
  //   const response = await request.get(`/forest/semi_categories/`, {category: post_category.id}, {});
  //   let semi_categories = response.data.data.results;
  //   for (let i = 0; i < semi_categories.length; i++) {
  //     if (post?.semi_categories.includes(semi_categories[i].name)) {
  //       semi_category.push(semi_categories[i]);
  //     }
  //   }
  //   setSemiCategories(semi_category);
  // }

  useEffect(() => {
    checkUser();
    loadItem();
  }, [refreshing]);

  return (
    <View style={styles.container}>
      {loading || post == undefined ? (
        <ActivityIndicator />
      ) : (
        <>
          <FlatList
            data={comment}
            // keyExtractor={(_) => _.name}
            style={styles.container}
            onRefresh={onRefresh}
            refreshing={refreshing}
            // onEndReached={onEndReached}
            // onEndReachedThreshold={0.6}
            ListHeaderComponent={
              <>
                <PostDetailSection
                  post={post}
                  boardname={board_name}
                  // navToPostUpload={navToPostUpload}
                  // deletePost={deletePost}
                  navToPhotoPreview={(photoUri: string) =>
                    navigation.navigate("PhotoPreview", { photoUri: photoUri })
                  }
                />
                <UserInfoSection user={post.writer} onFollow={onFollow} />
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: 14, fontWeight: '500', margin: 15}}>한줄평</Text>
                  <View style={{marginTop: 15}}><CommentIcon /></View>
                    <TouchableOpacity style={{marginLeft: 260, marginTop: 15}} onPress={() => {navigation.navigate('PostComments', { id: post_id, email: user.email })}}>
                      <Text style={{fontSize: 10}}>더보기{'>'}</Text>
                    </TouchableOpacity>
                  </View>
                <WriteComment id = {post_id} reRenderScreen = {reRenderScreen} data={updateText} commentId={commentId} />
              </>
            }
            ListFooterComponent={
              <>
                <PostRecommendSection data={data} />
                <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 20}}>
                  <TouchableOpacity style={{flexDirection: 'row'}}>
                    <Arrow />
                    <Text>맨 위로 이동</Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            renderItem = {({item}) => { 
              return (
                  <Comment data = {item} reRenderScreen = {reRenderScreen} post_id={post_id} email={user.email} callback={callback} />
              )
          }}
          />
          <BottomBarSection post={post} like={like} toggleLike={toggleLike} onDelete={deletePost} onUpdate={() => {navigation.navigate('ForestForm', {category: post.category, semi_categories: post.semi_categories, id: post.id})}} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

const PhotoBox = styled.View`
  display: flex;
  min-height: 110px;
  margin: 10px 0;
  flex-flow: row wrap;
  justify-content: space-around;
`;

export default PostDetailScreen;
