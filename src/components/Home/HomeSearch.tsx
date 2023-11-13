import { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  FlatList,
} from "react-native";
import { TextPretendard as Text } from "../../common/CustomText";
import { Request } from "../../common/requests";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps, StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParams } from "../../pages/Home";
import SearchBar from "../../common/SearchBar";
import SearchList from "../story/components/SearchList";
import ToCardView from "../../assets/img/Story/ToCardView.svg";
import ToListView from "../../assets/img/Story/ToListView.svg";
import DropDown from "../../common/DropDown";
import Arrow from "../../assets/img/common/Arrow.svg";
import NothingIcon from "../../assets/img/nothing.svg";
import Close from "../../assets/img/common/Close.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchResultTabView from "./Search/SearchResultTabView";

export default function HomeSearch({
  navigation,
}: StackScreenProps<HomeStackParams, "Search">) {
  const toggleItems = [
    { label: "최신 순", value: 0, order: "latest" },
    { label: "인기 순", value: 1, order: "hot" },
  ];
  const [item, setItem] = useState([] as any);
  const [orderList, setOrderList] = useState(0);
  const [order, setOrder] = useState<string>(toggleItems[orderList].order);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [count, setCount] = useState<any>({ curation: 0, story: 0, forest: 0 });
  const { width, height } = Dimensions.get("screen");
  const request = new Request();

  useEffect(() => {
    getResult();
  }, [search]);

  const getResult = async () => {
    const response = await request.get(`/curations/total_search/`, {
      search: search,
      order: "latest",
    });

    setItem(response.data.data);
    setCount({
      curation: response.data.curation_count,
      story: response.data.story_count,
      forest: response.data.forest_count,
    });
  };

  const onRefresh = async () => {
    if (!refreshing) {
      setRefreshing(true);
      getResult();
      setRefreshing(false);
    }
  };

  const onEndReached = async () => {
    if (search.length > 0 && nextPage !== null) {
      setPage(page + 1);
    } else {
      return;
    }
  };

  const recommendData = [
    "비건",
    "제로웨이스트",
    "카페",
    "식당",
    "서울",
    "한강",
    "자연",
  ];

  const [recentSearches, setRecentSearches] = useState([] as any);

  useEffect(() => {
    if (search.length == 0) loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem("recentSearches_home");
      console.log(searches);
      if (searches) {
        const searchesArray = JSON.parse(searches);
        setRecentSearches(searchesArray);
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearches = async (search: any) => {
    try {
      await AsyncStorage.setItem("recentSearches_home", JSON.stringify(search));
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };

  const handleSearchSubmit = () => {
    if (search.trim() === "") return;
    const updatedSearches = [search, ...recentSearches];
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const handleDeleteSearch = (search: string) => {
    const updatedSearches = recentSearches.filter(
      (item: any) => item !== search
    );
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const handleDeleteAll = async () => {
    try {
      await AsyncStorage.removeItem("recentSearches_home");
    } catch (e) {
      console.error(e);
    }
    setRecentSearches([]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingTop: 10 }}>
      <View
        style={{
          flexDirection: "row",
          marginTop: Platform.OS == "ios" ? 5 : 0,
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "center", marginLeft: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Arrow
            width={18}
            height={18}
            transform={[{ rotate: "180deg" }]}
            color={"black"}
          />
        </TouchableOpacity>
        <SearchBar
          search={search}
          setSearch={setSearch}
          style={{ backgroundColor: "#F4F4F4", width: "85%" }}
          placeholder={"궁금한 정보를 검색해 보세요."}
          placeholderTextColor={"#848484"}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          autoFocus
        />
      </View>
      {search.length > 0 ? (
        <SearchResultTabView
          data={item}
          search={search}
          count={count}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <>
          <View
            style={{
              flex: 1,
              borderColor: "#E3E3E3",
              borderTopWidth: 1,
              marginTop: 10,
              padding: 15,
            }}
          >
            <Text
              style={{
                color: "#3C3C3C",
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 15,
              }}
            >
              추천 검색어
            </Text>
            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
              {recommendData.map((item) => (
                <TouchableOpacity
                  onPress={() => {
                    setSearch(item);
                    handleSearchSubmit();
                  }}
                  style={{
                    height: 30,
                    borderRadius: 16,
                    borderColor: "#67D393",
                    borderWidth: 1,
                    paddingVertical: 4,
                    paddingHorizontal: 16,
                    marginRight: 8,
                    marginBottom: 8,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#202020", fontSize: 14 }}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={{ flex: 4, padding: 20 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  flex: 1,
                  color: "#3C3C3C",
                  fontSize: 16,
                  fontWeight: "700",
                  marginBottom: 15,
                  lineHeight: 20,
                }}
              >
                최근 검색어
              </Text>
              <TouchableOpacity onPress={handleDeleteAll}>
                <Text
                  style={{
                    color: "#848484",
                    fontSize: 14,
                    fontWeight: "500",
                    lineHeight: 20,
                  }}
                >
                  전체삭제
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentSearches}
              renderItem={({ item }: any) => (
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomColor: "#A8A8A8",
                    borderBottomWidth: 1,
                    width: width - 40,
                    height: 35,
                    paddingVertical: 5,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => setSearch(item)}
                  >
                    <Text style={{ color: "#373737" }}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteSearch(item)}>
                    <Close
                      width={10}
                      height={10}
                      color={"#A8A8A8"}
                      strokeWidth={3}
                    />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
