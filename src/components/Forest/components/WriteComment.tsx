import { useState, useEffect, useRef } from 'react';
import { Request } from '../../../common/requests';
import { View, TouchableOpacity, TextInput, StyleSheet, Alert, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';

interface WriteCommentParams {
    id: number;
    reRenderScreen: any;
    isLogin: boolean;
    data?: string;
    commentId?: number;
    navigation: any;
}

const WriteComment = ({ id, reRenderScreen, isLogin, data, commentId, navigation }: WriteCommentParams) => {
    const textInputRef = useRef<TextInput>(null);
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
                    const response = await request.put(`/forest/${id}/comments/${commentId}/update/`, {
                        content: comment,
                    });
                    Alert.alert("댓글이 수정되었습니다.");
                    setComment('')
                    reRenderScreen();
                } else {
                    const response = await request.post(`/forest/${id}/comments/create/`, {
                        content: comment,
                    }, null);
                    Alert.alert("댓글이 등록되었습니다.");
                    setComment('')
                    reRenderScreen();
                }
            }
        }else {
            Alert.alert(
              "로그인이 필요합니다.",
              "로그인 항목으로 이동하시겠습니까?",
              [
                  {
                      text: "이동",
                      onPress: () => navigation.navigate('마이페이지')
      
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
    const [inputWidth, setInputWidth] = useState(width-50)
    const handleContentSizeChange = (e: any) => {
    const { contentSize } = e.nativeEvent;
    const { height } = contentSize;

    // 3/4 지점의 높이 계산
    const threeFourthHeight = 70;

    // 커서가 3/4 지점보다 아래에 있는 경우 width 조정
    if (height > threeFourthHeight) {
      const currentWidth = inputWidth;
      const reducedWidth = currentWidth - 50; // width를 원하는 만큼 줄여주세요

      // 최소 width를 100으로 설정하려면 아래 코드를 사용합니다
      // const reducedWidth = Math.max(currentWidth - 50, 100);

      setInputWidth(reducedWidth);
    }
    };

    return (
        <View style={{backgroundColor: 'rgba(217, 217, 217, 0.2)', width: width-40, height: 100, padding: 10, alignSelf: 'center'}}>
            <TextInput
                value = {comment}
                onChangeText = {setComment}
                multiline = {true}
                style = {{ flex: 1, maxHeight: 70, includeFontPadding: true, width: width-60}}
                onContentSizeChange={handleContentSizeChange}
            />
            <TouchableOpacity
                onPress = {uploadComment}
                style = {{
                    backgroundColor: '#209DF5',
                    width: 30,
                    height: 20,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    position: 'absolute', marginTop: 70, marginLeft: width - 80
                }}>
                <Text style = {{ fontSize: 10, fontWeight: '600', color: '#FFFFFF' }}>등록</Text>
            </TouchableOpacity>
        </View>
    )
}

export default WriteComment;