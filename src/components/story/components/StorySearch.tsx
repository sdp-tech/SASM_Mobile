import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import SearchList from './SearchList';
import Category from '../../../common/Category';
import ToCardView from '../../../assets/img/Story/ToCardView.svg';
import ToListView from '../../../assets/img/Story/ToListView.svg';
import DropDown from '../../../common/DropDown';

interface StorySearch {
  item: any;
  count: number;
  order: any;
  checkedList: any;
  setCheckedList: any;
  onEndReached: () => void;
  refreshing: boolean;
  onRefresh: () => void;
  value: number;
  setValue: any;
  navigation: any;
}

const StorySearch = ({ item, count, order, checkedList, setCheckedList, onEndReached, refreshing, onRefresh, value, setValue, navigation }: StorySearch) => {
  const [cardView, setCardView] = useState<boolean>(true);
  const { width, height } = Dimensions.get('screen');
  const toggleView = () => {
    setCardView(!cardView);
  }

  const toggleItems = [
    { label: '조회수 순', value: 1 },
    { label: '좋아요 순', value: 2 },
    { label: '최신 순', value: 3 },
  ]

  return (
    <View style={{alignItems: 'center', paddingHorizontal: 30, paddingTop: 20, flex: 1}}>
      <View style={{flexDirection: 'row', zIndex: 1, alignItems: 'center'}}>
        <Text style={{fontSize: 12, fontWeight: '400', flex: 1}}>전체 검색결과 {count}개</Text>
        <View style={{width: 100, zIndex: 2000}}>
          <DropDown value={value} setValue={setValue} isBorder={false} items={order} />
        </View>
        <TouchableOpacity onPress={toggleView}>
          {
          cardView ? <ToListView width={13} height={13}/> : <ToCardView width={13} height={13}/>
        }
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: 'white', width: width, marginVertical: 20, shadowOffset: { width: 0, height: 1 }, shadowColor: 'black', shadowOpacity: 0.1}}>
        <Category checkedList={checkedList} setCheckedList={setCheckedList} story={true} />
      </View>
      <SearchList
        info={item}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        navigation={navigation}
        card={cardView}
      />
    </View>
  )

}

export default StorySearch;