import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,  Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CardView from '../../../common/CardView';
import SearchCard from './SearchCard';
import ListCard from './ListCard';

interface StoryListProps {
    info: any;
    onEndReached?: any;
    onRefresh?: any;
    refreshing?: boolean;
    navigation: any;
    search: boolean;
    width?: any;
}

const StoryList = ({ info, onEndReached, onRefresh, refreshing, navigation, search, width }: StoryListProps) => {
    const searchItem = ({item}: any) => {
        return (
            <SearchCard
            id = {item.id}
            rep_pic = {item.rep_pic}
            place_name = {item.place_name}
            title = {item.title}
            story_like = {item.story_like}
            category = {item.category}
            preview = {item.preview}
            writer = {item.writer}
            writer_is_verified = {item.writer_is_verified}
            navigation = {navigation}
        />
        )
    }

    const listItem = ({item}: any) => {
        return (
            <ListCard
                        id = {item.id}
                        rep_pic = {item.rep_pic}
                        place_name = {item.place_name}
                        title = {item.title}
                        story_like = {item.story_like}
                        category = {item.category}
                        preview = {item.preview}
                        writer = {item.writer}
                        writer_is_verified = {item.writer_is_verified}
                        navigation = {navigation}
                        width = {width}
                    />
        )
    }

    return (
        <FlatList
            data={info}
            renderItem={search ? searchItem : listItem}
            keyExtractor = {(item, index) => String(index)}
            onRefresh = {onRefresh}
            refreshing = {refreshing}
            onEndReached = {onEndReached}
            showsVerticalScrollIndicator = {false}
            contentContainerStyle={{flexGrow: 1}}
            ListEmptyComponent = {<Text style = {{ marginTop: 15}}>해당하는 스토리가 없습니다</Text>}
        />
    )
}

export default StoryList;