import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image, ImageBackground, Button, Dimensions } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { TextPretendard as Text } from '../../../common/CustomText';
import { getNickname, removeNickname, removeAccessToken, removeRefreshToken, } from '../../../common/storage';
import Arrow from '../../../assets/img/common/Arrow.svg';
import { Request } from '../../../common/requests';
import { StackScreenProps } from '@react-navigation/stack';
import { MyPageProps } from '../../../pages/MyPage';
import styled from 'styled-components/native';
import { LoginContext } from '../../../common/Context';

const StyledButton = styled.TouchableOpacity`
    height: 40px;
    border-radius: 20px;
    border: 1px #D7D7D7 solid;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px 16px;
`

export default function Options({ navigation }: StackScreenProps<MyPageProps, 'options'>) {
    const request = new Request();
    const {isLogin, setLogin} = useContext(LoginContext);

    const logOut = () => {
        removeAccessToken();
        removeNickname();
        removeRefreshToken();
        setLogin(false);
        navigation.navigate('login');
    }

    const buttonAction: { label: string, onPress?: () => void }[] = [
        {
            label: '프로필 수정',
            onPress: () => { navigation.navigate('change') }
        },
        {
            label: '비밀번호 변경',
            onPress: () => { navigation.navigate('changepw') }
        },
        {
            label: '맞춤정보 설정',
        },
        {
            label: '의견 보내기',
            onPress: () => { navigation.navigate('feedback') }
        },
        {
            label: '로그아웃',
            onPress: logOut
        }
    ]

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={{ position: 'relative', marginBottom: 30 }}>
                <TouchableOpacity style={{ left: 10, marginBottom: 30, position: 'absolute', display: 'flex', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.goBack() }}>
                    <Arrow width={20} height={20} transform={[{ rotateY: '180deg' }]} />
                    <Text style={{ fontSize: 16, lineHeight: 24, marginLeft: 16 }}>설정</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {
                    buttonAction.map((action, index) =>
                        <StyledButton onPress={action.onPress}>
                            <Text style={styles.textStyle}>{action.label}</Text>
                        </StyledButton>
                    )
                }

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    textStyle: {
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 20,
        color: '#000000',
        borderColor:'red',
    },
})