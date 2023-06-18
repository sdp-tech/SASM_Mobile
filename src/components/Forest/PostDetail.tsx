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
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import Heart from "../../common/Heart";

import { BoardFormat, ForestStackParams } from "../../pages/Forest";
import PostCommentUploadSection from "./PostCommentUpload";
import { Request } from "../../common/requests";
import CardView from "../../common/CardView";

interface Post {
  id: number;
  board: number;
  title: string;
  subtitle: string;
  content: string;
  rep_pic: string;
  nickname: string;
  email: string;
  created: string;
  likeCount: number;
  viewCount: number;
  likes: boolean;
  photoList: Array<string>;
  hashtagList: Array<string>;
}

const HashtagBox = ({ name }: Hashtag) => (
  <View
    style={{
      backgroundColor: "white",
      padding: 10,
      borderRadius: 20,
      margin: 1,
    }}
  >
    <Text style={{ fontSize: 12, lineHeight: 14 }}>{name}</Text>
  </View>
);

interface Hashtag {
  name: string;
}

interface PostCommentItemSectionProps {
  id: number;
  content: string;
  isParent: boolean;
  group: number;
  email: string;
  nickname: string;
  created: string;
  updated: string;
  photoList: string[];
  boardFormat: BoardFormat;
  navigation: any;
  deleteComment: any;
  editComponent: any;
  replyComponent: any;
}

interface PostDetailSectionProps {
  post: Post;
  boardFormat: BoardFormat;
  boardname: string;
  //navToPostUpload: any;
  // deletePost: any;
  navToPhotoPreview: any;
}

interface UserInfoSectionProps {
  nickname: string;
  preview: string;
  posts: Array<string>;
  image: string;
}

interface PostRecommendSectionProps {
  data: any;
}

