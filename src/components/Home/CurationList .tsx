import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { HomeStackParams, item } from '../../pages/Home';
import SearchBar from '../../common/SearchBar';
import ItemCard from './ItemCard';
import styled from 'styled-components/native';
import GoBack from "../../assets/img/common/GoBack.svg";
import PlusButton from '../../common/PlusButton';

const Header = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  margin-bottom: 10px;
`

export default function CurationList({ navigation, route }: StackScreenProps<HomeStackParams, 'List'>): JSX.Element {
  const { width, height } = Dimensions.get('window');
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  return (
    <SafeAreaView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      <FlatList
        numColumns={2}
        data={item}
        renderItem={({ item }) => <ItemCard style={{width: width / 2 - 10, height:height / 3, margin: 5}} data={item} onPress={() => { navigation.navigate('Detail', { id: item.id }) }} />}
        ListHeaderComponent={
          <Header>
            <TouchableOpacity onPress={navigation.goBack}>
              <GoBack/>
            </TouchableOpacity>
            <SearchBar
              setPage={setPage}
              search={search}
              setSearch={setSearch}
              style={{ width: '85%', backgroundColor:'#F1F1F1'}}
            />
          </Header>
        }
      />
      <PlusButton onPress={()=>{console.log('');}}/>
    </SafeAreaView >
  )
}
