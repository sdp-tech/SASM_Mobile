import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, TouchableOpacity, FlatList } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import ItemCard from './ItemCard';
import { MyPageParams } from '../../../../pages/MyPage';
import { Request } from '../../../../common/requests';

const WrittenStory = ({ navigation, route }: MyPageParams ) => {
    const [item, setItem] = useState([] as any);
  const request = new Request();
  useEffect(() => {
    getStories();
  }, [])

  const getStories = async () => {
    const response = await request.get('/mypage/my_story/', {
      search: '',
      filter: ''
    }, null)
    console.log(response);
    setItem(response.data.data.results);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Text>내가 쓴 스토리</Text>
    </SafeAreaView>
  )
}

export default WrittenStory;