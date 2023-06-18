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

import { ForestStackParams, BoardFormat } from "../../pages/Forest";
import { Request } from "../../common/requests";
import SearchBar from "../../common/SearchBar";
import Scrap from "../../assets/img/Forest/Scrap.svg";

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
  board_category,
}: BoardListHeaderSectionProps) => (
  <Header>
    <Text style={{ fontSize: 20, fontWeight: "600" }}>
      {board_name}
      {board_category ? " / " + board_category : ""}
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        borderRadius: 13,
        width: 40,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 12 }}>필터</Text>
    </TouchableOpacity>
  </Header>
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
  const board_category = route.params.board_category;

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

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        search={searchQuery}
        setSearch={setSearchQuery}
        setPage={setPage}
        style={{ backgroundColor: "#E9E9E9" }}
      />
      <BoardListHeaderSection
        board_name={board_name}
        board_category={board_category}
      />
      {loading || boardFormat == undefined ? (
        <ActivityIndicator />
      ) : (
        <>
          {/* <SearchBar
                        search={searchQuery}
                        setSearch={setSearchQuery}
                        setPage={setPage}
                        style={{ backgroundColor: "#E9E9E9" }} /> */}
          {!hashtagSearching() ? (
            <>
              <FlatList
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
                  );
                }}
              />
              {/* <TouchableOpacity style={{ position: 'absolute', bottom: '5%', right: 8 }} onPress={() => navigation.navigate('PostUpload', { board_id: board_id, boardFormat: boardFormat })}>
                                <View style={{ backgroundColor: '#01A0FC', padding: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 18, color: 'white' }}>글쓰기</Text>
                                </View>
                            </TouchableOpacity> */}
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
