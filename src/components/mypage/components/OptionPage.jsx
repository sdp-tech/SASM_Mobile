import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, TouchableOpacity, Alert,StyleSheet,SafeAreaView, localStorage,Image, ImageBackground, Button, Dimensions } from "react-native";
import { TextPretendard as Text } from '../../../common/CustomText';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getNickname, removeNickname, removeAccessToken, removeRefreshToken, } from '../../../common/storage';
import { onChange } from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';
import PhotoOptions from '../../../common/PhotoOptions';
import ChangeForm from './ChangeForm';
import { Request } from '../../../common/requests';

export default function Options({ navigation }) {
    const request = new Request();
    
    const logOut = () => {
        removeAccessToken();
        removeNickname();
        removeRefreshToken();
        navigation.navigate('login');
    }
    
    return (
            <ScrollView style={{flex:1, backgroundColor:'white'}}>
            <SafeAreaView style={{ padding: '6%' }}>
                <View style={{ marginBottom: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('change')} style={styles.button}>
                    <View style={styles.buttonContainer}>
                    <Text style={styles.textStyle}>프로필 수정</Text>
                    </View>
                </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('changepw')} style={styles.button}>
                    <View style={styles.buttonContainer}>
                    <Text style={styles.textStyle}>비밀번호 변경</Text>
                    </View>
                </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 10 }}>
                <TouchableOpacity style={styles.button}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.textStyle}>맞춤정보 설정</Text>
                </View>
                </TouchableOpacity>
                </View>

                <View style={{ marginTop: 50 }}>
                <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('feedback')}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.textStyle}>의견 보내기</Text>
                </View>
                </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                <TouchableOpacity style={styles.button} onPress={logOut}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.textStyle}>로그아웃</Text>
                </View>
                </TouchableOpacity>
                </View>
            </SafeAreaView>
            </ScrollView>



      );
    };

    const styles = StyleSheet.create({
        button : {
            width: '100%',
            height: 40,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: '#D9D9D9',
            borderRadius: 30,
            backgroundColor : 'white',
            
        },
        textStyle: {
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: 12,
            lineHeight: 15,
            textAlign: 'center',
            color: '#000000',
            
          },
          buttonContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding:10,
          },
})