import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import CardView from "../../common/CardView";
import Add from "../../assets/img/common/Add.svg";
import CustomHeader from "../../common/CustomHeader";
import PostItem, { HotPostItem } from "./components/PostItem";
import BoardItem from "./components/BoardItem";

import { ForestStackParams, BoardFormat } from "../../pages/Forest";
import { Request } from "../../common/requests";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const BoardListScreen = ({
  navigation,
}: NativeStackScreenProps<ForestStackParams, "BoardList">) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("default");
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [boardLists, setBoardLists] = useState([] as any);
  const [posts, setPosts] = useState([] as any);
  const [hotPosts, setHotPosts] = useState([] as any);
  const [newPosts, setNewPosts] = useState([] as any);

  const request = new Request();

  const categories = [
    { id: 1, name: "시사" },
    { id: 2, name: "문화" },
    { id: 3, name: "라이프스타일" },
    { id: 4, name: "뷰티" },
    { id: 5, name: "푸드" },
    { id: 6, name: "액티비티" },
  ];

  const getUserInfo = async () => {
    const response = await request.get('/mypage/me/', {}, {});
    setNickname(response.data.data.nickname);
  }

  const getBoardItems = async () => {
    const response = await request.get('/forest/categories/');
    setBoardLists(response.data.data.results);
  }

  const getPosts = async () => {
    const response = await request.get('/forest/', {}, null);
    const response_hot = await request.get('/forest/', {order: 'hot'}, null);
    const response_new = await request.get('/forest/', {order: 'latest'}, null);
    setPosts(response.data.data.results);
    setHotPosts(response_hot.data.data.results);
    setNewPosts(response_new.data.data.results);
  };

  // const getRefreshData = async () => {
  //     setRefreshing(true);
  //     await RefreshDataFetch();
  //     setRefreshing(false);
  // }

  // const onRefresh = () => {
  //     if (!refreshing) {
  //         getRefreshData();
  //     }
  // }

  // const getData = async () => {
  //     if (true) {
  //         setLoading(true);
  //         await DataFetch();
  //         setLoading(false);
  //     }
  // }

  const chunkArray = (array: any, size: number) => {
    const chunkedArray = [];
    let index = 0;
    while (index < array.length) {
      chunkedArray.push(array.slice(index, index + size));
      index += size;
    }
    return chunkedArray;
  };

  useEffect(() => {
    getUserInfo();
    getBoardItems();
    getPosts();
  }, [page]);

  return (
    <SafeAreaView style={styles.container}>
          <CustomHeader
            onSearch={() => {
              navigation.navigate("PostSearch");
            }}
          />
          <ScrollView nestedScrollEnabled={true}>
            <View style={{ height: 400 }}>
              <View
                style={{ backgroundColor: "#C8F5D7", padding: 20, height: 100 }}
              >
                <Text style={{color: '#3C3C3C', fontWeight: '700', fontSize: 16}}>{nickname}님 이 정보들은 어떠신가요?</Text>
                <Text>
                  {posts[0]?.title}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#F1FCF5",
                  alignItems: "center",
                  height: 300,
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    width: width - 30,
                    paddingVertical: 5,
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    borderColor: "#E3E3E3",
                    borderWidth: 1,
                    borderRadius: 4,
                    marginBottom: 25,
                  }}
                >
                  <Text style={{color: '#848484', fontWeight: '700', fontSize: 16}}>{nickname}님의 카테고리를 추가해보세요.</Text>
                  <TouchableOpacity
                    style={{
                      width: 25,
                      height: 25,
                      backgroundColor: "#E9E9E9",
                      borderRadius: 60,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  top: 80,
                  left: 15,
                  width: width - 30,
                  backgroundColor: "white",
                  borderColor: "#E3E3E3",
                  borderWidth: 1,
                  alignItems: "center",
                  borderRadius: 4,
                }}
              >
                <FlatList
                  data={categories}
                  renderItem={({ item }: any) => (
                    <BoardItem
                      id={item.id}
                      name={item.name}
                      onPress={() => {
                        navigation.navigate("BoardDetail", { board_id: item.id, board_name: item.name });
                      }}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    margin: 10,
                  }}
                  numColumns={3}
                  scrollEnabled={false}
                />
              </View>
            </View>
            <View
              style={{
                borderTopWidth: 2,
                borderBottomWidth: 1,
                borderTopColor: "#E3E3E3",
                borderBottomColor: "#E3E3E3",
                paddingVertical: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PostList", {
                    board_name: "사슴의 추천글",
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 15,
                  }}
                >
                  사슴의 추천글
                </Text>
              </TouchableOpacity>
              {/* <CategoriesList /> */}
              <CardView
                gap={0}
                offset={0}
                data={chunkArray(posts, 3)}
                pageWidth={width}
                height={420}
                dot={true}
                renderItem={({ item }: any) => {
                  return (
                    <FlatList
                      data={item}
                      scrollEnabled={false}
                      renderItem={({item}: any) => {
                        const {
                          id,
                          title,
                          preview,
                          writer,
                          photos,
                          created,
                          commentCount,
                          like_cnt,
                        } = item;
                        return (
                          <PostItem
                            key={id}
                            board_id={1}
                            post_id={id}
                            board_name={"시사"}
                            title={title}
                            preview={preview}
                            writer={writer}
                            photos={photos}
                            created={created}
                            commentCount={commentCount}
                            like_cnt={like_cnt}
                            navigation={navigation}
                          />
                      )}}
                    />
                  );
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: "#F1FCF5",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "#E3E3E3",
                borderBottomColor: "#E3E3E3",
                padding: 20
              }}
            >
              <Text style={{color: '#3C3C3C', fontWeight: '700', fontSize: 16, lineHeight: 22}}>{nickname}님 이 정보들은 어떠신가요?</Text>
              <FlatList
                data={posts.slice(0,3)}
                scrollEnabled={false}
                renderItem={({ item }: any) => (
                  <TouchableOpacity style={{ flexDirection: "row", marginTop: 10}} onPress={() => {navigation.navigate('PostDetail', {post_id: item.id, board_id: 1, board_name: '시사'})}}>
                    <View style={{borderColor: '#67D393', borderWidth: 1, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 4}}>
                      <Text style={{color: '#67D393', fontSize: 10, fontWeight: '600'}}>#ESG</Text>
                    </View>
                    <Text style={{color: '#3C3C3C', fontSize: 12, lineHeight: 18, marginLeft: 5}} numberOfLines={1}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "#E3E3E3",
                borderBottomColor: "#E3E3E3",
                paddingVertical: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PostList", {
                    board_name: "사슴의 인기글",
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                  }}
                >
                  사슴의 인기글
                </Text>
              </TouchableOpacity>
              <CardView
                gap={0}
                offset={0}
                data={chunkArray(hotPosts, 3)}
                pageWidth={width}
                dot={true}
                height={340}
                renderItem={({ item }: any) => {
                  return (
                    <FlatList
                      data={item}
                      scrollEnabled={false}
                      renderItem={({item}: any) => {
                        const {
                          id,
                          title,
                          preview,
                          writer,
                          photos,
                          created,
                          commentCount,
                          like_cnt
                        } = item;
                        return(
                          <HotPostItem
                            // key={id}
                            board_id={1}
                            post_id={id}
                            board_name={"시사"}
                            title={title}
                            preview={preview}
                            writer={writer}
                            photos={photos}
                            created={created}
                            commentCount={commentCount}
                            like_cnt={like_cnt}
                            navigation={navigation}
                          />
                      )}}
                    />
                  );
                }}
              />
            </View>
            <View
              style={{
                borderTopWidth: 2,
                borderTopColor: "#E3E3E3",
                paddingVertical: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PostList", {
                    board_name: "사슴의 최신글",
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                  }}
                >
                  사슴의 최신글
                </Text>
              </TouchableOpacity>
              <FlatList
                data={newPosts}
                scrollEnabled={false}
                renderItem={({ item }: any) => {
                  const {
                    id,
                    title,
                    preview,
                    writer,
                    photos,
                    created,
                    commentCount,
                    like_cnt,
                  } = item;
                  return (
                    <PostItem
                      // key={id}
                      board_id={1}
                      post_id={id}
                      board_name={"시사"}
                      title={title}
                      preview={preview}
                      writer={writer}
                      photos={photos}
                      created={created}
                      commentCount={commentCount}
                      like_cnt={like_cnt}
                      navigation={navigation}
                    />
                  );
                }}
              />
            </View>
          </ScrollView>
          <TouchableOpacity onPress={() => {navigation.navigate('CategoryForm',{ categories: categories })}}
            style={{position: "absolute", top: height * 0.85, left: width * 0.85, shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3}}
          >
            <Add />
          </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default BoardListScreen;
