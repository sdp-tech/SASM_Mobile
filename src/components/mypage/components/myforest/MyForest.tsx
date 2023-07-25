import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import { Request } from '../../../../common/requests';
import { LoginContext } from '../../../../common/Context';
import RequireLogin from '../common/RequiredLogin';
import { TextPretendard as Text } from '../../../../common/CustomText';
import MyForestItemCard, { MyForestItemCardProps } from './MyForestItemCard';
import { FlatList } from 'react-native-gesture-handler';
import { SearchNoCategory } from '../common/SearchNCategory';
import NothingIcon from "../../../../assets/img/nothing.svg";

export default function MyForest() {
  const { isLogin, setLogin } = useContext(LoginContext);
  const [forestList, setForestList] = useState<MyForestItemCardProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [max, setMax] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [type, setType] = useState<boolean>(true);
  const request = new Request();

  const getForest = async () => {
    const response = await request.get('/mypage/mypick_forest/', { page: page, search: search, category_filter: [''] });
    setMax(Math.ceil(response.data.data.count / 4))
    if (page == 1) setForestList(response.data.data.results);
    else setForestList([...forestList, ...response.data.data.results]);
  }
  const getWrittenForest = async () => {
    const response = await request.get('/mypage/my_forest/', { page: page, search: search, category_filter: ['']});
    setMax(Math.ceil(response.data.data.count / 4))
    if (page == 1) setForestList(response.data.data.results);
    else setForestList([...forestList, ...response.data.data.results]);
  }

  useFocusEffect(useCallback(() => {
    if (isLogin) {
      if (type) getForest();
      else getWrittenForest();
    }
  }, [page, type, search]))

  return (
    <View style={{ flex: 1 }}>
      <SearchNoCategory
        setSearch={setSearch}
        search={search}
        setType={setType}
        type={type}
        label='내 포레스트'
      />
      {
        isLogin ?
          forestList.length == 0 ?
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <NothingIcon />
              <Text style={{ marginTop: 20 }}>해당하는 포레스트가 없습니다</Text>
            </View>
            :
            <FlatList
              data={forestList}
              contentContainerStyle={{ paddingHorizontal: 20, flex: 1 }}
              renderItem={({ item }: { item: MyForestItemCardProps }) => (
                <MyForestItemCard props={item} />
              )}
              onEndReached={() => {
                if (page < max) {
                  setPage(page + 1);
                }
              }}
              onEndReachedThreshold={0.3}
              style={{ alignContent: 'space-between' }}
            />
          :
          <RequireLogin index={3} />
      }
    </View>
  )
}
