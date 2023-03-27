import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import ItemCard from './ItemCard';

interface StoryListProps {
    info: any;
    onEndReached: any;
    loading: boolean;
    onRefresh: any;
    refreshing: boolean;
    navigation: any;
}

const StoryList = ({ info, onEndReached, loading, onRefresh, refreshing, navigation }: StoryListProps) => {
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
                            navigation = {navigation}
                        />
                    )}
                    keyExtractor = {(item, index) => String(index)}
                    onRefresh = {onRefresh}
                    refreshing = {refreshing}
                    onEndReached = {onEndReached}
                    showsVerticalScrollIndicator = {true}
                    ListFooterComponent = {loading ? <ActivityIndicator /> : null}
                />
            )}
        </>
    )
}

export default StoryList;