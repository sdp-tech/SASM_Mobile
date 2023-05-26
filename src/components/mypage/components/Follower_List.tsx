import React, {  useEffect, useState, useCallback  } from 'react';
import { Image,ImageBackground,ScrollView,Platform, Text, TouchableOpacity, View, TextInput, StyleSheet, SafeAreaView,Alert } from "react-native";
import styled, { css } from 'styled-components/native';
import { setNickname, setAccessToken, setRefreshToken } from '../../../common/storage';
import { Request } from '../../../common/requests'
import { color } from 'react-native-reanimated';
import { getNickname, removeNickname, removeAccessToken, } from '../../../common/storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';


const request = new Request;

const Follower = () =>{
    const [info, setInfo] = useState({});
  
    const [nickname, setNickname] = useState<string|boolean>()
    const [photo, setPhoto] = useState('');
    const [email,setEmail] = useState('');
    const [birthdate,setBirthdate] = useState('');
    const [followerList,setFollowerList] = useState<{ email: string, profile_image : string, nickname : string }[]>([]);
    const [searchQuery,setSearchQuery] = useState('');
 
    const logout = () => {
        removeNickname()
        removeAccessToken()
        setNickname('')
        setEmail('')
    }

    const Search = async (text: any) => {
      setSearchQuery(text);
    
      const response = await request.get('/mypage/follower/', {
        email: email,
        source_email: text,
      });
      
      
      setFollowerList(response.data.data.results);
    };
    
      const GetFollower = async () => {
          const response0 = await request.get(`/users/me/`,{},{});

          console.log("이메일 : ",response0.data.data.email);
          console.log("생년월일 : ", response0.data.data.birthdate);
          console.log("프로필 이미지 : ", response0.data.data.profile_image)
          setEmail(response0.data.data.email);
          setBirthdate(response0.data.data.birthdate);
          setPhoto(response0.data.data.profile_image);
        
        const response = await request.get('/mypage/follower/',{
            email: response0.data.data.email,
            source_email : "",
          });
          console.log("팔로잉 리스트 : ",response.data.data.results);
         setFollowerList(response.data.data.results)
    }

    useFocusEffect(
        useCallback(() => {
            async function _getNickname() {
                setNickname(await getNickname());
            }
            _getNickname();
            
            GetFollower();

          }, [nickname]))
  
    return (
      <SafeAreaView style={{flex : 1,backgroundColor :'white'}}>
          <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputContainer}>
              <TextInput
                placeholder="검색"
                value={searchQuery}
                onChangeText={Search}
                style ={styles.searchStyle}
              />
              <View style={styles.iconContainer}></View>
              </View>

                {followerList.map((user) => (
                  <View  style={styles.userContainer}>
                    <Image source={{uri: user.profile_image}} style={styles.profileImage} />
                    <View style={styles.userInfo}>
                      <Text style={styles.username}>{user.nickname}</Text>
                      <Text style={styles.username}>{user.email}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>      
    </SafeAreaView>)
  }
  
  
const styles = StyleSheet.create({
    
    text:{
        fontSize :8,
        fontWeight : "bold"
      },
      iconContainer: {
        position: 'absolute',
        right: 10,
        top: 6,
        bottom: 8,
        justifyContent: 'center',
      },
      container: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC',
      },
      userContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
      },
      username: {
        fontSize: 16,
      },
      searchStyle: {
        width: 390,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#EEEEEE',
        paddingHorizontal: 10,
        fontSize : 12,
        fontFamily : 'Inter',
        
      },
      profileImage: {
        width: 40,
        height: 40,
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
      },
      inputContainer: {
        marginBottom: 20,
      },
      userInfo: {
        marginLeft: 10,
      },
  });
  
  

  export default Follower;
  