import React, { useState } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView, Alert, Dimensions, Modal } from "react-native";
import { TextPretendard as Text } from '../../../common/CustomText';
import styled, { css } from 'styled-components/native';
import { setNickname, setAccessToken, setRefreshToken } from '../../../common/storage';
import { Request } from '../../../common/requests';
import Arrow from "../../../assets/img/common/Arrow.svg";
import { StackScreenProps } from '@react-navigation/stack';
import { MyPageProps } from '../../../pages/MyPage';
import InputWithLabel from '../../../common/InputWithLabel';
import FinishModal from '../../../common/FinishModal';

const { width, height } = Dimensions.get('window');

const request = new Request;

const SignUpButton = styled.View`
    width: 300px;
    height: 40px;
    border-radius: 10px;
    border-color: #44ADF7;
    background: #44ADF7;
    align-items: center;
    justify-content: center;   
`;

const LoginButton = styled.View`
    width: 150px;
    height: 40px;
    border-width: 2px;
    border-radius: 10px;
    backgroundColor: #FFFFFF;
    align-items: center;
    justify-content: center;
    border-color: #44ADF7;
`;

const FeedbackBox = styled.TextInput`
    width: ${width - 60}px;
    height: 450px;
    border-bottom-width: 1px;
    border-color: #C0C0C0;
    font-size: 16px;
    margin-vertical: 10px;
`;


const LoginInput = styled.TextInput`
    width: 350px;
    height: 100px;
    margin: 12px;
    padding: 5px;
    borderWidth: 1px;
    background: #FFFFFF;
    border-radius: 3px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Feedback = ({ navigation }: StackScreenProps<MyPageProps, 'feedback'>) => {
    const [voc, setVoc] = useState<string>('');
    const request = new Request();
    const [finishModal, setFinishModal] = useState(false);
    const FeedbackPost = async () => {
        const response = await request.post('/sdp_admin/voc/',
            { content: voc }
        );
        setFinishModal(true);

    }

    return (
        <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Modal visible={finishModal}>
                <FinishModal
                    setModal={setFinishModal}
                    title="의견 보내기 완료 !"
                    subtitle={['소중한 의견 감사합니다']}
                    navigation={()=>{navigation.navigate('mypage')}}
                />
            </Modal>
            <View style={{ position: 'relative', marginBottom: 30, width: '100%' }}>
                <Text style={TextStyles.title}>의견 보내기</Text>
                <TouchableOpacity style={{ left: 10, marginBottom: 30, position: 'absolute' }} onPress={() => { navigation.navigate('mypage') }}>
                    <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} />
                </TouchableOpacity>
            </View>
            <Text style={{ width: '85%', textAlign: 'left', fontSize: 12, lineHeight: 18, letterSpacing: -0.6 }}>내용</Text>
            <FeedbackBox
                maxLength={300}
                multiline
                style={{ textAlignVertical: 'top' }}
                placeholder="내용을 입력해주세요"
                onChangeText={text => {
                    setVoc(text)
                }} />
            <Text style={{ width: '85%', textAlign: 'right', fontSize: 12, lineHeight: 18, letterSpacing: -0.6 }}>{voc.length}/300</Text>
            <TouchableOpacity style={{ marginTop: 50 }} onPress={FeedbackPost}><Text style={TextStyles.button}>의견 보내기</Text></TouchableOpacity>
        </SafeAreaView>)
}

const TextStyles = StyleSheet.create({
    title: {
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: -0.6,
        fontWeight: '700',
        alignSelf: 'center'
    },
    button: {
        overflow: 'hidden',
        width: 175,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#67D393',
        textAlign: 'center',
        lineHeight: 45,
        fontSize: 16,
        letterSpacing: -0.6,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 15,
    },
})

export default Feedback;
