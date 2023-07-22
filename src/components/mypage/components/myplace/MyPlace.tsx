import { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import ItemCard from "./ItemCard";
import NothingIcon from "../../../../assets/img/nothing.svg";
import { Request } from "../../../../common/requests";
import Category from "../../../../common/Category";
import SearchBar from "../../../../common/SearchBar";
import Search from "../../../../assets/img/common/Search.svg";
import Menu from "../../../../assets/img/MyPage/Menu.svg";
import Arrow from "../../../../assets/img/common/Arrow.svg";
import { MyPageParams } from "../../../../pages/MyPage";
import { useFocusEffect } from "@react-navigation/native";
import { LoginContext } from "../../../../common/Context";
import RequireLogin from "../RequiredLogin";

const styles = (isCategory?: boolean) => StyleSheet.create({
  Container: {
    flex: 1
  },
  Title: {
    height: 50,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  Searchbox: {
    height: 50,
    justifyContent: isCategory ? "flex-start" : "flex-end",
    paddingRight: 15,
    alignItems: "center",
    flexDirection: 'row',
    //flex: 1,
    zIndex: 1
  },
  Place: {
    alignItems: 'center',
    flex: 1
  },
});

export interface MyPlaceItemCard {
  id: number;
  place_name: string;
  category: string;
  rep_pic: string;
  address: string;
}

const MyPlace = ({ navigation }: MyPageParams) => {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [info, setInfo] = useState<MyPlaceItemCard[]>([]);
  const [page, setPage] = useState(1);
  const [checkedList, setCheckedList] = useState([] as any);
  const [search, setSearch] = useState<string>("");
  const [isCategory, setIsCategory] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const request = new Request();
  const [type, setType] = useState<boolean>(true);
  const [written, setWritten] = useState<MyPlaceItemCard[]>([]);
  const getPlaces = async () => {
    let params = new URLSearchParams();
    for (const category of checkedList){
      params.append('filter', category);
    }
    params.append('search', search);
    const response = await request.get(`/mypage/myplace_search/?${params.toString()}`,null, null)
    setInfo(response.data.data.results);
  };

  const getWrittenReview = async () => {
    const response = await request.get('/mypage/my_reviewed_place/');
    setWritten(response.data.data.results);
  }

  useFocusEffect(useCallback(() => {
    if (isLogin) getPlaces();
  }, [page, search, checkedList, isLogin]));

  useEffect(() => {
    if (!type) getWrittenReview();
  }, [type])

  return (
    <View style={styles().Container}>
      {
        isLogin ?
          <>
            <View style={styles(isCategory).Searchbox}>
              {isSearch &&
                <SearchBar
                  setPage={setPage}
                  search={search}
                  setSearch={setSearch}
                  style={{ backgroundColor: "#F4F4F4", borderRadius: 10, height: 35, width: 280, position: "absolute", right: 90, zIndex: 1 }}
                  placeholder="내용 입력 전"
                  placeholderTextColor={"#848484"}
                />
              }
              <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { setIsSearch(!isSearch); setIsCategory(false); }}>
                <Search width={18} height={18} />
              </TouchableOpacity>
              {!isCategory &&
                <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { setIsSearch(false); setIsCategory(!isCategory) }}>
                  <Menu width={18} height={18} />
                </TouchableOpacity>
              }
              {isCategory &&
                <View style={{ flexDirection: "row", marginLeft: 10, flex: 1, alignItems: 'center' }}>
                  <TouchableOpacity style={{ borderRadius: 12, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginRight: 5, paddingHorizontal: 5, height: 25 }}>
                    <Text style={{ fontSize: 12 }}>편집</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: type ? '#FFFFFF' : '#D7D7D7', borderRadius: 20, borderColor: "#D7D7D7", borderWidth: 0.25, justifyContent: "center", alignItems: "center", marginRight: 5, paddingHorizontal: 5, height: 25 }}
                    onPress={() => { setType(!type) }}>
                    <Text style={{ fontSize: 12 }}>내 리뷰</Text>
                  </TouchableOpacity>
                  <Category checkedList={checkedList} setCheckedList={setCheckedList} story={true} />
                </View>
              }
            </View>
            <View style={styles().Place}>
              {(type ? info : written).length === 0 ? (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <NothingIcon />
                  <Text style={{ marginTop: 20 }}>해당하는 장소가 없습니다</Text>
                </View>
              ) : (
                <FlatList
                  data={type ? info : written}
                  renderItem={({ item }: any) => (
                    <ItemCard
                      data={item}
                    />
                  )}
                  numColumns={3}
                  style={{ alignContent: 'space-between' }}
                />
              )}
            </View>
          </>
          :
          <RequireLogin index={0} />
      }
    </View>
  );
};

export default MyPlace;
