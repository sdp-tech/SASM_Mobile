import { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, Text, View, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import styled from 'styled-components/native';
import SearchBar from '../../common/SearchBar';
import StoryList from './components/StoryList';
import { Request } from '../../common/requests';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { StoryProps } from '../../pages/Story';
import CardView from '../../common/CardView';
import Category from '../../common/Category';

interface ToggleButtonProps {
    onPress?: any;
    text: string;
    color?: string;
}

const ToggleButton = ({ onPress, text, color }: ToggleButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                width: 140,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: color,
                shadowColor: 'rgba(0, 0, 0, 0.25)',
                shadowOpacity: 2,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },

            }}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}

const StoryListPage = ({ navigation, route }: StoryProps) => {
    const [item, setItem] = useState([] as any);
    const [orderList, setOrderList] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [nextPage, setNextPage] = useState<any>(null);
    const [search, setSearch] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [latest, setLatest] = useState<boolean>(false);
    const [checkedList, setCheckedList] = useState([] as any)
    const { width, height } = Dimensions.get('screen');

    const request = new Request();
    const isFocused = useIsFocused();
    useFocusEffect(useCallback(() => {
        getStories();
    }, [page, orderList]));

    useEffect(() => {
        handleSearchToggle();
    }, [search])

    const handleSearchToggle = async () => {
        const response = await request.get('/stories/story_search/', {
            search: search,
            latest: orderList
        }, null);
        setItem(response.data.data.results);
    }

    const getStories = async () => {
        const response = await request.get('/stories/story_search/', {
            page: page,
            search: search,
            latest: orderList
        }, null);
        setItem(response.data.data.results);
        // if (latest || search.length === 0) {
        //     setItem([...response.data.data.results]);
        //     setLatest(false);
        //     setIsSearch(false);
        // } else {
        //     setItem([...item, ...response.data.data.results]);
        // }
        setNextPage(response.data.data.next);
    }

    const onRefresh = async () => {
        if (!refreshing || page !== 1) {
            setRefreshing(true);
            setPage(1);
            setRefreshing(false);
        }
    }

    const onEndReached = async () => {
        if(search.length > 0 || nextPage === null){
            return;
        }
        else {
            setPage(page + 1);
        }
    }

    return (
        <>
            <ScrollView 
                nestedScrollEnabled = {true}
                contentContainerStyle = {{ alignItems: 'center', paddingVertical: 20 }}>
                <SearchBar
                    setPage={setPage}
                    search={search}
                    setSearch={setSearch}
                    style={{ backgroundColor: '#D9D9D9' }}
                    placeholder="장소명 / 내용 / 카테고리로 검색해보세요!"
                />
            { search.length > 0 ? (
                <>
                {/* <Category checkedList={checkedList} setCheckedList={setCheckedList} /> */}
                <StoryList
                    info={item}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    onEndReached={onEndReached}
                    navigation={navigation}
                />
                </>
            ) : (
                <>
                <Text style = {{ alignSelf: 'flex-start', marginLeft: 40, marginVertical: 10 }}>오늘의 인기 스토리</Text>
                <CardView
                    gap={16}
                    offset={24}
                    data={item}
                    pageWidth={width*0.6}
                    height={height*0.4}
                    dot={false}
                    renderItem= {({item}: any) => (
                        <TouchableOpacity style = {{ marginHorizontal: 8 }} onPress = {() => {
                            navigation.navigate('StoryDetail', { id: item.id })
                        }}>
                            <Image 
                                source = {{uri: item.rep_pic}}
                                style = {{ width: width * 0.6, height: width * 0.6 }}
                                resizeMode = 'cover'
                            />
                            <View style = {{ width: width * 0.6, height: 100, backgroundColor: '#FF922E' }}>
                                <Text style = {{ margin: 10 }}>{item.place_name}</Text>
                                <Text style = {{ margin: 10 }} numberOfLines={2} ellipsizeMode={'tail'}>{item.preview}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <Text style = {{ alignSelf: 'flex-start', marginLeft: 40, marginVertical: 10}}>이런 장소의 이야기는 어때요?</Text>
                <CardView
                    gap={16}
                    offset={24}
                    data={item}
                    pageWidth={width*0.6}
                    height={height*0.4}
                    dot={false}
                    renderItem= {({item}: any) => (
                        <TouchableOpacity style = {{ marginHorizontal: 8 }} onPress = {() => {
                            navigation.navigate('StoryDetail', { id: item.id })
                        }}>
                            <Image 
                                source = {{uri: item.rep_pic}}
                                style = {{ width: width * 0.6, height: width * 0.6 }}
                                resizeMode = 'cover'
                            />
                            <View style = {{ width: width * 0.6, height: 100, backgroundColor: '#FF922E' }}>
                                <Text style = {{ margin: 10 }}>{item.place_name}</Text>
                                <Text style = {{ margin: 10 }} numberOfLines={2} ellipsizeMode={'tail'}>{item.preview}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                </>
            )}
            <TouchableOpacity onPress={()=>{navigation.navigate('WriteStory')}}>
                <Text>스토리 작성</Text>
            </TouchableOpacity>
            </ScrollView>
        </>
    )
}

export default StoryListPage;