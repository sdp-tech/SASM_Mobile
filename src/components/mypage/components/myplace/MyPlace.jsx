import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  Button,
} from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import styled from "styled-components/native";
import Loading from "../../../../common/Loading";
import ItemCard from "./ItemCard";
import nothingIcon from "../../../../assets/img/nothing.svg";
import { Request } from "../../../../common/requests";
import ChangeMode from "../../../../assets/img/Mypick/ChangeMode.svg";
import Category, {
  CATEGORY_LIST,
  MatchCategory,
} from "../../../../common/Category";
import { useNavigation } from "@react-navigation/native";
import Pagination from "../../../../common/Pagination";
import { TabView, SceneMap } from "react-native-tab-view";

const styles = StyleSheet.create({
  Container: {
    height: "100%",
    alignItems: "center",
    //backgroundColor:'red'
  },
  Myinfo: {
    //backgroundColor:'orange',
    width: "100%",
    flex: 3,
    borderColor: "lightgray",
    borderWidth: 1,
  },
  Category: {
    //backgroundColor:'yellow',
    width: "100%",
    flex: 1,
    borderColor: "lightgray",
    borderWidth: 1,
    flexDirection: "row",
  },
  Listbox: {
    width: "100%",
    flex: 15,
    //backgroundColor:'green',
    borderColor: "lightgray",
    borderWidth: 1,
  },
  Title: {
    flex: 1,
    //backgroundColor:'blue',
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  Searchbox: {
    //backgroundColor:'puple',
    flex: 1,
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  Place: {
    //backgroundColor:'black',
    flex: 12,
    borderColor: "lightgray",
    borderWidth: 1,
    alignItems: "center",
  },
  CardSection: {
    flexDirection: "row",
    //backgroundColor:'blue',
    width: "100%",
    alignItems: "space-between",
    justifyContent: "center",
  },
});

const MyPlace = () => {
  const [info, setInfo] = useState([]);
  // const [tab, setTab] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [checkedList, setCheckedList] = useState("");
  const offset = (page - 1) * limit;

  const navigation = useNavigation();
  const request = new Request();
  // onChange함수를 사용하여 이벤트 감지, 필요한 값 받아오기

  const onCheckedElement = (checked, item) => {
    if (checked) {
      setCheckedList([...checkedList, item]);
    } else if (!checked) {
      setCheckedList(checkedList.filter((el) => el !== item));
    }
  };
  const pageMyplace = async () => {
    let newPage;
    if (page == 1) {
      newPage = null;
    } else {
      newPage = page;
    }

    setLoading(true);

    const response = await request.get(
      "/users/like_place/",
      {
        page: newPage,
        filter: checkedList,
      },
      null
    );
    console.log("my place", response);
    //setPageCount(response.data.data.count);
    setInfo(response.data.data.results);
    setLoading(false);
  };

  // 초기에 좋아요 목록 불러오기
  useEffect(() => {
    pageMyplace();
  }, [page, checkedList]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* <SafeAreaView> */}
            <View style={styles.Container}>
              <View style={styles.Myinfo}>
                <Text>Myinfo</Text>
              </View>
              {/* 탭바 구현이 안되어서 일단 버튼으로 구현해 놓음
              <View style={styles.Category}>
                <View style={{ flex: 1 }}>
                  <Button
                    onPress={() => navigation.navigate("MyPlace")}
                    title="장소"
                    color="black"
                  ></Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    onPress={() => navigation.navigate("MyStory")}
                    title="스토리"
                    color="black"
                  ></Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    onPress={() => navigation.navigate("큐레이션")}
                    title="큐레이션"
                    color="black"
                  ></Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    onPress={() => navigation.navigate("정보글")}
                    title="정보글"
                    color="black"
                  ></Button>
                </View>
              </View> */}
              <View style={styles.Listbox}>
                <View style={styles.Title}>
                  <View
                    style={{
                      flex: 2,
                      justifyContent: "center",
                      marginLeft: 20,
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      플레이스 리스트
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      onPress={() => navigation.navigate("맵")}
                      title="전체보기 >"
                      color="black"
                    ></Button>
                  </View>
                </View>
                <View style={styles.Searchbox}>
                  <View
                    style={{
                      flex: 2,
                      justifyContent: "center",
                      marginLeft: 20,
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      마이 플레이스
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      onPress={() => navigation.navigate("맵")}
                      title="검색 >"
                    ></Button>
                  </View>
                </View>
                <View style={styles.Place}>
                  {info.length === 0 ? (
                    <View style={styles.NothingSearched}>
                      <Image
                        src={nothingIcon}
                        style={{ marginTop: "50%", paddingTop: "50%" }}
                      />
                      <Text>해당하는 장소가 없습니다</Text>
                    </View>
                  ) : (
                    <FlatList
                      //ListHeaderComponent={}
                      data={info}
                      renderItem={({ item }) => (
                        <ItemCard
                          place_id={item.id}
                          rep_pic={item.rep_pic}
                          place_name={item.place_name}
                          place_like={item.place_like}
                          category={item.category}
                        />
                      )}
                      keyExtractor={(item, index) => index}
                      numColumns={3}
                      style={{ alignContent: "space-between" }}
                    />
                  )}
                </View>
              </View>
            </View>
          {/* </SafeAreaView> */}
        </>
      )}
    </>
  );
};

export default MyPlace;
