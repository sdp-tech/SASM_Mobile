import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import CardView from '../../../common/CardView';
import SearchCard from './SearchCard';
import MainCard from './MainCard';

interface StoryListProps {
    info: any;
    onEndReached?: any;
    onRefresh?: any;
    refreshing?: boolean;
    navigation: any;
    search: boolean;
    onArrowPressed?: any;
}

const { width, height } = Dimensions.get('screen');

const StoryList = ({ info, onEndReached, onRefresh, refreshing, navigation, search, onArrowPressed }: StoryListProps) => {
    return (
        <>
        {search ? (
            <FlatList
                data = {info}
                renderItem = {({item}) => (
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
                )}
                keyExtractor = {(item, index) => String(index)}
                onRefresh = {onRefresh}
                refreshing = {refreshing}
                onEndReached = {onEndReached}
                showsVerticalScrollIndicator = {true}
                ListEmptyComponent = {<Text style = {{ marginTop: 15}}>해당하는 스토리가 없습니다</Text>}
            />
        ) : (
            <CardView
                gap={16}
                offset={24}
                data={info}
                pageWidth={width*0.6}
                height={width*0.9}
                dot={false}
                renderItem={({item}: any) => (
                    <MainCard
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
                )}
                //onRefresh = {onRefresh}
                //refreshing = {refreshing}
                onEndReached = {onEndReached}
                onArrowPressed = {onArrowPressed}
            />
        )}
        </>
    )
}

export default StoryList;