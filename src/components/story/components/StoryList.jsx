import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Loading from '../../../common/Loading';
import styled from 'styled-components/native';
import { Request } from '../../../common/requests';
import ItemCard from './ItemCard';

const StoryList = ({ info, onEndReached, loading, onRefresh, refreshing }) => {
    return (
            <>
                {info.length === 0 ? (
                  <Text style = {{ marginTop: 15 }}>해당하는 스토리가 없습니다</Text>
                ) : (
                    <FlatList
                        data = {info}
                        renderItem = {({item}) => (
                                <ItemCard
                                    id = {item.id}
                                    rep_pic = {item.rep_pic}
                                    place_name = {item.place_name}
                                    title = {item.title}
                                    category = {item.category}
                                    story_like = {item.story_like}
                                    preview = {item.preview}
                                 />
                        )}
                        onRefresh = {onRefresh}
                        refreshing = {refreshing}
                        onEndReached = {onEndReached}
                        //onEndReachedThreshold = {0.7}
                        ListFooterComponent = {loading && <ActivityIndicator />}
                     />
                )}
            </>
    )
}

export default StoryList;