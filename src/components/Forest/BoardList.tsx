import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { TextPretendard as Text } from "../../common/CustomText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CardView from "../../common/CardView";
import CustomHeader from "../../common/CustomHeader";
import PostItem, { HotPostItem } from "./components/PostItem";
import BoardItem from "./components/BoardItem";
import { LoginContext } from "../../common/Context";
import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import PlusButton from "../../common/PlusButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabProps } from "../../../App";
import Arrow from '../../assets/img/common/Arrow.svg';

const { width, height } = Dimensions.get("window");

const BoardListScreen = ({
  navigation,
}: NativeStackScreenProps<ForestStackParams, "BoardList">) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [page, setPage] = useState(1);
  const [boardLists, setBoardLists] = useState([] as any);
  const [posts, setPosts] = useState([] as any);
  const [hotPosts, setHotPosts] = useState([] as any);
  const [newPosts, setNewPosts] = useState([] as any);
  const {isLogin, setLogin} = useContext(LoginContext);

  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();

  const request = new Request();

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
    const response_hot = await request.get('/forest/', { order: 'hot' }, null);
    const response_new = await request.get('/forest/', { order: 'latest' }, null);
    setPosts(response.data.data.results);
    setHotPosts(response_hot.data.data.results);
    setNewPosts(response_new.data.data.results);
  };
  
  const chunkArray = (array: any, size: number) => {
    const chunkedArray = [];
    const length = array.length;
    let index = 0;
  
    while (index < length && chunkedArray.length < size) {
      const chunk = array.slice(index, index + size);
      chunkedArray.push(chunk);
      index += size;
    }
  
    return chunkedArray;
  };
  

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  }

  useEffect(() => {
    getBoardItems();
  }, [refreshing]);

  useFocusEffect(useCallback(() => {
    if(isLogin) getUserInfo();
  }, [isLogin]))

  useFocusEffect(useCallback(() => {
    getPosts();
  }, [refreshing]))

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        onSearch={() => {
          navigation.navigate("PostSearch");
        }}
      />
      <ScrollView nestedScrollEnabled={true}>
          <View
            style={{ backgroundColor: "#C8F5D7", padding: 20, height: 100 }}
          >
            <Text style={{ color: '#3C3C3C', fontWeight: '700', fontSize: 16, lineHeight: 22, letterSpacing: -0.6 }}>{isLogin? (`${nickname}님 이 정보들은 어떠신가요?`):('로그인 후 추천 글을 받아보세요')}</Text>
            <TouchableOpacity style={{flexDirection: 'row', marginTop: 10}} onPress={() => navigation.navigate('PostDetail', {post_id: posts[0]?.id})}>
              <View style={{borderColor: '#67D393', borderWidth: 1, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 4, backgroundColor: 'white'}}>
                <Text style={{color: '#67D393', fontSize: 10, fontWeight: '600'}}>#{posts[0]?.semi_categories[0].name}</Text>
              </View>
              <Text style={{color: '#3C3C3C', fontSize: 12, lineHeight: 18, marginLeft: 5}} numberOfLines={1}>{posts[0]?.title}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#F1FCF5",
              alignItems: "center",
              height: 240,
              justifyContent: "flex-end",
            }}
          />
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
              data={boardLists}
              renderItem={({ item }: any) => (
                <BoardItem
                  key={item.id}
                  data={item}
                  onPress={() => {
                    navigation.navigate("BoardDetail", { board_category: item });
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
        <View
          style={{
            paddingVertical: 15,
          }}
        >
          <View style={{flexDirection: 'row', paddingHorizontal: 15}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                flex: 1
              }}
            >
              사슴의 추천글
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
              navigation.navigate("PostList", {
                board_name: "사슴의 추천글",
              });
            }}>
              <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
              <Arrow width={12} height={12} color={'black'} />
            </TouchableOpacity>
          </View>
          <CardView
            gap={0}
            offset={0}
            data={chunkArray(posts, 3)}
            pageWidth={width}
            dot={true}
            onEndDrag={() => posts.length >= 9 && navigation.navigate('PostList', { board_name: '사슴의 추천글'})} 
            renderItem={({ item }: any) => {
              return (
                <FlatList
                  data={item}
                  scrollEnabled={false}
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
                        onRefresh={onRefresh}
                        isLogin={isLogin}
                        navigation={navigation}
                      />
                    );
                  }}
                />
              );
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: "#F1FCF5",
            padding: 20
          }}
        >
          <Text style={{color: '#3C3C3C', fontWeight: '700', fontSize: 16, lineHeight: 22}}>{isLogin ? `${nickname}님 이 정보들은 어떠신가요?` : '이 정보들은 어떠신가요?'}</Text>
          <FlatList
            data={posts.slice(0,3)}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: any) => (
              <TouchableOpacity style={{ flexDirection: "row", marginTop: 10}} onPress={() => {navigation.navigate('PostDetail', {post_id: item.id})}}>
                <View style={{borderColor: '#67D393', borderWidth: 1, borderRadius: 8, paddingVertical: 2, paddingHorizontal: 4, backgroundColor: 'white'}}>
                  <Text style={{color: '#67D393', fontSize: 10, fontWeight: '600'}}>#{item.semi_categories[0].name}</Text>
                </View>
                <Text style={{color: '#3C3C3C', fontSize: 12, lineHeight: 18, marginLeft: 5}} numberOfLines={1}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View
          style={{
            paddingVertical: 15,
          }}
        >
          <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingBottom: 15}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                flex: 1
              }}
            >
              사슴의 인기글
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
              navigation.navigate("PostList", {
                board_name: "사슴의 인기글",
              });
            }}>
              <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
              <Arrow width={12} height={12} color={'black'} />
            </TouchableOpacity>
          </View>
          <CardView
            gap={0}
            offset={0}
            data={chunkArray(hotPosts, 3)}
            pageWidth={width}
            dot={true}
            onEndDrag={() => navigation.navigate('PostList', { board_name: '사슴의 인기글'})} 
            renderItem={({ item }: any) => {
              return (
                <FlatList
                  data={item}
                  scrollEnabled={false}
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
                      <HotPostItem
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
                    )
                  }}
                />
              );
            }}
          />
        </View>
        <View
          style={{
            paddingVertical: 15,
          }}
        >
          <View style={{flexDirection: 'row', paddingHorizontal: 15}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                flex: 1
              }}
            >
              사슴의 최신글
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
              navigation.navigate("PostList", {
                board_name: "사슴의 최신글",
              });
            }}>
              <Text style={{ fontSize: 12, fontWeight: '500', marginRight: 5 }}>더보기</Text>
              <Arrow width={12} height={12} color={'black'}/>
            </TouchableOpacity>
          </View>
          <FlatList
            data={newPosts}
            scrollEnabled={false}
            keyExtractor={(item, index) => item.id.toString()}
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
                  onRefresh={onRefresh}
                  isLogin={isLogin}
                  navigation={navigation}
                />
              );
            }}
          />
        </View>
      </ScrollView>
      <PlusButton
        onPress={() => {
          if(!isLogin) {
            Alert.alert(
              "로그인이 필요합니다.",
              "로그인 항목으로 이동하시겠습니까?",
              [
                {
                  text: "이동",
                  onPress: () => navigationToTab.navigate('마이페이지')
      
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
    backgroundColor: "#FFFFFF",
  },
});

export default BoardListScreen;
