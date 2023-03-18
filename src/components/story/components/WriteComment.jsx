import { useState, useEffect } from 'react';
import { Request } from '../../../common/requests';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

const WriteComment = ({ id }) => {
    const request = new Request();
    const navigation = useNavigation();
    const [comment, setComment] = useState('');
    const uploadComment = async () => {
        // if (!token) {
        //     alert('로그인이 필요합니다.');
        //     navigate('/auth');
        // }
        // else {
            const response = await request.post("/stories/comments/", {
                story: id,
                content: comment,
            }, null);
        //}
        Alert.alert("댓글이 등록되었습니다.");
        navigation.replace('StoryDetail', { id: id });

    }

    return (
        <View style = {{ flexDirection: 'row' }}>
            <TextInput
                value = {comment}
                onChangeText = {setComment}
                placeholder = '댓글을 달아주세요.'
                style = {{
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 24,
                    borderWidth: 1,
                    width: 250,
                    height: 24,
                    textAlign: 'center'
                }}
            />
            <TouchableOpacity
                onPress = {(e) => {uploadComment(e)}}
                style = {{
                    backgroundColor: '#209DF5',
                    width: 60,
                    height: 24,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }}>
                <Text style = {{ color: '#FFFFFF' }}>등록</Text>
            </TouchableOpacity>
        </View>
    )
}

export default WriteComment;