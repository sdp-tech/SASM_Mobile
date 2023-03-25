import { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import SearchBar from '../../common/SearchBar';
import Pagination from '../../common/Pagination';
import Loading from "../../common/Loading";
import StoryList from './components/StoryList';
import { Request } from '../../common/requests';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StoryProps } from '../../pages/Story';

interface ToggleButtonProps {
    onPress?: any;
    text: string;
    color?: string;
}

const FooterSection = styled.View`
  display: flex;
  flex-direction: row;
  position: absolute;
  bottom: 0;
  width: 100%;
  // position: relative;
  z-index: 20;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
`;

const ToggleButton = ({onPress, text, color }: ToggleButtonProps) => {
    return (
        <TouchableOpacity
            onPress = {onPress}
            style = {{
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
    const [loading, setLoading] = useState<boolean>(false);
    const [orderList, setOrderList] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(0);
    const [nextPage, setNextPage] = useState<any>(null);
    const [limit, setLimit] = useState<number>(4);
    const [search, setSearch] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const request = new Request();
    const isFocused = useIsFocused();
    
    useEffect(() => {
        async function getData() {
            setLoading(true);
            setItem(await handleSearchToggle());
            setLoading(false);
        }
        if(isFocused){
            getData();
        }
    }, [page, search, orderList, isFocused])

    const handleSearchToggle = async () => {
        //setLoading(true);

        let newPage;
        if (page === 1) {
            newPage = null;
        } else {
            newPage = page;
        }

        let searched;
        if (search === null || search === "") {
            searched = null;
            setIsSearch(false);
        } else {
            searched = search;
            setIsSearch(true);
        }
        
        const response = await request.get('/stories/story_search/', {
            page: newPage,
            search: searched,
            latest: orderList
        }, null);
        //setItem(response.data.data.results);
        setPageCount(response.data.data.count);
        setNextPage(response.data.data.next);
        //setLoading(false);
        return response.data.data.results;
    }

    const onRefresh = async () => {
        if(!refreshing || page !== 1){
            setRefreshing(true);
            setItem(await handleSearchToggle());
            setPage(1);
            setRefreshing(false);
        }
    }

    const onEndReached = async () => {
        if(loading || isSearch || nextPage === null){
            return;
        }
        else {
            //setPage(page + 1);
            setLoading(true);
            //setItem(item.concat(await handleSearchToggle()))
            //item.append(...await handleSearchToggle())
            //setItem([...item, ...await handleSearchToggle()]);
            //item.push(await handleSearchToggle());
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
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
                                    }} />
                                </>
                            }
                    </View>
                    <StoryList 
                        info = {item}
                        onRefresh = {onRefresh}
                        refreshing = {refreshing}
                        onEndReached = {onEndReached}
                        loading = {loading}
                        navigation = {navigation}
                    />
                    <FooterSection>
                        <Pagination
                            total = {pageCount}
                            limit = {limit}
                            page = {page}
                            setPage = {setPage}
                        />
                    </FooterSection>
                </SafeAreaView>
            )}
        </>
    )
}

export default StoryListPage;