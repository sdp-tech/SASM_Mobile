import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';

import { BoardFormat, CommunityStackParams } from '../../pages/Community';
import PostCommentUploadSection from './PostCommentUpload';
import { Request } from '../../common/requests';

interface Post {
    board: number;
    title: string;
    content: string;
    nickname: string;
    email: string;
    created: string;
    likeCount: number;
    viewCount: number;
    likes: boolean;
    photoList: Array<string>;
    hashtagList: Array<string>;
}

const HashtagBox = ({ name }: Hashtag) => (
    <View style={{ backgroundColor: '#01A0FC', padding: 10, borderRadius: 20, margin: 1 }}>
        <Text style={{ fontSize: 12, color: 'white' }}>{name}</Text>
    </View>
)

interface Hashtag {
    name: string;
}

interface PostCommentItemSectionProps {
    id: number;
    content: string;
    isParent: boolean;
    group: number;
    email: string;
    nickname: string;
    created: string;
    updated: string;
    photoList: string[];
    boardFormat: BoardFormat;
    navigation: any;
    deleteComment: any;
    editComponent: any;
    replyComponent: any;
}

interface PostDetailSectionProps {
    post: Post;
    boardFormat: BoardFormat;
    navToPostUpload: any;
    deletePost: any;
}

const PostCommentItemSection = ({ id, content, isParent, group, email, nickname, created, updated, photoList, boardFormat, navigation, deleteComment, editComponent, replyComponent }: PostCommentItemSectionProps) => {
    const [editing, setEditing] = useState<Boolean>(false);
    const [replying, setReplying] = useState<Boolean>(false);

    return (
        !editing ?
            <>
                <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 5, marginBottom: 10, borderBottomWidth: 1 }}>
                    <View style={{ marginLeft: isParent ? 0 : 30 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: 'black', marginBottom: 5 }}>{nickname}</Text>
                        <Text style={{ fontSize: 15, fontWeight: '500', color: 'black', marginBottom: 5 }}>{content}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: 'gray', marginBottom: 5 }}>{(created.slice(0, 19) == updated.slice(0, 19)) ? created.slice(0, 10) : updated.slice(0, 10) + " (수정됨)"}</Text>
                        {
                            boardFormat.supportsPostCommentPhotos && photoList ?
                                <PhotoBox>
                                    {
                                        photoList.map((uri, index) => {
                                            return (
                                                <Image key={index} source={{ uri: uri }} style={{ width: 100, height: 100, margin: 5 }} />
                                            )
                                        })
                                    }
                                </PhotoBox> : <></>
                        }
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setReplying(true)}>
                                <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15, fontWeight: '600' }}>대댓글</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setEditing(true)}>
                                <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15, fontWeight: '600' }}>수정</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginRight: 10 }} onPress={async () => await deleteComment(id)}>
                                <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15, fontWeight: '600' }}>삭제</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                {
                    replying ?
                        <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 5, marginBottom: 10, borderBottomWidth: 1 }}>
                            {replyComponent}
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setReplying(false)}>
                                    <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 15, fontWeight: '600' }}>취소</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View> : <></>
                }
            </>
            :
            <>
                <View style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 5, marginBottom: 10, borderBottomWidth: 1 }}>
                    {editComponent}
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => setEditing(false)}>
                            <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 15, fontWeight: '600' }}>취소</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </>


    )
}

const PostDetailSection = ({ post, boardFormat, navToPostUpload, deletePost }: PostDetailSectionProps) => {
    return (
        <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 30, paddingRight: 30, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 15 }}>{post.title}</Text>
            <Text style={{ fontSize: 15, marginBottom: 20 }}>{post.content}</Text>
            <Text style={{ fontSize: 14, marginBottom: 20 }}>좋아요: {post.likeCount}</Text>
            {
                boardFormat.supportsHashtags && post.hashtagList ?
                    <HashtagBoxView>
                        {
                            post.hashtagList.map((name, index) => {
                                return <HashtagBox key={index} name={name} />
                            })
                        }
                    </HashtagBoxView> : <></>
            }
            {
                boardFormat.supportsPostPhotos && post.photoList ?
                    <PhotoBox>
                        {
                            post.photoList.map((uri, index) => {
                                return (
                                    <Image key={index} source={{ uri: uri }} style={{ width: 100, height: 100, margin: 5 }} />
                                )
                            })
                        }
                    </PhotoBox> : <></>
            }

            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navToPostUpload()}>
                    <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: '600' }}>수정</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => deletePost()}>
                    <View style={{ backgroundColor: '#D3D3D3', borderWidth: 0.5, borderRadius: 10, width: 50, height: 25, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: '600' }}>삭제</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}



