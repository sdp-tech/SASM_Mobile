import { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import SearchBar from '../../common/SearchBar';
import StoryList from './components/StoryList';
import { Request } from '../../common/requests';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { StoryProps } from '../../pages/Story';

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

    const request = new Request();
    const isFocused = useIsFocused();
    useFocusEffect(useCallback(() => {
        handleSearchToggle();
        getStories();
    }, [page, search, orderList]));

    const handleSearchToggle = async () => {
        if (search === null || search === "") {
            setIsSearch(false);
        } else {
            setIsSearch(true);
            setPage(1);
        }
    }

    const getStories = async () => {
        const response = await request.get('/stories/story_search/', {
            page: page,
            search: search,
            latest: orderList
        }, null);

        if (latest || page === 1) {
            setItem([...response.data.data.results]);
            setLatest(false);
            setIsSearch(false);
        } else {
            setItem([...item, ...response.data.data.results]);
        }
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
        if(isSearch || nextPage === null){
            return;
        }
        else {
            setPage(page + 1);
        }
    }

    return (
        <>
            <SafeAreaView style = {{
                flex: 1,
                alignItems: 'center',
            }}>
                <Text style = {{
                    fontSize: 36,
                    fontWeight: '700',
                    lineHeight: 36,
                    marginTop: 23,
                     marginBottom: 8
                }}>Story</Text>
                <Text style = {{
                    fontSize: 12,
                    fontWeight: '500',
                    lineHeight: 14,
                    marginBottom: 20
                }}>
                    공간에 대한 깊은 이야기
                </Text>
                <SearchBar setSearch = {setSearch} />
                <View style = {{
                    backgroundColor: '#EEEEEE',
                    borderRadius: 12,
                    width: 312,
                    height: 32,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {!orderList ?
                        <>
                        <ToggleButton
                            text = '최신 순'
                            onPress={() => {
                                setOrderList(!orderList);
                                setPage(1);
                                setLatest(true);
                            }} />
                        <ToggleButton 
                            color = '#03B961'
                            text = '오래된 순' />
                        </>
                    :
                        <>
                        <ToggleButton
                            color = '#01A0FC'
                            text = '최신 순' />
                        <ToggleButton 
                            text = '오래된 순'
                            onPress={() => {
                                setOrderList(!orderList);
                                setPage(1);
                                setLatest(true);
                            }} />
                    </>
                }
            </View>
            <StoryList
                info={item}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onEndReached={onEndReached}
                navigation={navigation}
            />
        </SafeAreaView>
                        </>
                    }
                </View>
                <StoryList 
                    info = {item}
                    onRefresh = {onRefresh}
                    refreshing = {refreshing}
                    onEndReached = {onEndReached}
                    navigation = {navigation}
                    page = {page}
                />
            </SafeAreaView>
        </>
    )
}

export default StoryListPage;