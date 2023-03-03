import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';


import { getNickname, removeNickname, removeAccessToken } from '../../../common/storage';

export default function UserInfoBox({ navigation }) {
    const [nickname, setNickname] = useState('')

    const logout = () => {
        removeNickname()
        removeAccessToken()
        setNickname('')
    }

    // React.js와 RN에서 화면 네비게이션 동작이 다르므로 useEffect 대신 useFocusEffect를 사용
    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused
            async function _getNickname() {
                setNickname(await getNickname());
            }
            _getNickname();
            // return () => {
            //     // Do something when the screen is unfocused
            //     // Useful for cleanup functions
            // };
        }, [nickname])
    )


    return (
        <View>
            {nickname ? (
                <View>
                    <Text>{nickname}님 안녕하세요.</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 8 }} onPress={() => logout()}>
                        <View style={{ backgroundColor: 'gray', padding: 4 }}>
                            <Text style={{ color: 'white' }}>로그아웃</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('login')}>
                        <Text>로그인이 필요합니다.</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    )
}