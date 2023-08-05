import { useEffect, useCallback, useState } from 'react';
import { View, TouchableOpacity, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { Request } from '../../../common/requests';
import { useFocusEffect } from '@react-navigation/native';
import SearchBar from '../../../common/SearchBar';
import SearchList from './SearchList';
import Category from '../../../common/Category';
import ToCardView from '../../../assets/img/Story/ToCardView.svg';
import ToListView from '../../../assets/img/Story/ToListView.svg';
import DropDown from '../../../common/DropDown';
import Arrow from "../../../assets/img/common/Arrow.svg";
import NothingIcon from "../../../assets/img/nothing.svg";
import { StoryProps } from '../../../pages/Story';

const StorySearchPage = ({ navigation }: StoryProps) => {
  const toggleItems = [
    { label: '최신 순', value: 0, order: 'latest' },
    { label: '인기 순', value: 1, order: 'hot' },
  ]
  const [item, setItem] = useState([] as any);
  const [orderList, setOrderList] = useState(0);
  const [order, setOrder] = useState<string>(toggleItems[orderList].order);
  const [page, setPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<any>(null);
  const [search, setSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [cardView, setCardView] = useState<boolean>(true);
  const { width, height } = Dimensions.get('screen');
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

  const handleSearchToggle = async () => {
    if (search.length === 0) {
      setPage(1);
      setItem([]);
    }
  };

  const getStories = async () => {
    let params = new URLSearchParams();
    for (const category of checkedList){
      params.append('filter', category);
    }
    const response = await request.get(`/stories/story_search/?${params.toString()}`,{
      search: search,
      page: page,
      order: order
    }, null)
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
    }
    else {
      return;
    }
  };

  const onChangeOrder = async () => {
    setOrder(toggleItems[orderList].order);
    setPage(1);
    setItem([]);
  }

  const toggleView = () => {
    setCardView(!cardView);
  }

  const recommendData = [
    '슬로우 패션', '비건', 'ESG', '비건 레시피', '비건 레스토랑', '자연', '숲', '한강'
  ]

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{justifyContent: 'center', marginLeft: 10}} onPress={()=>{navigation.goBack();}}>
          <Arrow width={18} height={18} transform={[{rotate: '180deg'}]} />
        </TouchableOpacity>
        <SearchBar
          search={search}
          setSearch={setSearch}
          style={{ backgroundColor: "#F4F4F4", width: 330 }}
          placeholder={"무엇을 검색하시겠습니까"}
        />
      </View>
      {search.length > 0 ? (
        <>
        <View style={{borderColor: '#E3E3E3', borderTopWidth: 1, marginTop: 10}}>
          <Category checkedList={checkedList} setCheckedList={setCheckedList} story={true} />
        </View>
        <View style={{flexDirection: 'row', zIndex: 1, alignItems: 'center', padding: 15, backgroundColor: '#F1FCF5'}}>
          <Text style={{color: '#666666', fontSize: 14, fontWeight: '400', flex: 1}}>전체 검색결과 {count}개</Text>
          <View style={{width: 100, zIndex: 2000}}>
          <DropDown value={orderList} setValue={setOrderList} isBorder={false} items={toggleItems} />
          </View>
          <TouchableOpacity onPress={toggleView}>
            {
              !cardView ? <ToListView width={18} height={18}/> : <ToCardView width={18} height={18}/>
            }
          </TouchableOpacity>
        </View>
        <View style={{paddingTop: 10, alignItems: 'center', flex: 1}}>
        {item.length === 0 ? (
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <NothingIcon />
            <Text style={{ marginTop: 20 }}>해당하는 스토리가 없습니다</Text>
          </View>
        ) : (
          <SearchList
            info={item}
            onRefresh={onRefresh}
            refreshing={refreshing}
            onEndReached={onEndReached}
            navigation={navigation}
            card={cardView}
          />
        )}
        </View>
      </>
      ) : (
        <>
          <View
            style={{
              flex: 1,
              borderColor: "#E3E3E3",
              borderTopWidth: 1,
              marginTop: 10,
              padding: 15
            }}
          >
            <Text style={{color: '#3C3C3C', fontSize: 16, fontWeight: '700', marginBottom: 15}}>추천 검색어</Text>
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
              {recommendData.map((item) => (
                <TouchableOpacity onPress={()=>{setSearch(item)}}
                  style={{height: 30, borderRadius: 16, borderColor: '#67D393', borderWidth: 1, paddingVertical: 4, paddingHorizontal: 16, marginRight: 8, marginBottom: 8}}>
                  <Text style={{color: '#202020', fontSize: 14, lineHeight: 20}}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* <View style={{flex: 4, padding: 20}}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{flex: 1, color: '#3C3C3C', fontSize: 16, fontWeight: '700', marginBottom: 15, lineHeight: 20}}>최근 검색어</Text>
              <TouchableOpacity>
                <Text style={{color: '#848484', fontSize: 14, fontWeight: '500', lineHeight: 20}}>전체삭제</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={[{ title: "비건 레시피" }, { title: "맛있는" }]}
              renderItem={({ item }: any) => (
                <View style={{ flexDirection: "row", borderBottomColor: '#A8A8A8', borderBottomWidth: 1, width: width-40, paddingVertical: 5 }}>
                  <TouchableOpacity style={{flex: 1}}>
                    <Text style={{color: '#373737', lineHeight: 20}}>{item.title}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Text style={{color: '#A8A8A8'}}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View> */}
        </>
      )}
    </SafeAreaView>
  )

}

export default StorySearchPage;