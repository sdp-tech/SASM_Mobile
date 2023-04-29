import { useState, useEffect } from 'react';
import { Request } from '../../../common/requests';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Dimensions } from 'react-native';

interface WriteCommentParams {
    id: number;
    reRenderScreen: any;
}

const WriteComment = ({ id, reRenderScreen }: WriteCommentParams) => {
    const { width, height } = Dimensions.get('screen');
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
        <View style={{backgroundColor: 'rgba(217, 217, 217, 0.2)', width: width, height: 100}}>
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