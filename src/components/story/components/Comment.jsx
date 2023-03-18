import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { View, Text, TouchableOpacity, Image, TextInput, Alert, FlatList } from 'react-native';
// import { useCookies } from 'react-cookie';
import { Request } from '../../../common/requests';
import { useNavigation } from '@react-navigation/native';
import WriteComment from './WriteComment';

const TextButton = ({text, onPress}) => {
    return (
        <TouchableOpacity
            onPress = {onPress}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}

const Comment = ({ data }) => {
    const date = data.created_at.slice(0, 10);
    const [update, setUpdate] = useState(false);
    //const [cookies, setCookie, removeCookie] = useCookies(["name"]);
    // const token = cookies.name; // 쿠키에서 id 를 꺼내기
    //const token = localStorage.getItem("accessTK"); //localStorage에서 accesstoken꺼내기
    const navigation = useNavigation();
    const request = new Request();
    //const email = localStorage.getItem('email');
    const [updateText, setUpdateText] = useState(data.content);

    const handleUpdate = () => {
        setUpdate(!update);
    }
    const deleteComment = async () => {
        const response = await request.delete(`/stories/comments/${data.id}/`, {});
        navigation.replace('StoryDetail', { id: data.story });
    }
    const updateComment = async () => {
        const response = await request.patch(`/stories/comments/${data.id}/`, {
            content: updateText,
        });
        navigation.replace('StoryDetail', { id: data.story });
    }
    // let isWriter = false;
    // if (data.email == email) {
    //     isWriter = true;
    // }
    return (
        <View>
            <View style = {{ flexDirection: 'row' }}>
                <Image src = {data.profile_image}
                    style = {{
                        width: 36,
                        height: 36,
                        borderRadius: 50,
                    }} />
                <Text>{data.nickname}</Text>
                <Text>{date}</Text>
                {update ?
                    <>
                        <TextButton onPress = {updateComment} text = '저장' />
                        <TextButton onPress = {handleUpdate} text = '취소' />
                    </>
                    :
                    <>
                        <TextButton onPress = {() => {
                            handleUpdate();
                        }}
                            text = '수정'
                            style = {{ }} />
                        <TextButton onPress = {deleteComment} text = '삭제' />
                    </>
                }
            </View>
            <View>
                {update ? 
                    <>
                        <TextInput
                            value = {updateText}
                            onChangeText = {setUpdateText}
                            style = {{
                                borderColor: 'rgba(0, 0, 0, 0.3)',
                                borderRadius: 24,
                                borderWidth: 1,
                                width: 260,
                                height: 24,
                                textAlign: 'center'
                            }}
                         />
                    </>
                    :
                    <><Text>{data.content}</Text></>
                }
            </View>
        </View>
    )
}

export default Comment;