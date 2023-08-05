import { useState, useEffect, useCallback, useContext } from "react";
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Dimensions, Alert } from "react-native";
import { TextPretendard as Text } from '../../common/CustomText';
import SearchBar from "../../common/SearchBar";
import { Request } from "../../common/requests";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
    { label: '조회수 순', value: 0, title: '에디터의 추천 스토리', subtitle: '에디터가 직접 선정한 알찬 스토리를 둘러보세요.', order: 'oldest' },
    { label: '최신 순', value: 1, title: '방금 올라온 스토리', subtitle: '가장 생생한 장소의 이야기가 궁금하다면?', order: 'latest' },
    { label: '인기 순', value: 2, title: '이번 달 인기 스토리', subtitle: '5월, 가장 많은 사람들의 관심을 받은 이야기를 둘러보세요.', order: 'hot' },
  ]
  const {isLogin, setLogin} = useContext(LoginContext);
  const [item, setItem] = useState([] as any);
  const [orderList, setOrderList] = useState(0);
  const [order, setOrder] = useState<string>(toggleItems[orderList].order);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<any>(null);
  const [search, setSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const { width, height } = Dimensions.get("screen");
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const request = new Request();

  useEffect(() => {
    onChangeOrder();
  }, [orderList]);

  useFocusEffect(
    useCallback(() => {
      getStories();
    }, [page, checkedList, order])
  );
  
  const getStories = async () => {
    let params = new URLSearchParams();
    for (const category of checkedList){
      params.append('filter', category);
    }
    params.append('search', search);
    params.append('page', page.toString());
    params.append('order', order);
    const response = await request.get(`/stories/story_search/?${params.toString()}`,null, null)
    if (page === 1) {
      setItem(response.data.data.results);
    } else {
      setItem([...item, ...response.data.data.results]);
    }
    setCount(response.data.data.count);
    setNextPage(response.data.data.next);
  };

  const onChangeOrder = async () => {
    setOrder(toggleItems[orderList].order);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <CustomHeader
        onSearch={() => {
          navigation.navigate("StorySearch");
        }}
      />
          <View style={{ flexDirection: "row", paddingHorizontal: 30, paddingVertical: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={textStyles.title}>{toggleItems[orderList].title}</Text>
              <Text style={textStyles.subtitle}>{toggleItems[orderList].subtitle}</Text>
            </View>
            <TouchableOpacity onPress={() => setOrderList((orderList + 1) % 3)} style={{ marginTop: 10 }}>
              <Reload />
            </TouchableOpacity>
          </View>
          <View style={{ borderTopColor: 'rgba(203, 203, 203, 1)', borderTopWidth: 1, paddingTop: 10}}>
            <Category
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              story={true}
            />
          </View>
          <View style={{ paddingVertical: 5 }}>
            <CardView data={item} gap={0} offset={0} pageWidth={width} dot={true} green={true}
              renderItem={({ item }: any) => {
                return (
                  <MainCard
                    id={item.id}
                    rep_pic={item.rep_pic}
                    place_name={item.place_name}
                    title={item.title}
                    story_like={item.story_like}
                    category={item.category}
                    preview={item.preview}
                    writer={item.writer}
                    nickname={item.nickname}
                    profile={item.profile}
                    writer_is_verified={item.writer_is_verified}
                    isLogin={isLogin}
                    navigation={navigation}
                    width={width}
                  />
                )
              }} />
          </View>
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
            navigation.navigate('WriteStory');
          }
        }}
        position="rightbottom" />
    </SafeAreaView>
  );
};

const textStyles = StyleSheet.create({
  title: {
    fontSize: 21,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "400",
    marginTop: 5,
    color: '#444444'
  },
});

export default StoryMainPage;