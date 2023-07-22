import React, { useState, useEffect, useCallback, useContext } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import ListHeader from "./components/ListHeader";
import Add from "../../assets/img/common/Add.svg";
import { LoginContext } from "../../common/Context";

import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import DropDown from "../../common/DropDown";
import PostItem from "./components/PostItem";
import PlusButton from "../../common/PlusButton";

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
  const [posts, setPosts] = useState([]);
  const {isLogin, setLogin} = useContext(LoginContext);

  const request = new Request();

  const board_name = route.params?.board_name;
  const board_category = route.params?.board_category;

  const getPosts = async () => {
    setLoading(true);
    const response = await request.get('/forest/', {
      order: order,
      category_filter: board_category?.id
    }, null);
    setPosts(response.data.data.results);
    setCount(response.data.data.count);
    setLoading(false);
  }

  const onChangeOrder = async () => {
    setOrder(toggleItems[orderList].order);
  }

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  }

  useEffect(() => {
    onChangeOrder();
  }, [orderList]);

  useFocusEffect(useCallback(() => {
    getPosts();
  }, [order, refreshing]));

  return (
    <SafeAreaView style={styles.container}>
      <ListHeader
        board_name={board_name!}
        board_category={board_category}
        navigation={navigation}
      />
      <View style={{flexDirection: 'row', zIndex: 1, alignItems: 'center', padding: 15, backgroundColor: '#F1FCF5'}}>
        <Text style={{fontSize: 12, fontWeight: '400', flex: 1}}>전체 검색결과 {count}개</Text>
      </View>
      <FlatList
        data={posts}
        style={{ flexGrow: 1 }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReachedThreshold={0}
        ListFooterComponent={loading ? <ActivityIndicator /> : <></>}
        renderItem={({ item }) => {
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
                  onRefresh={onRefresh}
                  isLogin={isLogin}
                  navigation={navigation}
                />
          );
        }}
      />
      {isLogin &&
        <PlusButton
          onPress={() => navigation.navigate('PostUpload', {})}
          position="rightbottom" />
      }
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

export default PostListScreen;