const PostCommentItemSection = ({
  id,
  content,
  isParent,
  group,
  email,
  nickname,
  created,
  updated,
  photoList,
  boardFormat,
  navigation,
  deleteComment,
  editComponent,
  replyComponent,
}: PostCommentItemSectionProps) => {
  const [editing, setEditing] = useState<Boolean>(false);
  const [replying, setReplying] = useState<Boolean>(false);

  return !editing ? (
    <>
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 5,
          marginBottom: 10,
          borderBottomWidth: 1,
        }}
      >
        {!group ? ( // 대댓글이지만 parent가 삭제되어 없을 때
          <View style={{ marginLeft: 0 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "gray",
                marginBottom: 5,
              }}
            >
              (삭제)
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "gray",
                marginBottom: 5,
              }}
            >
              삭제된 댓글입니다.
            </Text>
            <View
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 5,
                marginBottom: 10,
                borderBottomWidth: 1,
              }}
            ></View>
          </View>
        ) : (
          <></>
        )}
        <View style={{ marginLeft: isParent ? 0 : 30 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ alignSelf: "center" }}>
              {/* <Image></Image> */}
              <Image
                style={{ width: 42, height: 42, borderRadius: 60 }}
                source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 34,
                  height: 12,
                  backgroundColor: "#209DF5",
                  borderRadius: 10,
                  top: 42,
                  left: 8.5,
                }}
              >
                <Text>Editor</Text>
              </View>
              {/* { data!.writer_is_verified ? (
                                    <View style={{position: 'absolute', width: 34, height: 12, backgroundColor: '#209DF5', borderRadius: 10, top: 42, left: 8.5}}>
                                        <Text style={textStyles.verified}>Editor</Text>
                                    </View>
                                ): (
                                    <View style={{position: 'absolute', width: 34, height: 12, backgroundColor: '#89C77F', borderRadius: 10, top: 42, left: 8.5}}>
                                        <Text style={textStyles.verified}>User</Text>
                                    </View>
                                )} */}
            </View>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "black",
                    marginBottom: 5,
                  }}
                >
                  {nickname}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "gray",
                    marginBottom: 5,
                  }}
                >
                  {created.slice(0, 19) == updated.slice(0, 19)
                    ? created.slice(0, 10)
                    : updated.slice(0, 10) + " (수정됨)"}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "500",
                  color: "black",
                  marginBottom: 5,
                }}
              >
                {content}
              </Text>
            </View>
          </View>
          {boardFormat.supportsPostCommentPhotos && photoList ? (
            <PhotoBox>
              {photoList.map((uri, index) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("PhotoPreview", { photoUri: uri })
                    }
                  >
                    <Image
                      key={index}
                      source={{ uri: uri }}
                      style={{ width: 100, height: 100, margin: 5 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </PhotoBox>
          ) : (
            <></>
          )}
          <View style={{ flexDirection: "row" }}>
            {isParent ? (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => setReplying(true)}
              >
                <View
                  style={{
                    backgroundColor: "#D3D3D3",
                    borderWidth: 0.5,
                    borderRadius: 10,
                    width: 50,
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    대댓글
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <></>
            )}
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => setEditing(true)}
            >
              <View
                style={{
                  backgroundColor: "#D3D3D3",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  width: 50,
                  height: 25,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "600" }}>수정</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={async () => await deleteComment(id)}
            >
              <View
                style={{
                  backgroundColor: "#D3D3D3",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  width: 50,
                  height: 25,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "600" }}>삭제</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {replying ? (
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 5,
            marginBottom: 10,
            borderBottomWidth: 1,
          }}
        >
          {replyComponent}
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => setReplying(false)}
            >
              <View
                style={{
                  backgroundColor: "#D3D3D3",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  width: 50,
                  height: 25,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: "600" }}>취소</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <></>
      )}
    </>
  ) : (
    <>
      <View
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 5,
          marginBottom: 10,
          borderBottomWidth: 1,
        }}
      >
        {editComponent}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => setEditing(false)}
          >
            <View
              style={{
                backgroundColor: "#D3D3D3",
                borderWidth: 0.5,
                borderRadius: 10,
                width: 50,
                height: 25,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "600" }}>취소</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const PostDetailSection = ({
  post,
  // boardFormat,
  boardname,
  //navToPostUpload,
  // deletePost,
  navToPhotoPreview,
}: PostDetailSectionProps) => {
  const [like, setLike] = useState<boolean>(false);
  const request = new Request();

  const toggleLike = async () => {
    const response = await request.post(`/forest/${post.id}/like/`);
    setLike(!like);
  };
  useEffect(() => {
    setLike(post.likes);
  }, [post]);

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
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: "700",
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            {boardname}
          </Text>
        </View>
        <View style={{ flex: 1, padding: 20 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "600",
              marginBottom: 10,
              color: "white",
            }}
          >
            {post.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "200",
              color: "white",
              marginBottom: 10,
              opacity: 0.8,
            }}
          >
            {post.subtitle}
          </Text>
          {/* <Text style={{ fontSize: 14, marginBottom: 20 }}>좋아요: {post.likeCount}</Text> */}
          <View
            style={{
              backgroundColor: "#209DF5",
              width: 30,
              height: 30,
              borderRadius: 60,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-end",
              margin: 10,
            }}
          >
            <Text style={{ color: "white" }}>인증</Text>
          </View>
        </View>
      </ImageBackground>
      <View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "200",
            lineHeight: 24,
            padding: 30,
          }}
        >
          {post.content}
        </Text>
        {/* {boardFormat.supportsHashtags && post.hashtagList ? (
          <HashtagBoxView>
            {post.hashtagList.map((name, index) => {
              return <HashtagBox key={index} name={name} />;
            })}
          </HashtagBoxView>
        ) : (
          <></>
        )}
        {boardFormat.supportsPostPhotos && post.photoList ? (
          <PhotoBox>
            {post.photoList.map((uri, index) => {
              return (
                <TouchableOpacity onPress={() => navToPhotoPreview(uri)}>
                  <Image
                    key={index}
                    source={{ uri: uri }}
                    style={{ width: 100, height: 100, margin: 5 }}
                  />
                </TouchableOpacity>
              );
            })}
          </PhotoBox>
        ) : (
          <></>
        )} */}
        <View style={{ flexDirection: "row" }}>
          {/* <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navToPostUpload()}>
                    <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: '600' }}>수정</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => deletePost()}>
                    <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: '600' }}>삭제</Text>
                    </View>
                </TouchableOpacity> */}
          <Heart like={like} onPress={toggleLike}></Heart>
          <TouchableOpacity>
            <Text style={{ color: "white" }}>공유</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ color: "white" }}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const UserInfoSection = ({
  nickname,
  preview,
  posts,
  image,
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
      <View style={{ flex: 1 }}>
        <Image
          style={{ width: 70, height: 70, borderRadius: 60 }}
          source={{
            uri: "https://reactnative.dev/img/tiny_logo.png",
          }}
        />
        <TouchableOpacity
          style={{
            borderRadius: 13,
            width: 70,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 5,
          }}
        >
          <Text>팔로잉</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 2 }}>
        <Text>사슴{nickname}님</Text>
        <Text>자기소개 한 줄{preview}</Text>
        <Text>사슴{nickname}님의 다른 글</Text>
        {posts.map((post, index) => {
          return (
            <TouchableOpacity>
              <Text style={{ textDecorationLine: "underline" }} key={index}>
                다른 글입니다 에베베베벱베베{post}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const PostRecommendSection = ({ data }: PostRecommendSectionProps) => {
  return (
    <View>
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

const PostDetailScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ForestStackParams, "PostDetail">) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [post, setPost] = useState<Post>();
  const [postComments, setPostComments] = useState([]);

  const request = new Request();

  const board_id = route.params.board_id;
  const post_id = route.params.post_id;
  const board_name = route.params.board_name;
  const boardFormat = route.params.boardFormat;

  const getPost = async () => {
    const response = await request.get(`/forest/${post_id}/`, {}, {});
    console.log(response.data.data.results[0])
    setPost(response.data.data.results[0])
  };

  // const getPostComments = async () => {
  //   setLoading(true);
  //   const response = await request.get(`/community/post_comments/`, {
  //     post: post_id,
  //   });
  //   setLoading(false);

  //   return response.data.data.results;
  // };

  

  const reRenderScreen = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  // const onRefresh = async () => {
  //   if (!refreshing) {
  //     // setPage(1);
  //     setRefreshing(true);
  //     setPost(await getPost());
  //     if (boardFormat.supportsPostComments)
  //       setPostComments(await getPostComments());
  //     setRefreshing(false);
  //   }
  // };

  const deletePost = async () => {
    const _delete = async () => {
      await request.delete(`/community/posts/${post_id}/delete/`);
      navigation.navigate("PostList", {
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

  const deleteComment = async (id: number) => {
    const _delete = async () => {
      await request.delete(`/community/post_comments/${id}/delete`);
      reRenderScreen();
    };
    Alert.alert(
      "댓글 삭제 확인",
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

  const array = ["1", "2", "3"];
  const data = [
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
    { uri: "https://reactnative.dev/img/tiny_logo.png", title: "사슴" },
  ];

  useEffect(() => {
    // async function _getData() {
    //   try {
    //     setLoading(true);
    //     setPost(await getPost());
    //     if (boardFormat.supportsPostComments)
    //       setPostComments(await getPostComments());
    //     setLoading(false);
    //   } catch (err) {
    //     console.warn(err);
    //   }
    // }
    // _getData();
    getPost();
  }, [refreshing]);

  return (
    <View style={styles.container}>
      {loading || post == undefined ? (
        <ActivityIndicator />
      ) : (
        <>
          <FlatList
            data={postComments}
            // keyExtractor={(_) => _.name}
            style={styles.container}
            // onRefresh={onRefresh}
            refreshing={refreshing}
            // onEndReached={onEndReached}
            // onEndReachedThreshold={0.6}
            ListHeaderComponent={
              <>
                <PostDetailSection
                  post={post}
                  boardFormat={boardFormat}
                  boardname={board_name}
                  // navToPostUpload={navToPostUpload}
                  // deletePost={deletePost}
                  navToPhotoPreview={(photoUri: string) =>
                    navigation.navigate("PhotoPreview", { photoUri: photoUri })
                  }
                />
                <UserInfoSection
                  nickname=""
                  posts={array}
                  image=""
                  preview=""
                />
                <PostCommentUploadSection
                  post_id={post_id}
                  board_id={board_id}
                  boardFormat={boardFormat}
                  isParent={true}
                  navigation={navigation}
                  reRenderScreen={reRenderScreen}
                />
              </>
            }
            ListFooterComponent={<PostRecommendSection data={data} />}
            renderItem={({ item }) => {
              const {
                id,
                content,
                isParent,
                group,
                email,
                nickname,
                created,
                updated,
                photoList,
              } = item;
              return (
                <PostCommentItemSection
                  {...{
                    id,
                    content,
                    isParent,
                    group,
                    email,
                    nickname,
                    created,
                    updated,
                    photoList,
                  }}
                  boardFormat={boardFormat}
                  navigation={navigation}
                  deleteComment={deleteComment}
                  editComponent={
                    <PostCommentUploadSection
                      comment_id={id}
                      post_id={post_id}
                      board_id={board_id}
                      boardFormat={boardFormat}
                      isParent={true}
                      navigation={navigation}
                      reRenderScreen={reRenderScreen}
                      prevComment={{ content: content, photoList: photoList }}
                    />
                  }
                  replyComponent={
                    <PostCommentUploadSection
                      post_id={post_id}
                      board_id={board_id}
                      boardFormat={boardFormat}
                      isParent={false}
                      parentId={id}
                      navigation={navigation}
                      reRenderScreen={reRenderScreen}
                    />
                  }
                />
              );
            }}
          />
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

const HashtagBoxView = styled.View`
  display: flex;
  flex-flow: row wrap;
  width: 80%;
  margin: 12px;
`;

const PhotoBox = styled.View`
  display: flex;
  min-height: 110px;
  margin: 10px 0;
  flex-flow: row wrap;
  justify-content: space-around;
`;

export default PostDetailScreen;
