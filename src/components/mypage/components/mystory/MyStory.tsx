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
import Menu from "../../../../assets/img/MyPage/Menu.svg";
import { MyPageParams } from '../../../../pages/MyPage';
import { LoginContext } from '../../../../common/Context';
import RequireLogin from '../common/RequiredLogin';
import { SearchNCategory } from '../common/SearchNCategory';

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
  const [storyList, setStoryList] = useState([] as any);
  const [page, setPage] = useState<number>(1);
  const [max, setMax] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [checkedList, setCheckedList] = useState([] as any);
  const request = new Request();
  const [type, setType] = useState<boolean>(true);
  const [written, setWritten] = useState<any>([]);

  const getStories = async () => {
    const response = await request.get(`/mypage/mypick_story/`, {
      search: search, filter: checkedList, page: page
    });
    setMax(Math.ceil(response.data.data.count / 6));
    setStoryList(response.data.data.results);
  };

  const getWrittenStory = async () => {
    const response = await request.get('/mypage/my_story/', {
      search: search,
      filter: checkedList,
      page: page
    });
    setMax(Math.ceil(response.data.data.count / 6));
    setWritten(response.data.data.results);
  }

  useFocusEffect(useCallback(() => {
    if (isLogin) {
      if (type) getStories();
      else getWrittenStory();
    }
  }, [page, search, checkedList]));


  return (
    <View style={styles().Container}>
      {
        isLogin ?
          <>
            <SearchNCategory
              setType={setType}
              type={type}
              setPage={setPage}
              search={search}
              setSearch={setSearch}
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              label='내 스토리'
            />
            <View style={styles().Story}>
              {(type ? storyList : written).length === 0 ? (
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                  <NothingIcon />
                  <Text style={{ marginTop: 20 }}>해당하는 스토리가 없습니다</Text>
                </View>
              ) : (
                <FlatList
                  data={type ? storyList : written}
                  renderItem={({ item }: any) =>
                    <ItemCard
                      props={item}
                      navigation={navigation}
                    />
                  }
                  onEndReached={() => {
                    if (page < max) setPage(page + 1);
                  }}
                  onEndReachedThreshold={0.3}
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
