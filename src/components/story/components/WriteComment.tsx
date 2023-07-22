import { useState, useEffect } from 'react';
import { Request } from '../../../common/requests';
import { View, TouchableOpacity, TextInput, StyleSheet, Alert, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';

interface WriteCommentParams {
    id: number;
    reRenderScreen: any;
    isLogin: boolean;
    navigation: any;
    data?: string;
    commentId?: number;
}

const WriteComment = ({ id, reRenderScreen, data, isLogin, navigation, commentId }: WriteCommentParams) => {
    const { width, height } = Dimensions.get('screen');
    const [comment, setComment] = useState<string>('');
    const hasUnsavedChanges = Boolean(comment);
    const request = new Request();
    
    const uploadComment = async () => {
        if(isLogin){
            if(comment === "" || comment === null){
                Alert.alert("댓글을 입력해주세요.");
            }
            else {
                if (data) {
                    const response = await request.put(`/stories/comments/update/${commentId}/`, {
                        content: comment,
                    });
                    Alert.alert("댓글이 수정되었습니다.");
                    reRenderScreen();
                } else {
                    const response = await request.post("/stories/comments/create/", {
                        story: id,
                        content: comment,
                    }, null);
                    Alert.alert("댓글이 등록되었습니다.");
                    reRenderScreen();
                }
        }} else {
            Alert.alert(
                "로그인이 필요합니다.",
                "로그인 항목으로 이동하시겠습니까?",
                [
                    {
                        text: "이동",
                        onPress: () => navigation.navigate('Login')
        
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
    }

    useEffect(()=>{
        if(data){
            setComment(data);
        }
    }, [data])

    useEffect(
        () =>
          navigation.addListener('beforeRemove', (e: any) => {
            if (!hasUnsavedChanges) {
              return;
            }
    
            // Prevent default behavior of leaving the screen
            e.preventDefault();
    
            // Prompt the user before leaving the screen
            Alert.alert(
              '나가시겠습니까?',
              '입력하신 정보는 저장되지 않습니다.',
              [
                { text: "머무르기", style: 'cancel', onPress: () => {} },
                {
                  text: '나가기',
                  style: 'destructive',
                  // If the user confirmed, then we dispatch the action we blocked earlier
                  // This will continue the action that had triggered the removal of the screen
                  onPress: () => navigation.dispatch(e.data.action),
                },
              ]
            );
          }),
        [navigation, hasUnsavedChanges]
      );

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