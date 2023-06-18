import { useEffect, useState } from "react";
import { TextPretendard as Text } from "../../common/CustomText";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ForestStackParams, BoardFormat } from "../../pages/Forest";
import { Request } from "../../common/requests";
import SearchBar from "../../common/SearchBar";
import CardView from "../../common/CardView";
import DropDown from "../../common/DropDown";
import PostItem from "./components/PostItem";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface PostSearchListSectionProps {
  posts: any;
  navigation: any;
}

const PostSearchListSection = ({
  posts,
  navigation,
}: PostSearchListSectionProps) => {
  return (
    <FlatList
      data={posts}
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
          <PostItem
            key={id}
            board_id={1}
            post_id={id}
            board_name={"시사"}
            //boardFormat={boardFormat}
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
  );
};

const PostSearchScreen = ({
  navigation,
}: NativeStackScreenProps<ForestStackParams, "PostSearch">) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [boardFormat, setBoardFormat] = useState<BoardFormat>();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("default");
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [orderList, setOrderList] = useState(0);
  const [posts, setPosts] = useState([]); // id, title, preview, nickname, email, likeCount, created, commentCount

  const request = new Request();

  const boardLists = [
    { id: 1, name: "시사" },
    { id: 2, name: "문화" },
    { id: 3, name: "생활" },
    { id: 4, name: "뷰티" },
    { id: 5, name: "푸드" },
    { id: 6, name: "액티비티" },
  ];

  const getBoardFormat = async () => {
    const response = await request.get(`/community/boards/${1}/`);
    setBoardFormat(response.data);
    //console.log(response.data)
  };

  useEffect(() => {
    getBoardFormat();
    getPosts();
  }, [searchQuery]);

  const getPosts = async () => {
    const response = await request.get(
      "/community/posts",
      {
        board: 1,
        query: searchQuery,
        query_type: searchType,
        page: page,
        latest: true,
      },
      null
    );
    setPosts(response.data.data.results);
    //console.log(response.data.data.results);
  };

  const toggleItems = [
    { label: "최신순", value: 1 },
    { label: "조회수 순", value: 2 },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <SearchBar
        search={searchQuery}
        setSearch={setSearchQuery}
        setPage={setPage}
        style={{ backgroundColor: "#F4F4F4" }}
        placeholder={"무엇을 검색하시겠습니까"}
      />
      {searchQuery.length > 0 ? (
        <>
          <View
            style={{
              borderColor: "#E3E3E3",
              borderBottomWidth: 1,
              borderTopWidth: 1,
              marginTop: 10,
            }}
          >
            <CardView
              gap={0}
              offset={0}
              pageWidth={80}
              data={boardLists}
              dot={false}
              height={40}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    borderBottomColor: "#67D393",
                    borderBottomWidth: 1,
                    width: 90,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "200" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={{ flexDirection: "row", padding: 10 }}>
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
              <View style={{ marginLeft: 200 }}>
                <DropDown
                  items={toggleItems}
                  value={orderList}
                  setValue={setOrderList}
                />
              </View>
            </View>
          </View>
          <CardView
            gap={0}
            offset={0}
            height={windowHeight - 170}
            pageWidth={windowWidth}
            dot={false}
            data={posts}
            renderItem={({ item }: any) => {
              return (
                <PostSearchListSection posts={posts} navigation={navigation} />
              );
            }}
          />
          {/* <FlatList data={posts} renderItem={({item}: any) => {
            const { id, title, preview, nickname, created, commentCount, likeCount } = item;
            return (
              <PostItemSection
                key={id}
                board_id={1}
                post_id={id}
                board_name={'시사'}
                //boardFormat={boardFormat}
                title={title}
                preview={preview}
                nickname={nickname}
                created={created}
                commentCount={commentCount}
                likeCount={likeCount}
                navigation={navigation}
              />
            )
          }} /> */}
        </>
      ) : (
        <>
          <View
            style={{
              borderColor: "#E3E3E3",
              borderBottomWidth: 1,
              borderTopWidth: 1,
              marginTop: 10,
            }}
          >
            <Text>추천 검색어</Text>
            <FlatList
              data={boardLists}
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  style={{
                    width: 100,
                    borderRadius: 13,
                    height: 25,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text>맞춤 키워드</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              columnWrapperStyle={{
                //justifyContent: 'space-between',
                margin: 10,
              }}
              numColumns={3}
              scrollEnabled={false}
            />
          </View>
          <View>
            <View style={{ flexDirection: "row", padding: 20 }}>
              <Text>최근 검색어</Text>
              <TouchableOpacity>
                <Text>전체삭제</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={[{ title: "비건 레시피" }, { title: "맛있는" }]}
              renderItem={({ item }: any) => (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity>
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default PostSearchScreen;
