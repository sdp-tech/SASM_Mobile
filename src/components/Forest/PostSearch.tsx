import { useEffect, useState } from "react";
// import { TextPretendard as Text } from "../../common/CustomText";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Text
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ForestStackParams, BoardFormat } from "../../pages/Forest";
import { Request } from "../../common/requests";
import SearchBar from "../../common/SearchBar";
import CardView from "../../common/CardView";
import DropDown from "../../common/DropDown";
import PostItem from "./components/PostItem";
import Add from "../../assets/img/common/Add.svg";

const { width, height } = Dimensions.get('window');

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
          writer,
          photos,
          rep_pic,
          comment_cnt,
          like_cnt,
          user_likes
        } = item;
        return (
          <PostItem
                key={id}
                post_id={id}
                title={title}
                preview={preview}
                writer={writer}
                photos={photos}
                rep_pic={rep_pic}
                comment_cnt={comment_cnt}
                like_cnt={like_cnt}
                user_likes={user_likes}
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
  const toggleItems = [
    { label: '최신순', value: 0, order: 'latest' },
    { label: '인기순', value: 1, order: 'hot' },
  ]
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [boardFormat, setBoardFormat] = useState<BoardFormat>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [orderList, setOrderList] = useState(0);
  const [order, setOrder] = useState<string>(toggleItems[orderList].order);
  const [count, setCount] = useState(0);
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

  // const getBoardFormat = async () => {
  //   const response = await request.get(`/community/boards/${1}/`);
  //   setBoardFormat(response.data);
  //   //console.log(response.data)
  // };
  const onChangeOrder = async () => {
    setOrder(toggleItems[orderList].order);
  }

  useEffect(() => {
    onChangeOrder();
  }, [orderList]);

  useEffect(() => {
    // getBoardFormat();
    getPosts();
  }, [order, search, category]);

  const getPosts = async () => {
    const response = await request.get(
      "/forest/",
      {
       order: order,
       search: search,
       category_filter: category
      },
      null
    );
    setPosts(response.data.data.results);
    setCount(response.data.data.count);
    //console.log(response.data.data.results);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        style={{ backgroundColor: "#F4F4F4", width: 350 }}
        placeholder={"무엇을 검색하시겠습니까"}
      />
      {search.length > 0 ? (
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
              renderItem={({ item }: any) => (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    borderBottomColor: "#67D393",
                    borderBottomWidth: 1,
                    width: 90,
                    justifyContent: "center",
                  }}
                  onPress={()=>setCategory(item.id)}
                >
                  <Text style={{ fontSize: 14, fontWeight: "200" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={{flexDirection: 'row', zIndex: 1, alignItems: 'center', padding: 15, backgroundColor: '#F1FCF5'}}>
              <Text style={{fontSize: 12, fontWeight: '400', flex: 1}}>전체 검색결과 {count}개</Text>
              <View style={{width: 100, zIndex: 2000}}>
                <DropDown value={orderList} setValue={setOrderList} isBorder={false} items={toggleItems} />
              </View>
            </View>
          </View>
          <CardView
            gap={0}
            offset={0}
            pageWidth={width}
            dot={false}
            data={posts}
            renderItem={({ item }: any) => {
              return (
                <PostSearchListSection posts={posts} navigation={navigation} />
              );
            }}
          />
        </>
      ) : (
        <>
          <View
            style={{
              flex: 1,
              borderColor: "#E3E3E3",
              borderTopWidth: 1,
              marginTop: 10,
              padding: 15
            }}
          >
            <Text style={{color: '#3C3C3C', fontSize: 16, fontWeight: '700', marginBottom: 15}}>추천 검색어</Text>
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
              {boardLists.map((item) => (
                <TouchableOpacity onPress={()=>{setSearch(item.name)}}
                  style={{height: 30, borderRadius: 16, backgroundColor: '#67D393', paddingVertical: 4, paddingHorizontal: 16, marginRight: 8, marginBottom: 8}}>
                  <Text style={{color: 'white', fontSize: 14, lineHeight: 20}}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{flex: 4, padding: 20}}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{flex: 1, color: '#3C3C3C', fontSize: 16, fontWeight: '700', marginBottom: 15, lineHeight: 20}}>최근 검색어</Text>
              <TouchableOpacity>
                <Text style={{color: '#848484', fontSize: 14, fontWeight: '500', lineHeight: 20}}>전체삭제</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={[{ title: "비건 레시피" }, { title: "맛있는" }]}
              renderItem={({ item }: any) => (
                <View style={{ flexDirection: "row", borderBottomColor: '#A8A8A8', borderBottomWidth: 1, width: width-40, paddingVertical: 5 }}>
                  <TouchableOpacity style={{flex: 1}}>
                    <Text style={{color: '#373737', lineHeight: 20}}>{item.title}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={{color: '#A8A8A8'}}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </>
      )}
      <TouchableOpacity onPress={() => {navigation.navigate('CategoryForm', {})}}
            style={{position: "absolute", top: height * 0.85, left: width * 0.85, shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3}}
          >
            <Add />
          </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PostSearchScreen;
