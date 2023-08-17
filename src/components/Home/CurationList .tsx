import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { TextPretendard as Text } from '../../common/CustomText';
import { FlatList } from 'react-native-gesture-handler';
import { HomeStackParams } from '../../pages/Home';
import SearchBar from '../../common/SearchBar';
import { SearchItemCard } from './CurationItemCard'
import styled from 'styled-components/native';
import Arrow from "../../assets/img/common/Arrow.svg";
import PlusButton from '../../common/PlusButton';
import { useFocusEffect } from '@react-navigation/native';
import { CurationProps } from './CurationHome';
import { Request } from '../../common/requests';

const { width, height } = Dimensions.get('window');
//UseEffect 첫 렌더링 막기
const useDidMountEffect = (func: any, deps: any[]) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps)
}

export default function CurationList({ navigation, route }: StackScreenProps<HomeStackParams, 'List'>): JSX.Element {
  const [max, setMax] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<CurationProps[]>([]);
  const request = new Request();

  const getList = async () => {
    switch (route.params.from) {
      case ('search'):
        const response_search = await request.get('/curations/curation_search/', { search: search });
        if (page === 1) {
          setList(response_search.data.data.results);
          setMax(Math.ceil(response_search.data.data.count / 8));
        } else {
          setList([...list, ...response_search.data.data.results]);
        }
        break;
      case ('admin'):
        const response_admin = await request.get('/curations/admin_curations/', { page: page });
        if (page === 1) {
          setList(response_admin.data.data.results);
          setMax(Math.ceil(response_admin.data.data.count / 4));
        } else {
          setList([...list, ...response_admin.data.data.results]);
        }
        break;
      case ('verify'):
        const response_verifed = await request.get('/curations/verified_user_curations/', { page: page });
        if (page === 1) {
          setList(response_verifed.data.data.results);
          setMax(Math.ceil(response_verifed.data.data.count / 4));
        } else {
          setList([...list, ...response_verifed.data.data.results]);
        }
        break;
    }
  }

  useFocusEffect(useCallback(() => {
    getList();
  }, [page, search]))

  return (
    <SafeAreaView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: Platform.OS == 'android' ? 10 : 0 }}>
        <TouchableOpacity style={{marginLeft: 3}} onPress={navigation.goBack}>
          <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} color={'black'}/>
        </TouchableOpacity>
        <SearchBar
          textAlign='center'
          placeholder='큐레이션 검색'
          search={search}
          setSearch={setSearch}
          setPage={() => { }}
          style={{ width: '80%', backgroundColor: '#F1F1F1' }}
        />
      </View>
      <FlatList
            contentContainerStyle={{ padding: 5 }}
            numColumns={2}
            data={list}
            onEndReached={() => {
              if (page < max) {
                setPage(page + 1);
              }
            }}
            renderItem={({ item }) => <SearchItemCard style={{ width: width / 2 - 15, height: height / 3, margin: 5 }} data={item} />}
            ListHeaderComponent={<>{list.length == 0 && <View style={{ marginLeft: 15 }}><Text style={{ fontSize: 16, fontWeight: '600' }}>큐레이션이 없습니다.</Text></View>}</>}
          />
      <PlusButton
        position='rightbottom'
        onPress={() => { navigation.navigate('Form') }}
      />
    </SafeAreaView >
  )
}
