import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';

import { CommunityStackParams, BoardFormat } from '../../pages/Community'
import { Request } from '../../common/requests';

interface PostItemSectionProps {
    board_id: number;
    post_id: number;
    board_name: string;
    boardFormat: BoardFormat;
    title: string;
    preview: string;
    nickname: string;
    created: string;
    commentCount: number;
    likeCount: number;
    navigation: any;
}

interface BoardListHeaderSectionProps {
    board_name: string;
}


const BoardListHeaderSection = ({ board_name }: BoardListHeaderSectionProps) => (
    <Header>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{board_name}</Text>
    </Header>
)

const SearchBarSection = () => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <SearchBarInput
                placeholder="검색어를 입력해주세요."
                multiline={false}
            // onChangeText={value => setContent(value)}
            // value={content}
            />
            <TouchableOpacity style={{ marginRight: 10 }} onPress={async () => console.warn('search!!')}>
                <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: '600' }}>검색</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}


const PostItemSection = ({ board_id, post_id, board_name, boardFormat, title, preview, nickname, created, commentCount, likeCount, navigation }: PostItemSectionProps) => {
    return (
        <TouchableOpacity onPress={() => { navigation.navigate('PostDetail', { board_id: board_id, post_id: post_id, board_name: board_name, boardFormat: boardFormat }) }}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: 'gray' }}>
                <Text style={{ fontSize: 17, fontWeight: '600', marginBottom: 5 }}>{title}</Text>
                <Text style={{ fontSize: 14, marginBottom: 5 }}>{preview}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14 }}>{created.slice(0, 10)} | {nickname}</Text>
                    <Text style={{ fontSize: 14 }}>{likeCount} | {commentCount}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}


const PostListScreen = ({ navigation, route }: NativeStackScreenProps<CommunityStackParams, 'PostList'>) => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [boardFormat, setBoardFormat] = useState<BoardFormat>();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState([]); // id, title, preview, nickname, email, likeCount, created, commentCount

    const request = new Request();

    const board_id = route.params.board_id;
    const board_name = route.params.board_name;

    const getBoardFormat = async () => {
        const response = await request.get(`/community/boards/${board_id}/`);
        return response.data;
    }

    const getPosts = async () => {
        const response = await request.get("/community/posts/", {
            board: board_id,
            query: search,
            query_type: 'default',
            page: page,
            latest: true,
        }, null);
        return response.data.data.results;
        // setTotal(response.data.data.count);
    }

    const onRefresh = async () => {
        if (!refreshing) {
            setPage(1);
            setRefreshing(true);
            setPosts(await getPosts());
            setRefreshing(false);
        }
    }

    const onEndReached = async () => {
        if (!loading) {
            setPage(page + 1);
            setLoading(true);
            posts.push(await getPosts() as never);
            setLoading(false);
        }
    }



    useEffect(() => {
        async function _getData() {
            try {
                setLoading(true);
                setBoardFormat(await getBoardFormat());
                setPosts(await getPosts());
                setLoading(false);
            }
            catch (err) {
                console.warn(err);
            }
        };
        _getData();
    }, [route]);

    return (
        <SafeAreaView style={styles.container}>
            <BoardListHeaderSection board_name={board_name} />
            {loading || boardFormat == undefined ?
                <ActivityIndicator /> :
                <>
                    <SearchBarSection />
                    <FlatList
                        data={posts}
                        // keyExtractor={(_) => _.title}
                        style={styles.container}
                        // ListHeaderComponent={<StorySection />}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        // onEndReached={onEndReached}
                        // onEndReachedThreshold={0}
                        // ListFooterComponent={loading && <ActivityIndicator />}
                        renderItem={({ item }) => {
                            const { id, title, preview, nickname, created, commentCount, likeCount } = item;
                            return (
                                <PostItemSection
                                    board_id={board_id}
                                    post_id={id}
                                    board_name={board_name}
                                    boardFormat={boardFormat}
                                    title={title}
                                    preview={preview}
                                    nickname={nickname}
                                    created={created}
                                    commentCount={commentCount}
                                    likeCount={likeCount}
                                    navigation={navigation}
                                />
                            )
                        }}
                    />
                    <TouchableOpacity style={{ position: 'absolute', bottom: '5%', right: 8 }} onPress={() => navigation.navigate('PostUpload', { board_id: board_id, boardFormat: boardFormat })}>
                        <View style={{ backgroundColor: '#01A0FC', padding: 10, borderRadius: 10 }}>
                            <Text style={{ fontSize: 18, color: 'white' }}>글쓰기</Text>
                        </View>
                    </TouchableOpacity>
                </>
            }

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
});

const Header = styled.View`
            height: 40px;
            align-items: center;
            justify-content: center;
            `
const SearchBarInput = styled.TextInput`
            width: 80%;
            height: 32px;
            marginRight: 10px;
            padding: 5px;
            borderWidth: 1px;
            background: #FFFFFF;
            border-radius: 3px;
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            `;

export default PostListScreen;