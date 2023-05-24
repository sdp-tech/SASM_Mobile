import { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, Image,FlatList, ScrollView, Dimensions, Button } from 'react-native';
import styled from 'styled-components/native';
import Loading from "../../../../common/Loading";
import ItemCard from "./ItemCard";
import NothingIcon from "../../../../assets/img/nothing.svg";
import Arrow from "../../../../assets/img/common/Arrow.svg";
import Search from "../../../../assets/img/common/Search.svg";
import { Request } from "../../../../common/requests";
import Category from '../../../../common/Category';
import SearchBar from '../../../../common/SearchBar';
import { useNavigation } from '@react-navigation/native';
import Map from "../../../../assets/img/MyPage/Map.svg";
import Menu from "../../../../assets/img/MyPage/Menu.svg";

const styles = (isCategory?: boolean) => StyleSheet.create({
  Container:{
    height:'100%',
  },
  Category:{
    width:'100%',
    flex:1,
    borderColor:'lightgray',
    borderWidth:1,
    flexDirection: 'row'
  },
  Title:{
    height: 50,
    borderTopColor:'lightgray',
    borderTopWidth:1,
    flexDirection: 'row'
  },
  Searchbox:{
    height: 50,
    justifyContent: isCategory ? "flex-start" : "flex-end",
    paddingRight: 15,
    alignItems: "center",
    flexDirection: 'row'
  },
  Place:{
    alignItems: 'center',
    flex: 1
  },
});



const MyStory = () => {
  const [info, setInfo] = useState([]);
  // const [tab, setTab] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState(1);
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkedList, setCheckedList] = useState([] as any);
  const [isCategory, setIsCategory] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const offset = (page - 1) * limit;
  const request = new Request();
  const navigation = useNavigation();

  const getStories = async () => {
    let newPage;
    if (page == 1) {
      newPage = null;
    } else {
      newPage = page;
    }

    setLoading(true);

    const response = await request.get("/users/like_story/", {
      page: newPage,
      filter: checkedList
    }, null);
    setInfo(response.data.data.results);
    setLoading(false);
  };

  useEffect(() => {
    console.log(isCategory)
  })
  useEffect(() => {
    getStories();
  }, [page, checkedList]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <View style={styles().Container}>
              <View style={styles().Title}>
                <View style={{flex:2, justifyContent: "center", marginLeft:20}}><Text style={{fontSize:14,fontWeight:'400'}}>스토리 리스트</Text></View>
                <View style={{flex:1, justifyContent: "center", alignItems: 'flex-end', marginRight: 10}}>
                  <TouchableOpacity style={{flexDirection: "row", alignItems: 'center'}}>
                    <Text style={{fontSize: 10, fontWeight: '400'}}>모두 보기 </Text>
                    <Arrow width={15} height={15}/>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{height: 4, backgroundColor: "#67D393", opacity: 0.1}} />
              <View style={styles(isCategory).Searchbox}>
                { isSearch &&
                <SearchBar
                  setPage={setPage}
                  search={search}
                  setSearch={setSearch}
                  style={{ backgroundColor: "#F4F4F4", borderRadius: 10, height: 35, width: 280, position: "absolute", right: 90, zIndex: 1 }}
                  placeholder="내용 입력 전"
                  placeholderTextColor={"#848484"}
                />}
                { isCategory &&
                <ScrollView nestedScrollEnabled horizontal style={{ position: "absolute", left: 80, zIndex: 1, flexDirection: "row", backgroundColor: "white"}}>
                  <TouchableOpacity style={{borderRadius: 20, borderColor: "#67D393", borderWidth: 1, justifyContent: "center", alignItems: "center", marginRight: 5, paddingHorizontal: 5}}>
                    <Text style={{fontSize: 12}}>내가 쓴 스토리</Text>
                  </TouchableOpacity>
                  <Category checkedList={checkedList} setCheckedList={setCheckedList} story={true} />
                </ScrollView>
                }
                {/* <View style={{justifyContent: isCategory ? "flex-start" : "flex-end", flexDirection: "row"}}> */}
                <TouchableOpacity style={{marginHorizontal: 10}} onPress={() => {setIsSearch(!isSearch); setIsCategory(false);}}>
                  <Search width={18} height={18}/>
                </TouchableOpacity>
                <TouchableOpacity style={{marginHorizontal: 10}} onPress={() => {setIsSearch(false); setIsCategory(false)}}>
                  <Map width={18} height={18}/>
                </TouchableOpacity>
                <TouchableOpacity style={{marginHorizontal: 10}} onPress={() => {setIsSearch(false); setIsCategory(!isCategory)}}>
                  <Menu width={18} height={18}/>
                </TouchableOpacity>
                {/* </View> */}
              </View>
              <View style={styles().Place}>
              {info.length === 0 ? (
                  <View>
                    <NothingIcon />
                    <Text>해당하는 스토리가 없습니다</Text>
                  </View>
                ) : (
                <FlatList
                  data ={info}
                  renderItem ={({item}: any) => (
                    <ItemCard
                      props={item}
                      navigation={navigation}
                    />
                  )}
                  keyExtractor = {({item, index}: any) => index}
                  numColumns={2}
                  style={{alignContent:'space-between'}}
                  />
                )}
              </View>
          </View>
        </>
      )}
    </>
  );
};

export default MyStory;
