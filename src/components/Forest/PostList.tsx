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
import Add from "../../assets/img/common/Add.svg";

import { ForestStackParams, BoardFormat } from "../../pages/Forest";
import { Request } from "../../common/requests";
import DropDown from "../../common/DropDown";
import PostItem from "./components/PostItem";

interface PostSectionProps {
  name: string;
  postCount: number;
  doHashtagSearch: any;
}

interface PostSearchSectionProps {
  boardId: number;
  searchQuery: string;
  doHashtagSearch: any;
}
const { width, height } = Dimensions.get('window');

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

  const board_name = route.params?.board_name;
  const board_category = route.params?.board_category;

  const getPosts = async () => {
    setLoading(true);
    const response = await request.get('/forest/', {
      order: order,
      category_filter: board_category.id
    }, null);
    setPosts(response.data.data.results);
    setCount(response.data.data.count);
    setLoading(false);
    console.log(response)
  }

  const onChangeOrder = async () => {
    setOrder(toggleItems[orderList].order);
  }

  useEffect(() => {
    onChangeOrder();
  }, [orderList]);

  useEffect(() => {
    getPosts();
  }, [order]);

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

  return (
    <SafeAreaView style={styles.container}>
      <ListHeader
        board_name={board_name!}
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
                    writer,
                    photos,
                    created,
                    commentCount,
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
                          created={created}
                          commentCount={commentCount}
                          like_cnt={like_cnt}
                          user_likes={user_likes}
                          navigation={navigation}
                        />
                  );
                }}
              />
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
