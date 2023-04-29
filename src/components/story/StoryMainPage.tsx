import { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, Text, View, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import SearchBar from '../../common/SearchBar';
import StoryList from './components/StoryList';
import { Request } from '../../common/requests';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { StoryProps } from '../../pages/Story';
import CardView from '../../common/CardView';
import MainCard from './components/MainCard';
import SwipeList from './components/SwipeList';
import ToListView from '../../assets/img/Story/ToListView.svg';
import DropDown from '../../common/DropDown';
import PlusButton from '../../common/PlusButton';

const StoryMainPage = ({ navigation, route}: StoryProps) => {
  const [item, setItem] = useState([] as any);
  const [orderList, setOrderList] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<any>(null);
  const [search, setSearch] = useState<string>('');
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [latest, setLatest] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState([] as any);
  const [pressed, setPressed] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const { width, height } = Dimensions.get('screen');

  const request = new Request();

  useFocusEffect(useCallback(() => {
    getStories();
  }, [page, orderList]));

  useEffect(() => {
    handleSearchToggle();
  }, [search])

  const handleSearchToggle = async () => {
    const response = await request.get('/stories/story_search/', {
      page: page,
      search: search,
      latest: orderList
    }, null);
    setItem(response.data.data.results);
    setCount(response.data.data.count);
  }

  const getStories = async () => {
    const response = await request.get('/stories/story_search/', {
      page: page,
      search: null,
      latest: orderList
    }, null);
    setItem([...response.data.data.results]);
    setNextPage(response.data.data.next);
  }
  const onRefresh = async () => {
    if (!refreshing || page !== 1) {
        setRefreshing(true);
        setPage(1);
        setRefreshing(false);
    }
}

  const CATEGORY_LIST = [
    { id: 0, data: "식당 및 카페", name: "식당·카페" },
    { id: 1, data: "전시 및 체험공간", name: "전시·체험" },
    { id: 2, data: "제로웨이스트 샵", name: "제로웨이스트" },
    { id: 3, data: "도시 재생 및 친환경 건축물", name: "건축물" },
    { id: 4, data: "복합 문화 공간", name: "복합문화" },
    { id: 5, data: "녹색 공간", name: "녹색공간" },
  ];

  const [selected, setSelected] = useState({ label: '조회수 순', value: 1 });
  const toggleItems = [
    { label: '조회수 순', value: 1 },
    { label: '좋아요 순', value: 2 },
    { label: '최신 순', value: 3 },
  ]

  return (
    <SafeAreaView style={{flex: 1}}>
      <SearchBar
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        style={{ backgroundColor: '#D9D9D9', marginTop: 20 }}
        placeholder="장소명 / 내용 / 카테고리로 검색해보세요!"
      />
        { search.length > 0 ? (
          <View style={{alignItems: 'center', paddingHorizontal: 30, paddingTop: 10, flex: 1}}>
            {/* <Category checkedList={checkedList} setCheckedList={setCheckedList} /> */}
            <CardView 
              gap={0} offset={0} data={CATEGORY_LIST} pageWidth={100} height={50} dot={false}
              renderItem={({item}: any) => (
                <TouchableOpacity style={{alignItems: 'center', marginHorizontal: 6, marginVertical: 6}} onPress = {() => {setPressed(!pressed)}}>
                  <Text style={{alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4, overflow: 'hidden', fontSize: 12, fontWeight: '400', lineHeight: 14,
                    backgroundColor: pressed ? '#3B3B3B' : '#F2F2F2', color: pressed ? 'white' : '#ADADAD', borderColor: '#B1B1B1', borderWidth: 1}}>
                    {item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 12, fontWeight: '600', flex: 3}}>검색결과 {count}개</Text>
              <DropDown data={toggleItems} onSelect={setSelected}/>
            </View>
            <StoryList
              info={item}
              onRefresh={onRefresh}
              refreshing={refreshing}
              //onEndReached={onEndReached}
              navigation={navigation}
              search={true}
            />
          </View>
        ) : (
          <ScrollView 
          nestedScrollEnabled = {true}
          contentContainerStyle = {{alignItems: 'center', padding: 30}}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={textStyles.title}>오늘의 인기 스토리</Text>
              <TouchableOpacity style={{marginLeft: 180, marginTop: 5}} onPress={() => {navigation.replace('StoryList')}}><ToListView/></TouchableOpacity>
            </View>
            <Text style={textStyles.subtitle}>가장 많은 사람들의 관심을 받은 스토리가 궁금하다면?</Text>
            <SwipeList item={item} navigation={navigation} />
            <Text style = {textStyles.title}>이런 스토리는 어때요?</Text>
            <Text style={textStyles.subtitle}>에디터가 직접 선정한 알찬 스토리를 둘러보세요.</Text>
            <CardView 
              gap={0} offset={0} data={CATEGORY_LIST} pageWidth={width} height={20} dot={false}
              renderItem={({item}: any) => (
              <TouchableOpacity style={{marginHorizontal: 6, borderBottomColor: pressed ? '#444444' : '#F2F2F2', borderBottomWidth: 1}} onPress = {() => {setPressed(!pressed)}}>
                <Text style={{paddingHorizontal: 16, overflow: 'hidden', fontSize: 12, fontWeight: '400', lineHeight: 14, color: '#444444'}}>
                  {item.name}</Text>
              </TouchableOpacity>
              )}
            />
            <View style={{marginTop: 20}}>
              <SwipeList item={item} navigation={navigation} />
            </View>
          </View>
          </ScrollView>
        )}
        { search.length > 0 ? (
                <></>
            ) : (
                <PlusButton onPress={() => { console.log('clicked') }} />
                // <TouchableOpacity onPress={()=>{navigation.navigate('WriteStory')}}
                //     style={{position: 'absolute', marginTop: height*0.8, marginLeft: width*0.85, width: 45, height: 45, borderRadius: 60, alignItems: 'center', justifyContent: 'center', backgroundColor: '#75E59B'}}>
                //     <Add />
                // </TouchableOpacity>
            )}
    </SafeAreaView>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '400',
    marginTop: 2,
    marginBottom: 15,
  },
})

export default StoryMainPage;