import { useState, useEffect } from 'react';
import { Request } from '../../../common/requests';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

interface WriteCommentParams {
    id: number;
    reRenderScreen: any;
}

const WriteComment = ({ id, reRenderScreen }: WriteCommentParams) => {
    const [comment, setComment] = useState<string>('');
    const request = new Request();
    
    const uploadComment = async () => {
        if(comment === "" || comment === null){
            Alert.alert("댓글을 입력해주세요.");
        }
        else {
            const response = await request.post("/stories/comments/create/", {
                story: id,
                content: comment,
            }, null);
            Alert.alert("댓글이 등록되었습니다.");
            reRenderScreen();
        }
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
                onPress = {uploadComment}
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