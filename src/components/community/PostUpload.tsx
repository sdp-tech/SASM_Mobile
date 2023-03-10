import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Button, TextInput, Alert, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import styled from 'styled-components/native';
import * as ImagePicker from 'react-native-image-picker';

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

interface BoardFormat {
    name: string;
    supportsHashtags: boolean;
    supportsPostPhotos: boolean;
    supportsPostComments: boolean;
    supportsPostCommentPhotos: boolean;
    postContentStyle: string;
}

interface Action {
    title: string;
    type: 'capture' | 'library';
    options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

interface Hashtag {
    name: string;
    deleteFunc: any;
}


const HashtagBox = ({ name, deleteFunc }: Hashtag) => (
    <TouchableOpacity onPress={deleteFunc}>
        <View style={{ backgroundColor: '#01A0FC', padding: 10, borderRadius: 20, margin: 1 }}>
            <Text style={{ fontSize: 12, color: 'white' }}>{name}</Text>
        </View>
    </TouchableOpacity >
)




const PostUploadScreen = ({ navigation, route }: NativeStackScreenProps<CommunityStackParams, 'PostUpload'>) => {
    const [loading, setLoading] = useState(false);
    const [boardFormat, setBoardFormat] = useState<BoardFormat>();

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [photos, setPhotos] = useState<any[]>([]);

    const [workingHashtag, setWorkingHashtag] = useState<string>('');

    const request = new Request();

    const board_id = route.params.board_id;
    const post_id = route.params.post_id;


    const getBoardFormat = async () => {
        const response = await request.get(`/community/boards/${board_id}/`);
        return response.data;
    }

    const getPost = async () => {
        const response = await request.get(`/community/posts/${post_id}/`, {}, {});
        return response.data;
    }


    const convertTextToHashtag = async (text: string) => {
        if (hashtags.length >= 5) {
            Alert.alert('Error', '??????????????? ?????? 5????????? ?????? ??? ????????????.');
            setWorkingHashtag('');
            return;
        }


        const lastChar = text[text.length - 1];
        if (text.length >= 9 || lastChar == ',' || lastChar == ' ') {
            if (hashtags.includes(text)) {
                Alert.alert('Error', '?????? ??????????????? ???????????? ????????? ??? ????????????.');
                setWorkingHashtag('');
                return;
            }
            setHashtags([...hashtags, text.split(' ')[0].replace(/[#,]/g, "")]);
            setWorkingHashtag('');

        }
        else {
            setWorkingHashtag(text);
        }
    }

    const actions: Action[] = [
        {
            title: '?????????',
            type: 'capture',
            options: {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 150,
                maxWidth: 150,
            },
        },
        {
            title: '??????',
            type: 'library',
            options: {
                selectionLimit: 3,
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 150,
                maxWidth: 150,
            },
        }
    ];

    const uploadPost = async () => {
        if (board_id == undefined || boardFormat == undefined)
            return;

        const formData = new FormData();
        formData.append('board', board_id);
        formData.append('title', title);
        formData.append('content', content);

        if (boardFormat.supportsPostPhotos && photos) {
            for (let i = 0; i < photos.length; i++) {
                if (photos[i].uri) { // ???????????? ?????? ?????? ???????????? ?????? imageList??? ??????
                    formData.append('imageList', {
                        uri: photos[i].uri,
                        type: 'image/jpeg/jpg',
                        name: photos[i].fileName,
                    });
                }
                else { // ?????? ??????, photoList??? ??????
                    formData.append('photoList', photos[i]);
                }

            }
        }
        if (boardFormat.supportsHashtags && hashtags) {
            for (let i = 0; i < hashtags.length; i++) {
                formData.append('hashtagList', hashtags[i]);
            }
        }
        console.warn(formData);
        if (post_id) { // ??????
            const response = await request.put(`/community/posts/${post_id}/update/`, formData, { "Content-Type": "multipart/form-data" });
        }
        else { // ??????
            const response = await request.post("/community/posts/create/", formData, { "Content-Type": "multipart/form-data" });
        }
        navigation.navigate('PostList', { board_id: board_id, board_name: boardFormat.name });
    }

    const onPhotoButtonPress = useCallback((type: string, options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions) => {
        const addToPhotos = (_photos: any[]) => {
            if (!_photos)
                return;
            if (photos.length + _photos.length > 3) {
                Alert.alert('????????? ?????? 3????????? ????????? ??? ????????????.');
                return;
            }
            setPhotos([...photos, ..._photos]);
        }
        if (type === 'capture') {
            ImagePicker.launchCamera(options, response => addToPhotos(response.assets as any[]))
        } else {
            ImagePicker.launchImageLibrary(options, response => addToPhotos(response.assets as any[]))
        }
    }, [photos]); // photos ??? ?????? ??? ????????? callback ???????????????

    useEffect(() => {
        async function _getData() {
            try {
                setLoading(true);

                setBoardFormat(await getBoardFormat());

                if (post_id) {
                    const post = await getPost() as Post;
                    setTitle(post.title);
                    setContent(post.content);
                    setHashtags(post.hashtagList);
                    setPhotos(post.photoList);
                }
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
            {loading || (boardFormat == undefined) ?
                <ActivityIndicator /> :
                <>
                    <TitleInput
                        placeholder="????????? ??????????????????."
                        onChangeText={value => setTitle(value)}
                        value={title}
                    />
                    <ContentInput
                        placeholder="????????? ??????????????????."
                        multiline={true}
                        onChangeText={value => setContent(value)}
                        value={content}
                    />
                    {
                        boardFormat.supportsHashtags ?
                            (
                                < >
                                    <HashtagInput
                                        placeholder="??????????????? ??????????????????(?????? 5???, ?????? 9??????)."
                                        onChangeText={value => convertTextToHashtag(value)}
                                        value={workingHashtag}
                                    />
                                    <HashtagBoxView>
                                        {
                                            hashtags.map((name, index) => {
                                                return <HashtagBox key={index} name={name} deleteFunc={() => { setHashtags(hashtags.filter((_name) => { return _name !== name })) }} />
                                            })
                                        }
                                    </HashtagBoxView>
                                </>

                            ) : <></>
                    }
                    {
                        boardFormat.supportsPostPhotos ?
                            <>
                                <PhotosInput>
                                    {
                                        actions.map(({ title, type, options }, index) => {
                                            return (
                                                <PhotoButton
                                                    key={index}
                                                    onPress={() => onPhotoButtonPress(type, options)}>
                                                    <Text key={index} style={{ textAlign: 'center' }}>{title}</Text>
                                                </PhotoButton>
                                            );
                                        })
                                    }
                                </PhotosInput>
                                <PhotoBox>
                                    {
                                        photos.map((data, index) => {
                                            return (
                                                <TouchableOpacity key={index} onPress={() => { setPhotos(photos.filter((_photo, _idx) => { return _idx !== index })) }}>
                                                    <Image key={index} source={{ uri: (data.uri ? data.uri : data) }} style={{ width: 100, height: 100, margin: 5 }} />
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </PhotoBox>
                            </> : <></>

                    }
                    <TouchableOpacity onPress={async () => await uploadPost()}>
                        <View style={{ backgroundColor: '#01A0FC', padding: 10, borderRadius: 10 }}>
                            <Text style={{ fontSize: 18, color: 'white' }}>????????????</Text>
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
        backgroundColor: "white",
        alignItems: 'center',
    }
});

const TitleInput = styled.TextInput`
            width: 80%;
            height: 32px;
            margin: 12px;
            padding: 5px;
            borderWidth: 1px;
            background: #FFFFFF;
            border-radius: 3px;
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            `;


const ContentInput = styled.TextInput`
            width: 80%;
            height: 100px;
            margin: 12px;
            padding: 5px;
            borderWidth: 1px;
            background: #FFFFFF;
            border-radius: 3px;
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            textAlignVertical: top;
            `;

const HashtagInput = styled.TextInput`
            width: 80%;
            height: 32px;
            margin: 12px;
            padding: 5px;
            borderWidth: 1px;
            background: #FFFFFF;
            border-radius: 3px;
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            `;

const HashtagBoxView = styled.View`
            display: flex;
            flex-flow: row wrap;
            width: 80%;
            margin: 12px;
            `

const PhotosInput = styled.View`
  display: flex; 
  flex-flow: row wrap;
  border: 1px black solid;
`
const PhotoButton = styled.TouchableOpacity`
  width: 50%;
  padding: 10px;
`
const PhotoBox = styled.View`
  display: flex;
  min-height: 110px;
  margin: 10px 0;
  flex-flow: row wrap;
  justify-content: space-around;
`


export default PostUploadScreen;