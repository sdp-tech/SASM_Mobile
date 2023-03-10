import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import styled from 'styled-components/native';

import { CommunityStackParams } from '../../pages/Community'
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


const PostDetailScreen = ({ navigation, route }: NativeStackScreenProps<CommunityStackParams, 'PostDetail'>) => {
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<Post>();

    const request = new Request();

    const board_id = route.params.board_id;
    const post_id = route.params.post_id;
    const board_name = route.params.board_name;

    const getPost = async () => {
        const response = await request.get(`/community/posts/${post_id}/`, {}, {});
        return response.data;
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


    useEffect(() => {
        async function _getData() {
            try {
                setLoading(true);
                setPost(await getPost());
                setLoading(false);
            }
            catch (err) {
                console.warn(err);
            }
        };
        _getData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {loading || (post == undefined) ?
                <ActivityIndicator /> :
                <View style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 30, paddingRight: 30, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 15 }}>{post.title}</Text>
                    <Text style={{ fontSize: 15, marginBottom: 20 }}>{post.content}</Text>
                    <Text style={{ fontSize: 14, marginBottom: 20 }}>좋아요: {post.likeCount}</Text>

                    <HashtagBoxView>
                        {
                            post.hashtagList.map((name, index) => {
                                return <HashtagBox key={index} name={name} />
                            })
                        }
                    </HashtagBoxView>

                    <PhotoBox>
                        {
                            post.photoList.map((uri, index) => {
                                return (
                                    <Image key={index} source={{ uri: uri }} style={{ width: 100, height: 100, margin: 5 }} />
                                )
                            })
                        }
                    </PhotoBox>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => { navigation.navigate('PostUpload', { board_id: board_id, post_id: post_id }) }}>
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