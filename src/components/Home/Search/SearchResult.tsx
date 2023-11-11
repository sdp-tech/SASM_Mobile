import { useEffect, useCallback, useState } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  FlatList,
} from "react-native";
import { TextPretendard as Text } from "../../../common/CustomText";
import { Request } from "../../../common/requests";
import { useFocusEffect } from "@react-navigation/native";
import SearchList from "./SearchList";
import DropDown from "../../../common/DropDown";
import NothingIcon from "../../../assets/img/nothing.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SearchResultProps {
  type: "curation" | "story" | "forest";
  data: any;
}

export default function SearchResult({ type, data }: SearchResultProps) {
  const toggleItems = [
    { label: "최신 순", value: 0, order: "latest" },
    { label: "오래된 순", value: 1, order: "oldest" },
  ];
  const [item, setItem] = useState([] as any);
  const [orderList, setOrderList] = useState(0);
  const [order, setOrder] = useState<string>(toggleItems[orderList].order);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<any>(null);
  const [search, setSearch] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [cardView, setCardView] = useState<boolean>(true);
  const { width, height } = Dimensions.get("screen");
  const request = new Request();

  useEffect(() => {
    onChangeOrder();
  }, [orderList]);

  useFocusEffect(
    useCallback(() => {
      handleSearchToggle();
      getStories();
    }, [page, checkedList, search, order])
  );

  useEffect(() => {
    setPage(1);
  }, [checkedList]);

  const handleSearchToggle = async () => {
    if (search.length === 0) {
      setPage(1);
      setItem([]);
    }
  };

  const getStories = async () => {
    let params = new URLSearchParams();
    for (const category of checkedList) {
      params.append("filter", category);
    }
    const response = await request.get(
      `/stories/story_search/?${params.toString()}`,
      {
        search: search,
        page: page,
        order: order,
      },
      null
    );
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
    if (search.length > 0 && nextPage !== null) {
      setPage(page + 1);
    } else {
      return;
    }
  };

  const onChangeOrder = async () => {
    setOrder(toggleItems[orderList].order);
    setPage(1);
    setItem([]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingTop: 10 }}>
      <>
        <View
          style={{
            flexDirection: "row",
            zIndex: 1,
            alignItems: "center",
            padding: 15,
            backgroundColor: "#F1FCF5",
          }}
        >
          <Text
            style={{
              color: "#666666",
              fontSize: 14,
              fontWeight: "400",
              flex: 1,
            }}
          >
            전체 검색결과 n개
          </Text>
          <View style={{ width: 100, zIndex: 2000 }}>
            <DropDown
              value={orderList}
              setValue={setOrderList}
              isBorder={false}
              items={toggleItems}
            />
          </View>
        </View>
        <View style={{ paddingTop: 10, alignItems: "center", flex: 1 }}>
          {item.length === 0 ? (
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <NothingIcon />
              <Text style={{ marginTop: 20 }}>
                해당하는 큐레이션이 없습니다
              </Text>
            </View>
          ) : (
            <SearchList
              info={item}
              onRefresh={onRefresh}
              refreshing={refreshing}
              onEndReached={onEndReached}
              type={type}
            />
          )}
        </View>
      </>
    </SafeAreaView>
  );
}
