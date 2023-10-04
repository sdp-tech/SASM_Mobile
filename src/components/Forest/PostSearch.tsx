import { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Platform,
  Alert
} from "react-native";
import { TextPretendard as Text } from "../../common/CustomText";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LoginContext } from "../../common/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ForestStackParams } from "../../pages/Forest";
import { Request } from "../../common/requests";
import SearchBar from "../../common/SearchBar";
import CardView from "../../common/CardView";
import DropDown from "../../common/DropDown";
import PostItem from "./components/PostItem";
import Arrow from "../../assets/img/common/Arrow.svg";
import PlusButton from "../../common/PlusButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabProps } from "../../../App";

const { width, height } = Dimensions.get('window');

const PostSearchScreen = ({
  navigation,
}: NativeStackScreenProps<ForestStackParams, "PostSearch">) => {
  const toggleItems = [
    { label: '최신순', value: 0, order: 'latest' },
    { label: '인기순', value: 1, order: 'hot' },
  ]
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(0);
  const [orderList, setOrderList] = useState(0);
  const [order, setOrder] = useState<string>(toggleItems[orderList].order);
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([] as any); // id, title, preview, nickname, email, likeCount, created, commentCount
  const [page, setPage] = useState(1);
  const {isLogin, setLogin} = useContext(LoginContext);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const request = new Request();

  const boardLists = [
    { id: 1, name: "시사" },
    { id: 2, name: "문화" },
    { id: 3, name: "생활" },
    { id: 4, name: "뷰티" },
    { id: 5, name: "푸드" },
    { id: 6, name: "액티비티" },
  ];

  const onChangeOrder = async () => {
    setOrder(toggleItems[orderList].order);
    setPage(1);
  }

  const checkCategory = (itemId: any) => {
    setCategory(itemId);
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
    onChangeOrder();
  }, [orderList]);

  useFocusEffect(useCallback(() => {
    getPosts();
  }, [order, search, category, page, refreshing]));

  const getPosts = async () => {
    const response = await request.get(
      "/forest/",
      {
       order: order,
       search: search,
       category_filter: category > 0 ? category : [''],
       page: page
      },
      null
    );
    if (page == 1) setPosts(response.data.data.results);
    else setPosts([...posts, ...response.data.data.results]);
    setCount(response.data.data.count);
  };

  const recommendData = [
    '슬로우 패션', '비건', 'ESG', '비건 레시피', '비건 레스토랑', '자연', '숲', '한강'
  ]

  const [recentSearches, setRecentSearches] = useState([] as any);

  useEffect(() => {
    if(search.length == 0) loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches_forest');
      console.log(searches)
      if (searches) {
        const searchesArray = JSON.parse(searches);
        setRecentSearches(searchesArray);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearches = async (search: any) => {
    try {
      await AsyncStorage.setItem('recentSearches_forest', JSON.stringify(search));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const handleSearchSubmit = () => {
    if (search.trim() === '') return;
    const updatedSearches = [search, ...recentSearches];
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const handleDeleteSearch = (search: string) => {
    const updatedSearches = recentSearches.filter((item: any) => item !== search);
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };
  
  const handleDeleteAll = async () => {
    try {
      await AsyncStorage.removeItem('recentSearches_forest');
    } catch (e) {
      console.error(e)
    }
    setRecentSearches([])
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingTop: 10 }}>
      <View style={{flexDirection: 'row', marginTop: Platform.OS == 'ios' ? 5 : 0}}>
      <TouchableOpacity style={{justifyContent: 'center', marginLeft: 10}} onPress={()=>{navigation.goBack();}}>
        <Arrow width={18} height={18} transform={[{rotate: '180deg'}]} color={'black'}/>
      </TouchableOpacity>
      <SearchBar
        search={search}
        setSearch={setSearch}
        style={{ backgroundColor: "#F4F4F4", width: '85%' }}
        placeholder={"궁금한 포레스트를 검색해보세요"}
        placeholderTextColor={'#848484'}
        onSubmitEditing={handleSearchSubmit}
        returnKeyType='search'
      />
      </View>
      {search.length > 0 ? (
        <>
          <View
            style={{
              borderColor: "#E3E3E3",
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
                    borderBottomColor: item.id === category ? "#67D393" : "#E3E3E3",
                    borderBottomWidth: 2,
                    width: 90,
                    height: 40,
                    justifyContent: "center",
                  }}
                  onPress={()=>checkCategory(item.id)}
                >
                  <Text style={{ fontSize: 14, fontWeight: "200" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={{flexDirection: 'row', zIndex: 1, alignItems: 'center', padding: 15, backgroundColor: '#F1FCF5'}}>
              <Text style={{fontSize: 12, fontWeight: '400', flex: 1}}>전체 검색결과 {count}개</Text>
              <View style={{width: 100, zIndex: 2000}}>
                <DropDown value={orderList} setValue={setOrderList} isBorder={false} items={toggleItems} />
              </View>
            </View>
              <FlatList
                data={posts}
                style={{flexGrow: 1}}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.2}
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
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', }}>
              {recommendData.map((item) => (
                <TouchableOpacity onPress={()=>{setSearch(item); handleSearchSubmit()}}
                  style={{height: 30, borderRadius: 16, borderColor: '#67D393', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 16, marginRight: 8, marginBottom: 8, justifyContent: 'center'}}>
                  <Text style={{color: '#202020', fontSize: 14}}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{flex: 4, padding: 20}}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{flex: 1, color: '#3C3C3C', fontSize: 16, fontWeight: '700', marginBottom: 15, lineHeight: 20}}>최근 검색어</Text>
              <TouchableOpacity onPress={handleDeleteAll}>
                <Text style={{color: '#848484', fontSize: 14, fontWeight: '500', lineHeight: 20}}>전체삭제</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentSearches}
              renderItem={({ item }: any) => (
                <View style={{ flexDirection: "row", borderBottomColor: '#A8A8A8', borderBottomWidth: 1, width: width-40, paddingVertical: 5 }}>
                  <TouchableOpacity style={{flex: 1}} onPress={() => setSearch(item)}>
                    <Text style={{color: '#373737', lineHeight: 20}}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteSearch(item)}>
                    <Text style={{color: '#A8A8A8'}}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </>
      )}
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

export default PostSearchScreen;
