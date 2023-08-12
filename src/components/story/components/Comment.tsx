import { useEffect, useState } from 'react';
import { TextPretendard as Text } from '../../../common/CustomText';
import { View, TouchableOpacity, Image, TextInput, Alert, StyleSheet, FlatList, Dimensions, Modal, Pressable } from 'react-native';
import { Request } from '../../../common/requests';
import Edit from '../../../assets/img/Story/Edit.svg';
import Heart from '../../../common/Heart';
import ReportIcon from '../../../assets/img/common/Report.svg';
import Report from '../../../common/Report';

interface CommentProps {
    data: any;
    story_id: number;
    reRenderScreen: any;
    email: string;
    isLogin: boolean;
    navigation: any;
    callback?: any;
}

const Comment = ({ data, story_id, reRenderScreen, email, isLogin, navigation, callback }: CommentProps) => {
    const date = data.created_at.slice(0, 10);
    const { width, height } = Dimensions.get('window');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [reported, setReported] = useState<string>('');
    const [reportVisible, setReportVisible] = useState<boolean>(false);
    const [like, setLike] = useState<boolean>(data.user_likes);
    const request = new Request();

    const onReport = async (item: any) => {
        const response = await request.post('/report/create/', {
          target: `story:comment:${data.id}`,
          reason: item
        }, {});
        setReported(item)
    }

    const toggleLike = async () => {
        if(isLogin){
        const response = await request.post(`/stories/${story_id}/comments/${data.id}/like/`, {}, {});
        setLike(!like);
        reRenderScreen();
        } else {
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
    };

    const deleteComment = async () => {
        const _delete = async () => {
            await request.delete(`/stories/comments/delete/${data.id}/`, {});
            reRenderScreen();
        }
        Alert.alert(
            "정말 삭제하시겠어요?",
            "삭제한 정보는 다시 확인할 수 없어요.",
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
    
    let isWriter = false;
    if (data.email == email) {
        isWriter = true;
    }
    return (
        <View style={{borderBottomColor: '#D9D9D9', borderBottomWidth: 1, width: width-40, alignSelf: 'center', flex: 1}}>
            <View style = {{ flexDirection: 'row', paddingVertical: 15, alignItems: 'center'}}>
                <View style = {{alignSelf: 'center'}}>
                    <Image source={{uri: data.profile_image}} style={{width:50,height:50,borderRadius:60}} />
                </View>
                <View style={{ marginLeft: 10, flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={[textStyles.nickname, {color: data!.writer_is_verified ? '#209DF5' : '#89C77F'}]}>{data!.writer_is_verified ? ('Editor') : ('User')}</Text>
                            <Text style={textStyles.nickname}> {data!.nickname}</Text>
                            <Text style={textStyles.date}>{date} 작성</Text>
                            { isWriter &&
                                <TouchableOpacity style={{marginLeft: 5}} onPress={() => setModalVisible(!modalVisible)}>
                                    <Edit width={12} height={12} />
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={toggleLike}>
                                <Heart like={like} onPress={() => {}} size={12} />
                                <Text style={{fontSize: 12, color: '#676767', marginHorizontal: 5}}>{data!.like_cnt}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={textStyles.content}>{data.content}</Text>
                </View>
                <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)} >
                    <Pressable style={{flex:1, backgroundColor:'rgba(0, 0, 0, 0.5)'}} onPress={()=>setModalVisible(false)}/>
                    <View style={{backgroundColor: 'white', width: width, position: 'absolute', top: height-200}}>
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 35}} onPress={() => {callback(data.content, data.id); setModalVisible(false)}}>
                        <Text style={{fontSize: 16, fontWeight: '700'}}>수정</Text>
                    </TouchableOpacity>
                    <View style={{width: width, height: 1, backgroundColor: '#D9D9D9'}} />
                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 35}} onPress={deleteComment}>
                        <Text style={{fontSize: 16, fontWeight: '700'}}>삭제</Text>
                    </TouchableOpacity>
                    </View>
                </Modal>
                <Report reported={reported} modalVisible={reportVisible} setModalVisible={setReportVisible} onReport={onReport} />
            </View>
            {!isWriter &&
                <TouchableOpacity style={{position: 'absolute', bottom: 5, right: 0}} onPress={() => setReportVisible(true)}>
                    <Text style={{color: '#A8A8A8', fontSize: 12}}>신고</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

const textStyles = StyleSheet.create({
    nickname: {
        fontSize: 14,
        fontWeight: '600',
    },
    date: {
        fontSize: 10,
        fontWeight: '400',
        color: '#676767',
        marginLeft: 8,
        lineHeight: 18
    },
    content: {
        fontSize: 14,
        fontWeight: '400',
        color: '#202020',
        lineHeight: 20,
        letterSpacing: -0.6,
        marginTop: 5
    }
})

export default Comment;