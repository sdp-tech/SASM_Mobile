import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { HomeStackParams } from '../../pages/Home';
import SearchBar from '../../common/SearchBar';
import { SearchItemCard } from './ItemCard';
import styled from 'styled-components/native';
import Arrow from "../../assets/img/common/Arrow.svg";
import PlusButton from '../../common/PlusButton';
import { useFocusEffect } from '@react-navigation/native';
import { CurationPlusButton, CurationProps } from './CurationHome';
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
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<CurationProps[]>([]);
  const request = new Request();

  const searchCuration = async () => {
    if (search != '' || route.params.data.length==0) {
      const response_search = await request.get('/curations/curation_search/', { search: search });
      setList(response_search.data.data);
    }
    else {
      setList(route.params.data);
    }
  }

  useFocusEffect(useCallback(() => {
    setList(route.params.data);
  }, []))

  useDidMountEffect(searchCuration, [search])
  return (
    <SafeAreaView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      <TouchableOpacity onPress={navigation.goBack} style={{ position: 'absolute', top: 55 }}>
        <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} />
      </TouchableOpacity>
      <SearchBar
        textAlign='center'
        placeholder='큐레이션 검색'
        search={search}
        setSearch={setSearch}
        setPage={() => { }}
        style={{ width: '80%', backgroundColor: '#F1F1F1', marginBottom: 20 }}
      ></SearchBar>
      <FlatList
        numColumns={2}
        data={list}
        renderItem={({ item }) => <SearchItemCard style={{ width: width / 2 - 10, height: height / 3, margin: 5 }} data={item} />}
        ListHeaderComponent={<>{list.length == 0 && <View style={{ marginLeft: 15 }}><Text style={{ fontSize: 16, fontWeight: '600' }}>큐레이션이 없습니다.</Text></View>}</>}
      />
      <CurationPlusButton />
    </SafeAreaView >
  )
}
