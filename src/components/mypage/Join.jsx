import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView } from "react-native";

import { setNickname, setAccessToken, setRefreshToken } from '../../common/storage';


const JoinScreen = ({ navigation }) => {
    const styles = StyleSheet.create({
        input: {
            width: 294,
            height: 32,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            backgroundColor: '#FFFFFF',
            borderRadius: 3,
            shadowOffset: {
                width: 2,
                height: 4,
            },
            shadowOpacity: 0.1,
            //             box- shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        },
        errorContainer: {
            marginBottom: 10,
            marginTop: 30,
            padding: 20,
            backgroundColor: '#ee3344',
        },
        errorLabel: {
            color: '#fff',
            fontSize: 15,
            fontWeight: 'bold',
            textAlignVertical: 'center',
            textAlign: 'center',
        },
        loginButton: {
            width: 150,
            height: 40,
            borderWidth: 2,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            fontSize: 12,
            fontWeight: 500,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#44ADF7',
            ...Platform.select({
                ios: {
                    marginTop: 15,
                },
                android: {
                    marginTop: 15,
                    marginBottom: 10,
                },
            }),
        },
        signUpButton: {
            width: 300,
            height: 40,
            borderRadius: 10,
            backgroundColor: '#44ADF7',
            fontSize: 16,
            fontWeight: 600,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#44ADF7',
            ...Platform.select({
                ios: {
                    marginTop: 15,
                },
                android: {
                    marginTop: 15,
                    marginBottom: 10,
                },
            }),
        }
    });
    const [form, setForm] = useState({
        email: {
            value: '',
            type: 'textInput',
            rules: {},
            valid: false,
        },
        password: {
            value: '',
            type: 'textInput',
            rules: {},
            valid: false,
        },
    });

    updateInput = (name, value) => {
        let formCopy = form;
        formCopy[name].value = value;
        setForm(form => {
            return { ...formCopy };
        });
    };

    login = () => {
        fetch('http://127.0.0.1:8000/users/login/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: form['email'].value,
                password: form['password'].value,
            }),
        }).then(async (response) => {
            if (response.status == 200) {
                const responseData = await response.json()
                const nickname = responseData.data.nickname
                const accessToken = responseData.data.access
                const refreshToken = responseData.data.refresh
                setNickname(nickname)
                setAccessToken(accessToken)
                setRefreshToken(refreshToken)
                navigation.goBack()
            } else {
                alert('아이디 또는 비밀번호가 일치하지 않습니다.');
            }
        });
    }

    return (
        <SafeAreaView
            style={
                {
                    backgroundColor: '#FFFFFF',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center'
                }
            }
        >
            <View style={{ marginTop: 100 }}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: 600,
                    }}
                >LOG IN</Text>
            </View>
            <View style={{ marginTop: 40 }}>
                <TextInput
                    style={styles.input}
                    value={form.email.value}
                    type={form.email.type}
                    autoCapitalize={'none'}
                    keyboardType={'email-address'}
                    placeholder="E-mail"
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    onChangeText={value => updateInput('email', value)}
                />
                <TextInput
                    style={styles.input}
                    value={form.password.value}
                    type={form.password.type}
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
                    onChangeText={value => updateInput('password', value)}
                />
            </View>
            <View style={{ marginTop: 40 }}>
                <TouchableOpacity onPress={() => login()}>
                    <View style={styles.loginButton}>
                        <Text>로그인하기</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 40 }}>
                <View style={styles.signUpButton}>
                    <Text style={{ color: '#FFFFFF' }}>회원가입하기</Text>
                </View>
            </View>
        </SafeAreaView>)
}

export default JoinScreen;