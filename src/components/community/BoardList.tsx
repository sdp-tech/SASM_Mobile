import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';

import { CommunityStackParams } from '../../pages/Community'

interface BoardItemSectionProps {
    id: number;
    name: string;
    navigation: any;
}

const BoardListHeaderSection = () => (
    <Header>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Community</Text>
    </Header>
)

const BoardItemSection = ({ id, name, navigation }: BoardItemSectionProps) => {
    return (
        <BoardNavButton onPress={() => { navigation.navigate('PostList', { board_id: id, board_name: name }) }} >
            <Text style={{ fontSize: 20, fontWeight: '600', color: 'white' }}>{name}</Text>
        </BoardNavButton>
    )
}


const BoardListScreen = ({ navigation }: NativeStackScreenProps<CommunityStackParams, 'BoardList'>) => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const boardLists = [
        { id: 1, name: '자유게시판' },
        { id: 2, name: '장소추천게시판' },
        { id: 3, name: '홍보게시판' },
        { id: 4, name: '모임게시판' },
    ]

    const getRefreshData = async () => {
        setRefreshing(true);
        await RefreshDataFetch();
        setRefreshing(false);
    }

    const onRefresh = () => {
        if (!refreshing) {
            getRefreshData();
        }
    }

    const getData = async () => {
        if (true) {
            setLoading(true);
            await DataFetch();
            setLoading(false);
        }
    }

    const onEndReached = () => {
        if (!loading) {
            getData();
        }
    }

    const DataFetch = async () => {

    }

    const RefreshDataFetch = async () => {

    }


    useEffect(() => {

    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <BoardListHeaderSection />
            <FlatList
                data={boardLists}
                keyExtractor={(_) => _.name}
                style={styles.container}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.6}
                ListFooterComponent={loading ? <ActivityIndicator /> : <></>}
                renderItem={({ item }) => {
                    const { id, name } = item;
                    return (
                        <BoardItemSection id={id} name={name} navigation={navigation} />
                    )
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
})

const Header = styled.View`
    height: 40px;
	align-items: center;
    justify-content: center;
`
const BoardNavButton = styled.TouchableOpacity`
	height: 40px;
    align-items: center;
    justify-content: center;
	background-color: #01A0FC;
    margin-bottom: 1px;
`
const SearchHereText = styled.Text`
	padding: 5px;
	color: #FFFFFF;
	font-weight: 500;
	text-align: center;
`

export default BoardListScreen;