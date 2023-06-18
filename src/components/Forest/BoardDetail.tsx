import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import styled from "styled-components/native";

import { ForestStackParams, BoardFormat } from "../../pages/Forest";
import { Request } from "../../common/requests";
import SearchBar from "../../common/SearchBar";
import Scrap from "../../assets/img/Forest/Scrap.svg";
import CardView from "../../common/CardView";

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

interface PostFilterSectionProps {
  filters: any;
}

interface PostSectionProps {
  name: string;
  postCount?: number;
  doHashtagSearch: any;
}

interface BoardListHeaderSectionProps {
  board_name: string;
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

const BoardListHeaderSection = ({
  board_name,
  navigation,
}: BoardListHeaderSectionProps) => (
  <ImageBackground
    style={{ height: 130, alignItems: "center", justifyContent: "center" }}
    source={{
      uri: "https://reactnative.dev/img/tiny_logo.png",
    }}
  >
    <Header>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>{board_name}</Text>
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          borderRadius: 13,
          width: 40,
          height: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => navigation.navigate("PostSearch")}
      >
        <Text style={{ fontSize: 12 }}>검색</Text>
      </TouchableOpacity>
    </Header>
  </ImageBackground>
);

const SearchBarSection = ({
  searchQuery,
  onChange,
  clearSearchQuery,
  searchEnabled,
}: SearchBarSectionProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SearchBarInput
        placeholder="검색어를 입력해주세요."
        multiline={false}
        onChangeText={async (value) => await onChange(value)}
        value={searchQuery}
        editable={searchEnabled}
        selectTextOnFocus={searchEnabled}
        style={{ backgroundColor: searchEnabled ? "#FFF" : "gray" }}
      />
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={async () => clearSearchQuery()}
      >
        <View
          style={{
            backgroundColor: "#D3D3D3",
            borderWidth: 0.5,
            borderRadius: 10,
            width: 30,
            height: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "600" }}>X</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const PostFilterSection = ({ filters }: PostFilterSectionProps) => {
  return (
    <View
      style={{
        height: 40,
        backgroundColor: "white",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowColor: "rgba(0, 0, 0, 0.25)",
      }}
    >
      <FlatList
        data={filters}
        renderItem={({ item }): any => (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderBottomColor: "#209DF5",
              borderBottomWidth: 0,
              width: windowWidth / 4,
              height: 30,
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{
          justifyContent: "space-between",
          margin: 10,
        }}
        numColumns={4}
        scrollEnabled={false}
      />
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PostItemSection = ({
  board_id,
  post_id,
  board_name,
  boardFormat,
  title,
  preview,
  nickname,
  created,
  commentCount,
  likeCount,
  navigation,
}: PostItemSectionProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("PostDetail", {
          board_id: board_id,
          post_id: post_id,
          board_name: board_name,
          boardFormat: boardFormat,
        });
      }}
    >
      <View
        style={{
          width: windowWidth,
          padding: 10,
          borderTopWidth: 1,
          borderColor: "white",
          backgroundColor: "#424242",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1, padding: 10 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "white",
              marginBottom: 5,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "200",
              color: "white",
              opacity: 0.6,
              marginBottom: 5,
            }}
          >
            {preview}
          </Text>
          <Text
            style={{
              fontSize: 8,
              fontWeight: "200",
              color: "white",
              opacity: 0.6,
            }}
          >
            {nickname}
          </Text>
        </View>
        <ImageBackground
          style={{
            width: 80,
            height: 80,
            alignItems: "flex-end",
            justifyContent: "flex-end",
            padding: 5,
          }}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        >
          <TouchableOpacity onPress={() => console.log("저장")}>
            <Scrap />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const PostHashtagSection = ({
  name,
  postCount,
  doHashtagSearch,
}: PostSectionProps) => {
  return (
    <TouchableOpacity onPress={async () => await doHashtagSearch(name)}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 13,
          alignItems: "center",
          justifyContent: "center",
          minWidth: 60,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "400", padding: 5 }}>
          #{name}
        </Text>
        {/* <Text style={{ fontSize: 14, marginBottom: 5 }}>게시글: {postCount}개</Text> */}
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

const BoardDetailScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ForestStackParams, "BoardDetail">) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [boardFormat, setBoardFormat] = useState<BoardFormat>();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("default");
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [posts, setPosts] = useState([]); // id, title, preview, nickname, email, likeCount, created, commentCount

  const request = new Request();

  const board_id = route.params.board_id;
  const board_name = route.params.board_name;

  const filters = [
    { id: 1, name: "전체" },
    { id: 2, name: "관리자" },
    { id: 3, name: "일반인" },
    { id: 4, name: "팔로잉" },
  ];

  const getBoardFormat = async () => {
    const response = await request.get(`/community/boards/${board_id}/`);
    return response.data;
  };

  const getPosts = async (
    searchQuery: string,
    searchType: string,
    page: number
  ) => {
    const response = await request.get(
      "/community/posts/",
      {
        board: board_id,
        query: searchQuery,
        query_type: searchType,
        page: page,
        latest: true,
      },
      null
    );
    return response.data.data.results;
  };
  const getPostsBySearch = async () => {
    const response = await request.get(
      "/community/posts/",
      {
        board: board_id,
        query: searchQuery,
        query_type: searchType,
        page: page,
        latest: true,
      },
      null
    );
    setPosts(response.data.data.results);
  };
  const onRefresh = async () => {
    if (!refreshing) {
      setPage(1);
      setRefreshing(true);
      setPosts(await getPosts(searchQuery, "default", 1));
      setRefreshing(false);
    }
  };

  const onEndReached = async () => {
    if (!loading) {
      const newPosts = await getPosts(searchQuery, searchType, page + 1);
      setPosts([...posts, ...(newPosts as never)]);
      setPage(page + 1);
    }
  };

  const hashtagSearching = () => {
    return searchQuery.length > 0 && searchQuery[0] == "#";
  };

  useEffect(() => {
    async function _getData() {
      try {
        setLoading(true);
        setBoardFormat(await getBoardFormat());
        setPosts(await getPosts(searchQuery, "default", 1));
        setLoading(false);
      } catch (err) {
        console.warn(err);
      }
    }
    _getData();
  }, [route]);

  useEffect(() => {
    getPostsBySearch();
  }, [searchQuery]);

  const hashtags = [
    { name: "비건" },
    { name: "비건" },
    { name: "비건" },
    { name: "비건" },
    { name: "비건" },
  ];

  return (
    <ScrollView style={styles.container}>
      <BoardListHeaderSection board_name={board_name} navigation={navigation} />
      {loading || boardFormat == undefined ? (
        <ActivityIndicator />
      ) : (
        <>
          <PostFilterSection filters={filters} />
          {!hashtagSearching() ? (
            <>
              <View>
                <FlatList
                  data={hashtags}
                  renderItem={({ item }: any) => (
                    <PostHashtagSection
                      name={item.name}
                      doHashtagSearch={hashtagSearching}
                    />
                  )}
                  //keyExtractor={(item) => item.id.toString()}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    margin: 10,
                  }}
                  numColumns={5}
                  scrollEnabled={false}
                />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PostList", {
                      board_id: 1,
                      board_name: board_name,
                      board_category: "최신글",
                    });
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "600", padding: 15 }}
                  >
                    최신글
                  </Text>
                </TouchableOpacity>
                <CardView
                  gap={0}
                  offset={0}
                  data={posts}
                  pageWidth={windowWidth}
                  dot={false}
                  height={300}
                  renderItem={({ item }: any) => {
                    const {
                      id,
                      title,
                      preview,
                      nickname,
                      created,
                      commentCount,
                      likeCount,
                    } = item;
                    return (
                      <FlatList
                        data={posts}
                        scrollEnabled={false}
                        renderItem={(item) => (
                          <PostItemSection
                            key={id}
                            board_id={1}
                            post_id={id}
                            board_name={"시사"}
                            boardFormat={boardFormat}
                            title={title}
                            preview={preview}
                            nickname={nickname}
                            created={created}
                            commentCount={commentCount}
                            likeCount={likeCount}
                            navigation={navigation}
                          />
                        )}
                      />
                    );
                  }}
                />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PostList", {
                      board_id: 1,
                      board_name: board_name,
                      board_category: "인기글",
                    });
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "600", padding: 15 }}
                  >
                    인기글
                  </Text>
                </TouchableOpacity>
                <CardView
                  gap={0}
                  offset={0}
                  data={posts}
                  pageWidth={windowWidth}
                  dot={false}
                  height={300}
                  renderItem={({ item }: any) => {
                    const {
                      id,
                      title,
                      preview,
                      nickname,
                      created,
                      commentCount,
                      likeCount,
                    } = item;
                    return (
                      <FlatList
                        data={posts}
                        scrollEnabled={false}
                        renderItem={(item) => (
                          <PostItemSection
                            key={id}
                            board_id={1}
                            post_id={id}
                            board_name={"시사"}
                            boardFormat={boardFormat}
                            title={title}
                            preview={preview}
                            nickname={nickname}
                            created={created}
                            commentCount={commentCount}
                            likeCount={likeCount}
                            navigation={navigation}
                          />
                        )}
                      />
                    );
                  }}
                />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PostList", {
                      board_id: 1,
                      board_name: board_name,
                      board_category: "추천글",
                    });
                  }}
                >
                  <Text
                    style={{ fontSize: 20, fontWeight: "600", padding: 15 }}
                  >
                    추천글
                  </Text>
                </TouchableOpacity>
                <CardView
                  gap={0}
                  offset={0}
                  data={posts}
                  pageWidth={windowWidth}
                  dot={false}
                  height={300}
                  renderItem={({ item }: any) => {
                    const {
                      id,
                      title,
                      preview,
                      nickname,
                      created,
                      commentCount,
                      likeCount,
                    } = item;
                    return (
                      <FlatList
                        data={posts}
                        scrollEnabled={false}
                        renderItem={(item) => (
                          <PostItemSection
                            key={id}
                            board_id={1}
                            post_id={id}
                            board_name={"시사"}
                            boardFormat={boardFormat}
                            title={title}
                            preview={preview}
                            nickname={nickname}
                            created={created}
                            commentCount={commentCount}
                            likeCount={likeCount}
                            navigation={navigation}
                          />
                        )}
                      />
                    );
                  }}
                />
              </View>
              {/* <FlatList
                                data={posts}
                                // keyExtractor={(_) => _.title}
                                style={{ flexGrow: 1 }}
                                // ListHeaderComponent={<StorySection />}
                                onRefresh={onRefresh}
                                refreshing={refreshing}
                                onEndReached={onEndReached}
                                onEndReachedThreshold={0}
                                ListFooterComponent={loading ? <ActivityIndicator /> : <></>}
                                renderItem={({ item }) => {
                                    const { id, title, preview, nickname, created, commentCount, likeCount } = item;
                                    return (
                                        <PostItemSection
                                            key={id}
                                            board_id={board_id}
                                            post_id={id}
                                            board_name={board_name}
                                            boardFormat={boardFormat}
                                            title={title}
                                            preview={preview}
                                            nickname={nickname}
                                            created={created}
                                            commentCount={commentCount}
                                            likeCount={likeCount}
                                            navigation={navigation}
                                        />
                                    )
                                }}
                            /> */}
            </>
          ) : (
            <>
              <PostHashtagSearchSection
                boardId={board_id}
                searchQuery={searchQuery}
                doHashtagSearch={async (searchQuery: string) => {
                  setSearchQuery("해시태그 '" + searchQuery + "' 검색 결과");
                  setSearchEnabled(false);
                  setSearchType("hashtag");
                  setPosts(await getPosts(searchQuery, "hashtag", 1));
                }}
              />
            </>
          )}
        </>
      )}
    </ScrollView>
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

export default BoardDetailScreen;
