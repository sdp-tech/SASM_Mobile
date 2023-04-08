import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { HomeStackParams, item } from '../../pages/Home';
import SearchBar from '../../common/SearchBar';
import ItemCard from './ItemCard';

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
          <>
            <TouchableOpacity onPress={navigation.goBack}><Text>&lt;</Text></TouchableOpacity>
            <SearchBar
              setPage={setPage}
              search={search}
              setSearch={setSearch}
              style={{ width: '90%', backgroundColor: '#F1F1F1' }}
            />
          </>
        }
      ></FlatList>
    </SafeAreaView >
  )
}
