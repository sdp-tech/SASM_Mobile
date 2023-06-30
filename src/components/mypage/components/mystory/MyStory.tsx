import { useState, useEffect, useCallback, useContext } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, Dimensions, Pressable } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import ItemCard from "./ItemCard";
import NothingIcon from "../../../../assets/img/nothing.svg";
import Search from "../../../../assets/img/common/Search.svg";
import { Request } from "../../../../common/requests";
import Category from '../../../../common/Category';
import SearchBar from '../../../../common/SearchBar';
import { useFocusEffect } from '@react-navigation/native';
import Map from "../../../../assets/img/MyPage/Map.svg";
import Menu from "../../../../assets/img/MyPage/Menu.svg";
import { MyPageParams } from '../../../../pages/MyPage';
import { LoginContext } from '../../../../common/Context';
import RequireLogin from '../RequiredLogin';

const styles = (isCategory?: boolean) => StyleSheet.create({
  Container: {
    flex: 1
  },
  Title: {
    height: 50,
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    flexDirection: 'row'
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
  Story: {
    alignItems: 'center',
    flex: 1
  },
});

const MyStory = ({ navigation, route }: MyPageParams) => {
  const { isLogin, setLogin } = useContext(LoginContext);
  const { width, height } = Dimensions.get('window');
  const [info, setInfo] = useState([] as any);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [checkedList, setCheckedList] = useState([] as any);
  const [isCategory, setIsCategory] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const request = new Request();
  const [type, setType] = useState<boolean>(true);
  const [written, setWritten] = useState<any>([]);
  const getStories = async () => {
    let category;
    if (checkedList.length > 0) {
      category = checkedList.toString()
    } else {
      category = null
    }
    const response = await request.get("/mypage/mypick_story/", {
      page: page,
      search: search,
      filter: category
    }, null);
    setInfo(response.data.data.results);
  };

  const getWrittenStory = async () => {
    const response = await request.get('/mypage/my_story/');
    setWritten(response.data.data.results);
  }

  useFocusEffect(useCallback(() => {
    if (isLogin) getStories();
  }, [page, search, checkedList]));

  useEffect(() => {
    if (!type) getWrittenStory();
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
              <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => { setIsSearch(false); setIsCategory(false) }}>
                <Map width={18} height={18} />
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
                    <Text style={{ fontSize: 12 }}>내 스토리</Text>
                  </TouchableOpacity>
                  <Category checkedList={checkedList} setCheckedList={setCheckedList} story={true} />
                </View>
              }
            </View>
            <View style={styles().Story}>
              {(type ? info : written).length === 0 ? (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <NothingIcon />
                  <Text style={{ marginTop: 20 }}>해당하는 스토리가 없습니다</Text>
                </View>
              ) : (
                <FlatList
                  data={type ? info : written}
                  renderItem={({ item }: any) =>
                    <ItemCard
                      props={item}
                      navigation={navigation}
                    />
                  }
                  numColumns={2}
                  style={{ alignContent: 'space-between' }}
                />
              )}
            </View>
          </>
          :
          <RequireLogin index={1} />
      }
    </View>
  );
};

export default MyStory;
