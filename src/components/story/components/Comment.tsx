import { useEffect, useState } from 'react';
import { TextPretendard as Text } from '../../../common/CustomText';
import { View, TouchableOpacity, Image, TextInput, Alert, StyleSheet, FlatList, Dimensions, Modal, Pressable } from 'react-native';
import { Request } from '../../../common/requests';
import Edit from '../../../assets/img/Story/Edit.svg';

interface CommentProps {
    data: any;
    reRenderScreen: any;
    email: string;
    isLogin: boolean;
    callback?: any;
}

const Comment = ({ data, reRenderScreen, email, isLogin, callback }: CommentProps) => {
    const date = data.created_at.slice(0, 10);
    const [update, setUpdate] = useState<boolean>(false);
    const [updateText, setUpdateText] = useState(data.content);
    const { width, height } = Dimensions.get('screen');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const request = new Request();

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
        <View style={{borderBottomColor: '#D9D9D9', borderBottomWidth: 1, height: 90}}>
            <View style = {{ flexDirection: 'row', padding: 20}}>
                <View style = {{alignSelf: 'center'}}>
                    <Image source={{uri: data.profile_image}} style={{width:50,height:50,borderRadius:60}} />
                </View>
                <View style={{ marginLeft: 10}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Text style={[textStyles.nickname, {color: data!.writer_is_verified ? '#209DF5' : '#67D393'}]}>{data!.writer_is_verified ? ('Editor') : ('User')}</Text>
                        <Text style={textStyles.nickname}> {data!.nickname}</Text>
                        <Text style={textStyles.date}>{date} 작성</Text>
                        {isWriter ?
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={{marginLeft: 120, marginTop: 5}}>
                                <Edit width={10} height={10} />
                            </TouchableOpacity>
                        : <></>}
                    </View>
                    <Text style={textStyles.content}>{data.content}</Text>
                </View>
                <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)} >
      <Pressable style={{flex:1, backgroundColor:'rgba(0, 0, 0, 0.5)'}} onPress={()=>setModalVisible(false)}/>
        <View style={{backgroundColor: 'white', width: width, position: 'absolute', top: height-245}}>
          <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 35}} onPress={() => {callback(data.content, data.id); setModalVisible(false)}}>
            <Text style={{fontSize: 16, fontWeight: '700'}}>수정</Text>
          </TouchableOpacity>
          <View style={{width: width, height: 1, backgroundColor: '#D9D9D9'}} />
          <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 35}} onPress={deleteComment}>
            <Text style={{fontSize: 16, fontWeight: '700'}}>삭제</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    nickname: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 18
    },
    date: {
        fontSize: 10,
        fontWeight: '400',
        color: '#676767',
        marginLeft: 8,
        lineHeight: 18
    },
    content: {
        fontSize: 12,
        fontWeight: '400',
        color: '#676767',
        lineHeight: 18,
        marginTop: 5
    }
})

export default Comment;