const PostDetailScreen = ({ navigation, route }: NativeStackScreenProps<CommunityStackParams, 'PostDetail'>) => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [post, setPost] = useState<Post>();
    const [postComments, setPostComments] = useState([]);

    const request = new Request();

    const board_id = route.params.board_id;
    const post_id = route.params.post_id;
    const board_name = route.params.board_name;
    const boardFormat = route.params.boardFormat;

    const getPost = async () => {
        const response = await request.get(`/community/posts/${post_id}/`, {}, {});
        return response.data;
    }

    const getPostComments = async () => {
        setLoading(true);
        const response = await request.get(`/community/post_comments/`, {
            post: post_id,
        });
        setLoading(false);

        return response.data.data.results;
    }

    const navToPostUpload = () => {
        navigation.navigate('PostUpload', { board_id: board_id, post_id: post_id, boardFormat: boardFormat });
    }

    const reRenderScreen = () => {
        setRefreshing(true);
        setRefreshing(false);
    }

    const onRefresh = async () => {
        if (!refreshing) {
            // setPage(1);
            setRefreshing(true);
            setPost(await getPost());
            if (boardFormat.supportsPostComments)
                setPostComments(await getPostComments());
            setRefreshing(false);
        }
    }


    const deletePost = async () => {
        const _delete = async () => {
            await request.delete(`/community/posts/${post_id}/delete/`);
            navigation.navigate('PostList', { board_id: board_id, board_name: board_name });
        }
        Alert.alert(
            "게시글 삭제 확인",
            "정말로 삭제하시겠습니까?",
            [
                {
                    text: "삭제",
                    onPress: () => _delete(),

                },
                {
                    text: "취소",
                    onPress: () => { },
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }

    const deleteComment = async (id: number) => {
        const _delete = async () => {
            await request.delete(`/community/post_comments/${id}/delete`);
            reRenderScreen();
        }
        Alert.alert(
            "댓글 삭제 확인",
            "정말로 삭제하시겠습니까?",
            [
                {
                    text: "삭제",
                    onPress: () => _delete(),

                },
                {
                    text: "취소",
                    onPress: () => { },
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }


    useEffect(() => {
        async function _getData() {
            try {
                setLoading(true);
                setPost(await getPost());
                if (boardFormat.supportsPostComments)
                    setPostComments(await getPostComments());
                setLoading(false);
            }
            catch (err) {
                console.warn(err);
            }
        };
        _getData();
    }, [refreshing]);

    return (
        <SafeAreaView style={styles.container}>
            {loading || (post == undefined) ?
                <ActivityIndicator /> :
                <>
                    <FlatList
                        data={postComments}
                        // keyExtractor={(_) => _.name}
                        style={styles.container}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        // onEndReached={onEndReached}
                        // onEndReachedThreshold={0.6}
                        ListHeaderComponent={<>
                            <PostDetailSection post={post} boardFormat={boardFormat} navToPostUpload={navToPostUpload} deletePost={deletePost} />
                            <PostCommentUploadSection post_id={post_id} board_id={board_id} boardFormat={boardFormat} isParent={true} navigation={navigation} reRenderScreen={reRenderScreen} />
                        </>}
                        ListFooterComponent={loading ? <ActivityIndicator /> : <></>}
                        renderItem={({ item }) => {
                            const { id, content, isParent, group, email, nickname, created, updated, photoList } = item;
                            return (
                                <PostCommentItemSection {...{ id, content, isParent, group, email, nickname, created, updated, photoList }}
                                    boardFormat={boardFormat}
                                    navigation={navigation}
                                    deleteComment={deleteComment}
                                    editComponent={
                                        <PostCommentUploadSection comment_id={id} post_id={post_id} board_id={board_id}
                                            boardFormat={boardFormat} isParent={true} navigation={navigation} reRenderScreen={reRenderScreen}
                                            prevComment={{ content: content, photoList: photoList }}
                                        />
                                    }
                                    replyComponent={<PostCommentUploadSection post_id={post_id} board_id={board_id}
                                        boardFormat={boardFormat} isParent={false} parentId={id} navigation={navigation} reRenderScreen={reRenderScreen}
                                    />}
                                />
                            )
                        }}
                    />
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

const HashtagBoxView = styled.View`
            display: flex;
            flex-flow: row wrap;
            width: 80%;
            margin: 12px;
            `

const PhotoBox = styled.View`
  display: flex;
  min-height: 110px;
  margin: 10px 0;
  flex-flow: row wrap;
  justify-content: space-around;
`

export default PostDetailScreen;