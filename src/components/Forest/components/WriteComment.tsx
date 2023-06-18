import { useState, useEffect } from 'react';
import { Request } from '../../../common/requests';
import { View, TouchableOpacity, TextInput, StyleSheet, Alert, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';

interface WriteCommentParams {
    id: number;
    reRenderScreen: any;
    data?: string;
    commentId?: number;
}

const WriteComment = ({ id, reRenderScreen, data, commentId }: WriteCommentParams) => {
    const { width, height } = Dimensions.get('screen');
    const [comment, setComment] = useState<string>('');
    const request = new Request();
    
    const uploadComment = async () => {
        if(comment === "" || comment === null){
            Alert.alert("댓글을 입력해주세요.");
        }
        else {
            if (data) {
                const response = await request.put(`/forest/${id}/comments/${commentId}/update/`, {
                    content: comment,
                });
                Alert.alert("댓글이 수정되었습니다.");
                reRenderScreen();
            } else {
                const response = await request.post(`/forest/${id}/comments/create/`, {
                    content: comment,
                }, null);
                Alert.alert("댓글이 등록되었습니다.");
                reRenderScreen();
            }
        }
    }

    useEffect(()=>{
        if(data){
            setComment(data);
        }
    }, [data])

    return (
        <View style={{backgroundColor: 'rgba(217, 217, 217, 0.2)', width: width, height: 100, padding: 10}}>
            <TextInput
                value = {comment}
                onChangeText = {setComment}
                // placeholder = '댓글을 달아주세요.'
                multiline = {true}
                style = {{ maxHeight: 90, includeFontPadding: true, width: width-50}}
            />
            <View style={{ position: 'absolute', marginTop: 60, marginLeft: width - 50}}>
            <TouchableOpacity
                onPress = {uploadComment}
                style = {{
                    backgroundColor: '#209DF5',
                    width: 40,
                    height: 24,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }}>
                <Text style = {{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>작성</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default WriteComment;