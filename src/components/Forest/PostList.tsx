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
  Alert
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ListHeader from "./components/ListHeader";
import { LoginContext } from "../../common/Context";

import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import PostItem from "./components/PostItem";
import PlusButton from "../../common/PlusButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabProps } from "../../../App";

const { width, height } = Dimensions.get('window');

const PostListScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ForestStackParams, "PostList">) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<string>('');
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([] as any);
  const {isLogin, setLogin} = useContext(LoginContext);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const request = new Request();

  const board_name = route.params?.board_name;
  const board_category = route.params?.board_category;

  const getPosts = async () => {
    const response = await request.get('/forest/', {
      order: order,
      page: page,
      category_filter: board_category?.id
    }, null);
    if (page == 1) setPosts(response.data.data.results);
    else setPosts([...posts, ...response.data.data.results]);
    setCount(response.data.data.count);
  }

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setRefreshing(false);
  }

  const onEndReached = () => {
    if (page < Math.ceil(count / 10)) {
      setPage(page+1);
    }
  }

  useEffect(() => {
    if(board_name === '추천글' || board_name === '사슴의 추천글') setOrder('latest')
    else if(board_name === '인기글' || board_name === '사슴의 인기글') setOrder('hot')
    else if(board_name === '최신글' || board_name === '사슴의 최신글') setOrder('latest')
  }, [route.params?.board_name])

  useFocusEffect(useCallback(() => {
    getPosts();
  }, [order, refreshing, page]));

  return (
    <SafeAreaView style={styles.container}>
      <ListHeader
        board_name={board_name!}
        board_category={board_category}
        navigation={navigation}
      />
      <View style={{flexDirection: 'row', zIndex: 1, alignItems: 'center', padding: 15, backgroundColor: '#F1FCF5'}}>
        <Text style={{fontSize: 12, fontWeight: '400', flex: 1}}>전체 글 {count}개</Text>
      </View>
      <FlatList
        data={posts}
        style={{ flexGrow: 1 }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReachedThreshold={0.3}
        onEndReached={onEndReached}
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
      <PlusButton
        onPress={() => {
          if(!isLogin) {
            Alert.alert(
              "로그인이 필요합니다.",
              "로그인 항목으로 이동하시겠습니까?",
              [
                {
                  text: "이동",
                  onPress: () => navigationToTab.navigate('마이페이지', {})
      
                },
                {
                  text: "취소",
                  onPress: () => { },
                  style: "cancel"
                },
              ],
              { cancelable: false }
            );
          }
          else {
            navigation.navigate('PostUpload', {});
          }
        }}
        position="rightbottom" />
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
