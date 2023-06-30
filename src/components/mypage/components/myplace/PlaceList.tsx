import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, TouchableOpacity, FlatList } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import ItemCard from './ItemCard';
import { MyPageParams } from '../../../../pages/MyPage';
import { Request } from '../../../../common/requests';

const PlaceList = ({ navigation, route }: MyPageParams ) => {
  const [item, setItem] = useState([] as any);
  const request = new Request();
  // useEffect(() => {
  //   getPlaceList();
  // }, [])

  // const getPlaceList = async () => {
    
  // }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Text>플레이스리스트</Text>
    </SafeAreaView>
  )
}

export default PlaceList;