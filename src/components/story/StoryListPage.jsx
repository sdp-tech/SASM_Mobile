import { useState, useEffect, useNavigate } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import SearchBar from '../../common/SearchBar';
import Pagination from '../../common/Pagination';
import { useCookies } from "react-cookie";
//import { useNavigate } from "react-router-dom";
import Loading from "../../common/Loading";
import StoryList from './components/StoryList';
import { Request } from '../../common/requests';
import { useNavigation } from '@react-navigation/native';
//import { TouchableOpacity } from 'react-native-gesture-handler';

const Section = styled.View`
  box-sizing: border-box;
  position: relative;
  height: calc(100vh - 114px)%;
  min-height: 100%;
  width: 100%;
  grid-area: story;
  display: flex;
  flex-direction: column;
`;
const SearchBarSection = styled.View`
  box-sizing: border-box;
  position: relative;
  height: 8vh%;
  width: 100%;
  display: flex;
  margin-top: 0.1%;
  flex-direction: row;
  grid-area: story;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 768px) {
    margin-top: 3vh;
    flex-direction: column;
    height: 10vh;
    justify-content: space-between;
    align-items: center;
  }
`;
const StoryListSection = styled.View`
  box-sizing: border-box;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  grid-area: story;
  scrollbar-height: thin;
  overflow: scroll;
  @media screen and (max-width: 768px) {
  }
`;
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
  background-color: #EEEEEE;
`;
const SearchFilterBar = styled.View`
  box-sizing: border-box;
  width: 35%;
  @media screen and (max-width: 768px) {
    width: 80%;
    height: 4vh;
  }
  height: 50%;
  display: flex;
  background: #FFFFFF;
  border-radius: 56px;
`;

const ToggleButton = ({onPress, text, color, textColor }) => {
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
                    top: 2,
                    bottom: 0
                },
                
            }}>
            <Text style = {{ color: textColor }}>{text}</Text>
        </TouchableOpacity>
    )
}

const StoryListPage = () => {
    const [item, setItem] = useState([]);
    const [searchToggle, setSearchToggle] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toggleOpen, setToggleOpen] = useState(false);
    const [orderList, setOrderList] = useState(true);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState([]);
    const [limit, setLimit] = useState(4);
    const [search, setSearch] = useState('');
    
    //const token = AsyncStorage.getItem("accessTK");
    const request = new Request();

    const handleOrderToggle = () => {
        setOrderList(!orderList);
    }

    const onChangeSearch = (e) => {
        e.preventDefault();
        setSearchToggle(e.target.value);
    }
    
    useEffect(() => {
        handleSearchToggle();
    }, [page, orderList])

    const handleSearchToggle = async (e) => {
        if (e) {
            e.preventDefault();
        }
        setSearchToggle(true);
        setLoading(true);

        let newPage;
        if (page === 1) {
            newPage = null;
        } else {
            newPage = page;
        }

        // let headerValue;
        // if (token === null || token === undefined) {
        //     headerValue = `No Auth`;
        // } else {
        //     headerValue = `Bearer ${token}`;
        // }

        let searched;
        if (search === null || search === "") {
            searched = null;
        } else {
            searched = search;
        }

        const response = await request.get('/stories/story_search/', {
            page: newPage,
            search: searched,
            order: orderList.toString(),
        }, null);

        setItem(response.data.data.results);
        console.log("item => ", item)
        setPageCount(response.data.data.count);
        setLoading(false);
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
                        fontWeight: 700,
                        lineHeight: 36,
                        marginTop: 23,
                        marginBottom: 8
                    }}>Story</Text>
                    <Text style = {{
                        fontSize: 12,
                        fontWeight: 500,
                        lineHeight: 14,
                        marginBottom: 20
                    }}>
                        공간에 대한 깊은 이야기
                    </Text>
                    <SearchBar />
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