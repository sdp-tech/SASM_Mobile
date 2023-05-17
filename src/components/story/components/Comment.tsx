import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert, StyleSheet, FlatList } from 'react-native';
import { Request } from '../../../common/requests';

interface CommentProps {
    data: any;
    reRenderScreen: any;
    email: string;
}

interface TextButtonProps {
    text: string;
    onPress: any;
}

const TextButton = ({text, onPress}: TextButtonProps) => {
    return (
        <TouchableOpacity
            onPress = {onPress}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}

const Comment = ({ data, reRenderScreen, email }: CommentProps) => {
    const date = data.created_at.slice(0, 10);
    const [update, setUpdate] = useState<boolean>(false);
    const [updateText, setUpdateText] = useState(data.content);
    const request = new Request();

    const handleUpdate = () => {
        setUpdate(!update);
    }
    const deleteComment = async () => {
        const _delete = async () => {
            await request.delete(`/stories/comments/delete/${data.id}/`, {});
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
    
    const updateComment = async () => {
        const response = await request.put(`/stories/comments/update/${data.id}/`, {
            content: updateText,
        });
        Alert.alert("댓글이 수정되었습니다.");
        reRenderScreen();
    }
    let isWriter = false;
    if (data.email == email) {
        isWriter = true;
    }
    return (
        <View>
            <View style = {{ flexDirection: 'row', marginTop: 20, marginLeft: 20}}>
                <View style = {{alignSelf: 'center'}}>
                    <Image source={{uri: data.profile_image}} style={{width:50,height:50,borderRadius:60,}} />
                    { data!.writer_is_verified ? (
                        <View style={{position: 'absolute', width: 34, height: 12, backgroundColor: '#209DF5', borderRadius: 10, top: 42, left: 8.5}}>
                            <Text style={textStyles.verified}>Editor</Text>
                        </View>
                    ): (
                        <View style={{position: 'absolute', width: 34, height: 12, backgroundColor: '#89C77F', borderRadius: 10, top: 42, left: 8.5}}>
                            <Text style={textStyles.verified}>User</Text>
                        </View>
                    )}
                </View>
                <View style={{ marginLeft: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Text style={textStyles.nickname}>{data.nickname}</Text>
                        <Text style={textStyles.date}>{date}</Text>
                        {isWriter ?
                            <>
                            {update ?
                                <>
                                    <TextButton onPress = {updateComment} text = '저장' />
                                    <TextButton onPress = {handleUpdate} text = '취소' />
                                </>
                                :
                                <>
                                    <TextButton onPress = {() => {handleUpdate()}} text = '수정' />
                                    <TextButton onPress = {deleteComment} text = '삭제' />
                                </>
                            }
                            </>
                        : <></>}
                    </View>
                    <Text style={textStyles.content}>{data.content}</Text>
                </View>
            </View>
            {/* <View>
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
                    <>
                    <Text>{data.content}</Text>
                    <View style={{alignSelf:'flex-end',flexDirection:'row'}}>
                    <TextButton onPress={() => {}} text='추천'/>
                    <Text>/</Text>
                    <TextButton onPress={() => {}} text='신고'/>
                    </View>
                    </>
                }
            </View> */}
        </View>
    )
}

const textStyles = StyleSheet.create({
    verified: {
        fontSize: 8,
        fontWeight: '600',
        color: 'white', 
        alignSelf: 'center', 
        justifyContent: 'center'
    },
    nickname: {
        fontSize: 8,
        fontWeight: '600',
        lineHeight: 9
    },
    date: {
        fontSize: 8,
        fontWeight: '400',
        color: '#676767',
        marginLeft: 8,
        lineHeight: 9
    },
    content: {
        fontSize: 8,
        fontWeight: '400',
        color: '#676767',
        lineHeight: 9.5,
        marginTop: 5
    }
})

export default Comment;