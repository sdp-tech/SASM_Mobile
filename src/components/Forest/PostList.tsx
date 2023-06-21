import React, { useState, useEffect, useRef } from "react";
import { TextPretendard as Text } from "../../common/CustomText";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageBackground,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";
import ListHeader from "./components/ListHeader";

import { ForestStackParams, BoardFormat } from "../../pages/Forest";
import { Request } from "../../common/requests";
import DropDown from "../../common/DropDown";
import PostItem from "./components/PostItem";

interface PostItemSectionProps {
  board_id: number;
  post_id: number;
  board_name: string;
  boardFormat: BoardFormat;
  title: string;
  preview: string;
  nickname: string;
  created: string;
  commentCount: number;
  likeCount: number;
  navigation: any;
}

interface PostSectionProps {
  name: string;
  postCount: number;
  doHashtagSearch: any;
}

interface BoardListHeaderSectionProps {
  board_name: string;
  board_category?: string;
  navigation: any;
}

interface SearchBarSectionProps {
  searchQuery: string;
  onChange: any;
  clearSearchQuery: any;
  searchEnabled: boolean;
}

interface PostSearchSectionProps {
  boardId: number;
  searchQuery: string;
  doHashtagSearch: any;
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PostHashtagSection = ({
  name,
  postCount,
  doHashtagSearch,
}: PostSectionProps) => {
  return (
    <TouchableOpacity onPress={async () => await doHashtagSearch(name)}>
      <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "gray" }}>
        <Text style={{ fontSize: 17, fontWeight: "600", marginBottom: 5 }}>
          #{name}
        </Text>
        <Text style={{ fontSize: 14, marginBottom: 5 }}>
          게시글: {postCount}개
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const PostHashtagSearchSection = ({
  boardId,
  searchQuery,
  doHashtagSearch,
}: PostSearchSectionProps) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hashtags, setHashtags] = useState([]);

  const request = new Request();

  const getHashtags = async () => {
    const hashtagName = searchQuery.slice(1);
    const response = await request.get("/community/post_hashtags/", {
      board: boardId,
      query: hashtagName,
    });
    return response.data.data.results;
  };

  const onRefresh = async () => {
    if (!refreshing) {
      setRefreshing(true);
      setHashtags(await getHashtags());
      setRefreshing(false);
    }
  };

  useEffect(() => {
    async function _getData() {
      try {
        setLoading(true);
        setHashtags(await getHashtags());
        setLoading(false);
      } catch (err) {
        console.warn(err);
      }
    }
    _getData();
  }, [searchQuery]);

  return (
    <>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <FlatList
            data={hashtags}
            // keyExtractor={(_) => _.title}
            style={styles.container}
            // ListHeaderComponent={<StorySection />}
            onRefresh={onRefresh}
            refreshing={refreshing}
            // onEndReached={onEndReached}
            // onEndReachedThreshold={0}
            // ListFooterComponent={loading && <ActivityIndicator />}
            renderItem={({ item }) => {
              const { name, postCount } = item;
              return (
                <PostHashtagSection
                  name={name}
                  postCount={postCount}
                  doHashtagSearch={doHashtagSearch}
                />
              );
            }}
          />
        </>
      )}
    </>
  );
};

const PostListScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ForestStackParams, "PostList">) => {
  const toggleItems = [
    { label: '최신순', value: 0, order: 'latest' },
    { label: '인기순', value: 1, order: 'hot' },
  ]
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(false);
  const [orderList, setOrderList] = useState(0);
  const [order, setOrder] = useState<string>(toggleItems[orderList].order);
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]); // id, title, preview, nickname, email, likeCount, created, commentCount

  const request = new Request();

  const board_name = route.params.board_name;
  const board_category = route.params.board_category;

  const getPosts = async () => {
    setLoading(true);
    const response = await request.get('/forest/', {
      order: order
    }, null);
    setPosts(response.data.data.results);
    setCount(response.data.data.count);
    setLoading(false);
    console.log(response)
  }

  useEffect(() => {
    getPosts();
  }, [order]);

  // const getBoardFormat = async () => {
  //   const response = await request.get(`/community/boards/${board_id}/`);
  //   return response.data;
  // };

  // const getPosts = async (
  //   searchQuery: string,
  //   searchType: string,
  //   page: number
  // ) => {
  //   const response = await request.get(
  //     "/community/posts/",
  //     {
  //       board: board_id,
  //       query: searchQuery,
  //       query_type: searchType,
  //       page: page,
  //       latest: true,
  //     },
  //     null
  //   );
  //   return response.data.data.results;
  // };
  // const getPostsBySearch = async () => {
  //   const response = await request.get(
  //     "/community/posts/",
  //     {
  //       board: board_id,
  //       query: searchQuery,
  //       query_type: searchType,
  //       page: page,
  //       latest: true,
  //     },
  //     null
  //   );
  //   setPosts(response.data.data.results);
  // };
  // const onRefresh = async () => {
  //   if (!refreshing) {
  //     setPage(1);
  //     setRefreshing(true);
  //     setPosts(await getPosts(searchQuery, "default", 1));
  //     setRefreshing(false);
  //   }
  // };

  // const onEndReached = async () => {
  //   if (!loading) {
  //     const newPosts = await getPosts(searchQuery, searchType, page + 1);
  //     setPosts([...posts, ...(newPosts as never)]);
  //     setPage(page + 1);
  //   }
  // };

  // const hashtagSearching = () => {
  //   return searchQuery.length > 0 && searchQuery[0] == "#";
  // };

  // useEffect(() => {
  //   async function _getData() {
  //     try {
  //       setLoading(true);
  //       setBoardFormat(await getBoardFormat());
  //       setPosts(await getPosts(searchQuery, "default", 1));
  //       setLoading(false);
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  //   _getData();
  // }, [route]);

  // useEffect(() => {
  //   getPostsBySearch();
  // }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <ListHeader
        board_name={board_name}
        board_category={board_category}
        navigation={navigation}
      />
      <View style={{flexDirection: 'row', zIndex: 1, alignItems: 'center', padding: 15, backgroundColor: '#F1FCF5'}}>
        <Text style={{fontSize: 12, fontWeight: '400', flex: 1}}>전체 검색결과 {count}개</Text>
        <View style={{width: 100, zIndex: 2000}}>
          <DropDown value={orderList} setValue={setOrderList} isBorder={false} items={toggleItems} />
        </View>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
              <FlatList
                data={posts}
                // keyExtractor={(_) => _.title}
                style={{ flexGrow: 1 }}
                // ListHeaderComponent={<StorySection />}
                // onRefresh={onRefresh}
                refreshing={refreshing}
                // onEndReached={onEndReached}
                onEndReachedThreshold={0}
                ListFooterComponent={loading ? <ActivityIndicator /> : <></>}
                renderItem={({ item }) => {
                  const {
                    id,
                    title,
                    preview,
                    writer_nickname,
                    rep_pic,
                    created,
                    commentCount,
                    likeCount,
                  } = item;
                  return (
                    <PostItem
                          // key={id}
                          board_id={1}
                          post_id={id}
                          board_name={"시사"}
                          title={title}
                          preview={preview}
                          nickname={writer_nickname}
                          rep_pic={rep_pic}
                          created={created}
                          commentCount={commentCount}
                          likeCount={likeCount}
                          navigation={navigation}
                        />
                  );
                }}
              />
              {/* <TouchableOpacity style={{ position: 'absolute', bottom: '5%', right: 8 }} onPress={() => navigation.navigate('PostUpload', { board_id: board_id, boardFormat: boardFormat })}>
                                <View style={{ backgroundColor: '#01A0FC', padding: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 18, color: 'white' }}>글쓰기</Text>
                                </View>
                            </TouchableOpacity> */}
            </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "white",
  },
});

const Header = styled.View`
  height: 40px;
  padding: 10px;
  flex-direction: row;
`;
const SearchBarInput = styled.TextInput`
  width: 80%;
  height: 32px;
  marginright: 10px;
  padding: 5px;
  borderwidth: 1px;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

export default PostListScreen;
