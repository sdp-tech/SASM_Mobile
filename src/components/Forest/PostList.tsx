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
import CustomHeader from "../../common/CustomHeader";

import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import PostItem from "./components/PostItem";
import PlusButton from "../../common/PlusButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabProps } from "../../../App";
import { check } from "react-native-permissions";

const { width, height } = Dimensions.get('window');
const request = new Request();

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
  const [nickname, setNickname] = useState('');
  const [boardLists, setBoardLists] = useState([] as any);
  const [userCategories, setUserCategories] = useState([] as any);
  const [checkedList, setCheckedList] = useState([] as any);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // console.error('category는',board_category)
  const getUserInfo = async () => {
    const response = await request.get('/mypage/me/', {}, {});
    setNickname(response.data.data.nickname);
  }

  const getBoardItems = async () => {
    const response = await request.get('/forest/categories/');
    setBoardLists(response.data.data.results);
  }

  const getUserCategories = async () => {
    const response = await request.get('/forest/user_categories/get/');
    setUserCategories([...response.data.data.results, {id: 0, name: '+'}]);
  }

  // const getPosts = async () => {
  //   const response = await request.get('/forest/', {
  //     order: order,
  //     page: page,
  //     category_filter: board_category?.id
  //   }, null);
  //   if (page == 1) setPosts(response.data.data.results);
  //   else setPosts([...posts, ...response.data.data.results]);
  //   setCount(response.data.data.count);
  // }

  const getPosts = async () => {
    let params = new URLSearchParams();
    for (const category of board_category){
      params.append('semi_category_filters', category.id);
    }
    const response = await request.get(`/forest/?${params.toString()}`, {}, null);
    setPosts(response.data.data.results);
    setCount(response.data.data.count);

  };

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
  }, [route.params?.board_name])

  useFocusEffect(useCallback(() => {
    getPosts();
    console.error('길이',board_category.length)
    //console.error(checkedList)
  }, [order, refreshing, page, checkedList]));

  useEffect(() => {
    getBoardItems();
  }, [refreshing]);

  useFocusEffect(useCallback(() => {
    if(isLogin) {
      getUserInfo();
      getUserCategories();
    }
  }, [isLogin, modalVisible]))

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onSearch={() => {
          navigation.navigate("PostSearch");
        }}
      />
      <ListHeader
        board_name={board_name!}
        // board_category={board_category}
        navigation={navigation}
      />
      <View style={{flexDirection: 'row', zIndex: 1, alignItems: 'center', padding: 15, backgroundColor: '#F1FCF5'}}>
        <Text style={{fontSize: 12, fontWeight: '400', flex: 1}}>전체 글 {count}개</Text>
      </View>
      {/* 여기에 semicategory 추가하기 */}
      {board_category.length > 0 &&
            <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingBottom: 5}}>
              {board_category.map((category: any) => 
                (
                  <Text style={{color: '#67D393', fontWeight: '700', fontSize: 16}}>
                    #{category.name+' '}
                  </Text>
                )
              )}
              <Text style={{color: '#67D393', fontWeight: '700', fontSize: 16}}>
                과 관련된 정보들
              </Text>
            </View>
          }
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
