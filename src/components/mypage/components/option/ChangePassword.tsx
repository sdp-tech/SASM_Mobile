import React, { useContext, useState } from 'react';
import { Platform, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView, Alert, Modal } from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import styled, { css } from 'styled-components/native';
import { StackScreenProps } from '@react-navigation/stack';
import { MyPageProps } from '../../../../pages/MyPage';
import { Request } from '../../../../common/requests';
import Arrow from "../../../../assets/img/common/Arrow.svg";
import FinishModal from '../../../../common/FinishModal';
import InputWithLabel from '../../../../common/InputWithLabel';
import { LoginContext } from '../../../../common/Context';
import { removeAccessToken, removeNickname, removeRefreshToken } from '../../../../common/storage';
import NextButton from '../../../../common/NextButton';
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

const LoginInput = styled.TextInput`
    width: 294px;
    height: 32px;
    margin: 12px;
    padding: 5px;
    borderWidth: 1px;
    background: #FFFFFF;
    border-radius: 3px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const request = new Request();

const PasswordChange = ({ navigation }: StackScreenProps<MyPageProps, 'changepw'>) => {
    const { isLogin, setLogin } = useContext(LoginContext);
    const [form, setForm] = useState<{password: string; passwordConfirm: string; }>({
        password: '',
        passwordConfirm: ''
    })
    const [finishModal, setFinishModal] = useState<boolean>(false);

    // 비밀번호 확인 체크
    let passwordCheck: boolean = false;
    if (form.password === form.passwordConfirm || form.passwordConfirm === "")
        passwordCheck = true;


    const updateNewPassword = async () => {
        if (!passwordCheck) Alert.alert('알림', '비밀번호가 일치하지 않습니다.', [{ text: '확인' }])
        else {
            const response = await request.put(`/users/pw_change/`, { password: form.password });
            if (response.status == 200) {
                logOut();
                setFinishModal(true);
            }
            else {
                Alert.alert('알림', '비밀번호 변경이 실패하였습니다.', [{ text: '확인' }])
            }
        }

    }

    const logOut = () => {
        removeAccessToken();
        removeNickname();
        removeRefreshToken();
        setLogin(false);
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#FFFFFF', flex: 1, paddingTop: 10 }}>
            <View style={{ position: 'relative', marginBottom: 30, width: '100%' }}>
                <Text style={TextStyles.title}>비밀번호 변경</Text>
                <TouchableOpacity style={{ left: 10, marginBottom: 30, position: 'absolute' }} onPress={() => { navigation.navigate('mypage') }}>
                    <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} color={'black'} />
                </TouchableOpacity>
            </View>
            <Modal visible={finishModal}>
                <FinishModal
                    navigation={() => navigation.navigate('login')}
                    setModal={setFinishModal}
                    title='비밀번호 변경 완료!'
                    subtitle={['다시 로그인해주세요']}
                />
            </Modal>
            <View style={{display:'flex', justifyContent:'center', flex:1}}>
            <InputWithLabel
                label='새로운 비밀번호'
                placeholder='새로운 비밀번호를 입력해주세요'
                isAlert={!passwordCheck}
                alertLabel='비밀번호가 동일하지 않습니다'
                secureTextEntry={true}
                onChangeText={text => setForm({ ...form, password: text })}
            />
            <InputWithLabel
                label='비밀번호 확인'
                placeholder='비밀번호를 다시 입력해주세요'
                isAlert={!passwordCheck}
                alertLabel='비밀번호가 동일하지 않습니다'
                secureTextEntry={true}
                onChangeText={text => setForm({ ...form, passwordConfirm: text })}
            />
            <NextButton label='비밀번호 변경' onPress={updateNewPassword} style={{alignSelf: 'center', marginTop: 20}} />
            </View>
        </SafeAreaView>

    )
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
export default PasswordChange;
