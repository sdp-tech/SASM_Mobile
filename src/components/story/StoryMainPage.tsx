import { useState, useEffect, useCallback, useContext } from "react";
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from "react-native";
import { TextPretendard as Text } from '../../common/CustomText';
import SearchBar from "../../common/SearchBar";
import { Request } from "../../common/requests";
import { useFocusEffect, useNavigation, useIsFocused } from "@react-navigation/native";
import { StoryProps } from "../../pages/Story";
import CardView from "../../common/CardView";
import CustomHeader from "../../common/CustomHeader";
import StorySearch from "./components/StorySearch";
import Category from "../../common/Category";
import MainCard from "./components/MainCard";
import Reload from "../../assets/img/Story/Reload.svg";
import PlusButton from "../../common/PlusButton";
import { LoginContext } from "../../common/Context";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabProps } from "../../../App";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-safearea-height";
import ToListView from '../../assets/img/Story/ToListView.svg';
import ToCardView from '../../assets/img/Story/ToCardView.svg';
import SearchList from "./components/SearchList";
import ListCard from "./components/ListCard";

export interface StoryListProps {
  id: number;
  place_name: string;
  title: string;
  category: string;
  semi_category: string;
  preview: string;
  rep_pic: string;
  story_like: boolean;
  writer: string;
  writer_is_verified: boolean;
}

const StoryMainPage = ({ navigation, route }: StoryProps) => {
  const toggleItems = [
    { label: '조회수 순', value: 0, title: 'SASM의 추천 스토리', subtitle: '사슴이 직접 선정한 알찬 스토리를 둘러보세요.', order: 'oldest' },
    { label: '최신 순', value: 1, title: '방금 올라온 스토리', subtitle: '가장 생생한 장소의 이야기가 궁금하다면?', order: 'latest' },
    { label: '인기 순', value: 2, title: '이번 달 인기 스토리', subtitle: '가장 많은 사람들의 관심을 받은 이야기를 둘러보세요.', order: 'hot' },
  ]
  const {isLogin, setLogin} = useContext(LoginContext);
  const [item, setItem] = useState([] as any);
  const [orderList, setOrderList] = useState(0);
  const [order, setOrder] = useState<string>(toggleItems[orderList].order);
  const [page, setPage] = useState<number>(1);
  const [prevPage, setPrevPage] = useState<any>(null);
  const [nextPage, setNextPage] = useState<any>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [cardView, setCardView] = useState<boolean>(true);
  const { width, height } = Dimensions.get("window");
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const request = new Request();
  const statusBarHeight = getStatusBarHeight();

  useEffect(() => {
    onChangeOrder();
  }, [orderList]);

  useFocusEffect(
    useCallback(() => {
      getStories();
    }, [page, checkedList, order, cardView])
  );

  useEffect(() => {
    setPage(1);
  }, [checkedList, order, cardView])

  const getStories = async () => {
    setLoading(true)
    let params = new URLSearchParams();
    for (const category of checkedList){
      params.append('filter', category);
    }
    const response = await request.get(`/stories/story_search/?${params.toString()}`, {
      page: page,
      order: order
    }, null)
    if(!cardView){
      setItem([...item, ...response.data.data.results]);
    } else {
      setItem(response.data.data.results)
    }
    setCount(response.data.data.count);
    setPrevPage(response.data.data.previous);
    setNextPage(response.data.data.next);
    setLoading(false);
  };

  const onChangeOrder = async () => {
    setOrder(toggleItems[orderList].order);
    // setPage(1);
    setItem([]);
  }

  const onEndReached = () => {
    if (nextPage && !cardView) {
      setPage(page + 1)
    }
    console.error(cardView)
  }

  const toggleView = () => {
    setCardView(!cardView);
    // setPage(1);
    setItem([]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <CustomHeader
        onSearch={() => {
          navigation.navigate("StorySearch");
        }}
      />
          <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingVertical: height * 0.02 }}>
            <View style={{ flex: 1 }}>
              <Text style={textStyles.title}>{toggleItems[orderList].title}</Text>
              <Text style={textStyles.subtitle}>{toggleItems[orderList].subtitle}</Text>
            </View>
            <TouchableOpacity style={{ justifyContent: 'center', marginRight: 15, marginBottom: 5}} onPress={toggleView}>
              {
                !cardView ? <ToListView width={18} height={18}/> : <ToCardView width={18} height={18}/>
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOrderList((orderList + 1) % 3)} style={{ marginTop: 10 }}>
              <Reload />
            </TouchableOpacity>
          </View>
          <View style={{ borderTopColor: 'rgba(203, 203, 203, 1)', borderTopWidth: 1, paddingTop: 10, paddingLeft: 15}}>
            <Category
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              story={true}
            />
          </View>
          {
            cardView ? 
            <ScrollView nestedScrollEnabled scrollEnabled={height-statusBarHeight-88 > 700 ? false : true} style={{ marginVertical: 10 }} showsVerticalScrollIndicator={false}>
              {loading ? <ActivityIndicator style={{ justifyContent: 'center', height: width*0.85+140}} /> : 
                <CardView data={item} gap={0} offset={0} pageWidth={width} dot={true} green={true}
                from='story' onNext={() => nextPage && setPage(page+1)} onPrev={() => prevPage && (page > 0) && setPage(page-1)}
                renderItem={({ item }: any) => {
                  const { id, rep_pic, place_name, title, story_like, category, preview, summary, writer, nickname, profile, writer_is_verified } = item;
                  return (
                    <MainCard
                      id={id}
                      rep_pic={rep_pic}
                      place_name={place_name}
                      title={title}
                      story_like={story_like}
                      category={category}
                      preview={preview}
                      summary={summary}
                      writer={writer}
                      nickname={nickname}
                      profile={profile}
                      writer_is_verified={writer_is_verified}
                      isLogin={isLogin}
                      navigation={navigation}
                    />
                  )
                }} />
              }
            </ScrollView>
            :
            <View style={{paddingTop: 10, alignItems: 'center', flex: 1}}>
              <FlatList
                data={item}
                onEndReached={onEndReached}
                onEndReachedThreshold={1}
                keyExtractor={(item) => item.id}
                renderItem={({ item }: any) => {
                  const { id, rep_pic, extra_pics, place_name, title, story_like, created, preview, summary, writer, nickname, profile, writer_is_verified } = item;
                  return (
                    <ListCard
                      id={id}
                      rep_pic={rep_pic}
                      extra_pics={extra_pics}
                      place_name={place_name}
                      title={title}
                      story_like={story_like}
                      created={created}
                      preview={preview}
                      summary={summary}
                      writer={writer}
                      nickname={nickname}
                      writer_is_verified={writer_is_verified}
                      isLogin={isLogin}
                      navigation={navigation}
                    />
                  )
                }}
              />
            </View>
          }
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
                navigation.navigate('WriteStory');
              }
            }}
            position="rightbottom"
          />
    </SafeAreaView>
  );
};

const textStyles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.6
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 5,
    color: '#444444',
    letterSpacing: -0.6
  },
});

export default StoryMainPage;