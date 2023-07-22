import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import { Request } from '../../../../common/requests';
import { LoginContext } from '../../../../common/Context';
import RequireLogin from '../RequiredLogin';
import { TextPretendard as Text } from '../../../../common/CustomText';
import MyForestItemCard, {MyForestItemCardProps} from './MyForestItemCard';

export default function MyForest() {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [likeList, setLikeList] = useState<MyForestItemCardProps[]>([]);
  const request = new Request();
  const getForest = async () => {
    const response = await request.get('/mypage/mypick_forest/');
    setLikeList(response.data.data.results);
  }
  useFocusEffect(useCallback(() => {
    getForest();
  }, []))
  return (
    <View style={{ flex: 1 }}>
      {
        isLogin ?
          <View style={{paddingHorizontal: 20}}>
            {
              likeList.map(data => <MyForestItemCard props={data}/>)
            }
          </View>
          : <RequireLogin index={3} />
      }
    </View>
  )
}
