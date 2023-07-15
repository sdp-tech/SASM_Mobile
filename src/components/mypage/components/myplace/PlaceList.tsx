import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, TouchableOpacity, FlatList, Dimensions, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import { MyPageProps } from '../../../../pages/MyPage';
import { Request } from '../../../../common/requests';
import { StackScreenProps } from '@react-navigation/stack';
import { placeDataProps } from '../../../map/Map';
import styled from 'styled-components/native';
import Arrow from '../../../../assets/img/common/Arrow.svg';

const { width, height } = Dimensions.get('window');

const ItemCard = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  padding-horizontal: 15px;
  border-color:rgba(112, 112, 112, 0.15);
  border-bottom-width: 1px;
`
const TextBox = styled.View`
  display: flex;
  height: 50px;
  width: ${width - 95}px;
  justify-content: space-around;
`
const FilterButton = styled.TouchableOpacity`
  width: 60px;
  border: 1px black solid;
  padding: 5px;
  border-radius: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`

const PlaceList = ({ navigation, route }: StackScreenProps<MyPageProps,'place_list'>) => {
  
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [placeList, setPlaceList] = useState<placeDataProps[]>([]);
  const [storyListModal, setStoryListModal] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<any>();
  const request = new Request();
  const getPlaceList = async () => {
    setLoading(true);
    const response_place_list = await request.get('/places/place_search/', {
      left: 37.5,
      right: 127.5,
      search: search,
      filter: checkedList,
      page: page,
    });
    if (page == 1) {
      setPlaceList(response_place_list.data.data.results);
    }
    else {
      setPlaceList([...placeList, ...response_place_list.data.data.results]);
    }
    setTotal(response_place_list.data.data.count);
    setLoading(false);
  }

  useEffect(() => {
    getPlaceList();
  }, [page, search, checkedList])

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{ position: 'relative', marginBottom: 30 }}>
        <Text style={TextStyles.header}>플레이스 리스트</Text>
        <TouchableOpacity style={{ left: 10, marginBottom: 30, position: 'absolute' }} onPress={() => { navigation.goBack() }}>
          <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} />
        </TouchableOpacity>
      </View>
      <FlatList
          data={placeList}
          renderItem={({ item }) =>
            <ItemCard>
              <Image source={{ uri: item.rep_pic }} style={{ height: 50, width: 50, marginRight: 15, borderRadius: 3 }} />
              <TextBox>
                <Text style={TextStyles.place_name}>{item.place_name}</Text>
                <Text style={TextStyles.address}>{item.address}</Text>
              </TextBox>
            </ItemCard>
          }
          onEndReached={() => {
            if (page < Math.ceil(total / 20)) {
              setPage(page + 1)
            }
          }}
          ListFooterComponent={<>{loading && <ActivityIndicator />}</>}
        />
    </SafeAreaView>
  )
}

export default PlaceList;

const TextStyles = StyleSheet.create({
  place_name: {
    fontSize: 16,
    fontWeight: '600',
  },
  address: {
    color: '#7B7B7B',
    fontSize: 10
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
  },
  detail: {
    fontSize: 8,
  },
  header: {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.6,
    fontWeight: '700',
    alignSelf: 'center'
  },
})