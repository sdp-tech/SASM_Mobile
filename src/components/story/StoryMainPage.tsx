import { useState, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import SearchBar from "../../common/SearchBar";
import { Request } from "../../common/requests";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { StoryProps } from "../../pages/Story";
import CardView from "../../common/CardView";
import Add from "../../assets/img/Story/Add.svg";
import StorySearch from "./components/StorySearch";
import Category from "../../common/Category";
import MainCard from "./components/MainCard";
import DropDown from "../../common/DropDown";
import Arrow from "../../assets/img/common/Arrow.svg";

const StoryMainPage = ({ navigation, route }: StoryProps) => {
  const [item, setItem] = useState([] as any);
  //const [orderList, setOrderList] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<any>(null);
  const [search, setSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState([] as any);
  const [count, setCount] = useState<number>(0);
  const { width, height } = Dimensions.get("screen");

  const request = new Request();

  useFocusEffect(
    useCallback(() => {
      handleSearchToggle();
      getStories();
    }, [page, search])
  );

  const handleSearchToggle = async () => {
    if (search.length === 0) {
      setPage(1);
      setItem([]);
    }
  };

  const getStories = async () => {
    const response = await request.get("/stories/story_search/", {
      page: page,
      search: search,
      latest: true
    }, null);

    if (page === 1) {
      setItem(response.data.data.results);
    } else {
      setItem([...item, ...response.data.data.results]);
    }
    setCount(response.data.data.count);
    setNextPage(response.data.data.next);
  };
  
  const onRefresh = async () => {
    if (!refreshing || page !== 1) {
      setRefreshing(true);
      setPage(1);
      setRefreshing(false);
    }
  };

  const onEndReached = async () => {
    if(search.length > 0 && nextPage !== null){
      setPage(page + 1);
    }
    else {
      return;
    }
  };

  const [orderList, setOrderList] = useState(0);
  const toggleItems = [
    { label: '에디터의 추천 스토리', title: '에디터가 직접 선정한 알찬 스토리를 둘러보세요.', value: 0 },
    { label: '방금 올라온 스토리', title: '가장 생생한 장소의 이야기가 궁금하다면?', value: 1 },
    { label: '이번 달 인기 스토리', title: '5월, 가장 많은 사람들의 관심을 받은 이야기를 둘러보세요.', value: 2 },
  ]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", }}>
      <SearchBar
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        style={{ backgroundColor: "#D9D9D9", opacity: 0.3, marginTop: 20 }}
        placeholder="장소명 / 내용 / 카테고리로 검색해보세요!"
        placeholderTextColor={"black"}
      />
      {search.length > 0 ? (
        <StorySearch
          item={item}
          //orderList={""}
          count={count}
          navigation={navigation}
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          onEndReached={onEndReached}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <View>
          <View style={{ flexDirection: "row", paddingHorizontal: 30, paddingTop: 30 }}>
            <View style={{flex: 1}}>
              <Text style={textStyles.title}>{toggleItems[orderList].label}</Text>
              <Text style={textStyles.subtitle}>{toggleItems[orderList].title}</Text>
            </View>
            <TouchableOpacity onPress={() => setOrderList((orderList+1)%3)}>
              <Arrow transform={[{rotate: '90deg'}]}/>
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor: "white", width: width, marginVertical: 10, shadowOffset: { width: 0, height: 1 }, shadowColor: "black", shadowOpacity: 0.1}}>
            <Category
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              story={true}
            />
          </View>
          <View style={{paddingVertical: 20}}>
            <CardView data={item} gap={0} offset={0} pageWidth={width} height={width*0.84+150} dot={true}
              renderItem={({item}: any) => {
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
                    writer_is_verified={item.writer_is_verified}
                    navigation={navigation}
                    width={width}
                  />
                )
              }}/>
          </View>
          <TouchableOpacity
          onPress={() => {
            navigation.navigate("WriteStory");
          }}
          style={{
            position: "absolute",
            width: 45,
            height: 45,
            top: height * 0.7,
            left: width * 0.85,
            borderRadius: 60,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#209DF5",
            opacity: 0.7
          }}
        >
          <Add />
        </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const textStyles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "400",
    marginTop: 2,
    marginBottom: 5,
  },
});

export default StoryMainPage;