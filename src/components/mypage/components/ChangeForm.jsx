import React, { useEffect, useState, useCallback } from 'react';
import { ImageBackground,Text, ScrollView, View, TouchableOpacity, Alert,StyleSheet,SafeAreaView, localStorage,Image } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getNickname, removeNickname, removeAccessToken, getEmail } from '../../../common/storage';
import { onChange } from 'react-native-reanimated';
import logo from '../../../assets/img/sasm_logo.png';
import { launchImageLibrary } from 'react-native-image-picker';
import editimage from '../../../assets/img/Edit_profileimage.png';
import PhotoOptions from '../../../common/PhotoOptions';
import ChangeForm from './ChangeForm';
import { Request } from '../../../common/requests';
import { TextInput } from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';

const request = new Request();

const FeedbackBox = styled.TextInput`
width: 350px;
    height: 100px;
    margin: 12px;
    padding: 5px;
    borderWidth: 1px;
    background: #FFFFFF;
    border-radius: 3px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);`;

  //export default ViewStyleProps;   

export default function UserInfoBox({ navigation }) {

   
  const [nickname, setNickname] = useState('')
  const [photo, setPhoto] = useState('');
  const [email,setEmail] = useState('');
  const [birthdate,setBirthdate] = useState('');

  const logout = () => {
      removeNickname()
      removeAccessToken()
      setNickname('')
      setEmail('')
  }
  const getUserinfo = async () => {
    const response = await request.get(`/users/me/`,{},{});
    console.log("응답 : ",response);
    console.log("이메일 : ",response.data.data.email);
    console.log("생년월일 : ", response.data.data.birthdate);
    setEmail(response.data.data.email);
    setBirthdate(response.data.data.birthdate)
    setPhoto(response.data.data.profile_image)
    
  }
  const SaveInfo = async () =>{
    console.log("***이건 생년월일 변경된 정보", birthdate)
    const response = await request.post('users/me/',birthdate);
    console.log(response);

  }

    const handleChoosePhoto = () => {
      launchImageLibrary({ noData: true }, (response) => {
        // console.log(response);
        if (response) {
          console.log('bbbb',response)
          setPhoto(response.uri);
          console.log('aaaaa', photo,'bbbb');
        }
      });
    };
  
    useFocusEffect(
      useCallback(() => {
          // Do someth2ing when the screen is focused
          async function _getNickname() {
              setNickname(await getNickname());
          }
          _getNickname();
          getUserinfo();
          // return () => {
          //     // Do something when the screen is unfocused
          //     // Useful for cleanup functions
          // };
      }, [nickname]))
      
      
  
    const handleUploadPhoto = () => {
//      const response = await request.post("/users/me/",photo );
    };


  return (
      <View>
          {nickname ? (
              <View>
                  
                  
                <ScrollView>

                  <View>
                    <ImageBackground source={{uri:photo}} style={styles.circle}/>
                    </View >    

                    <TouchableOpacity onPress={handleChoosePhoto}>
                      <Image source={editimage} ></Image>
                    </TouchableOpacity>
                    
                    <Text>{nickname}님</Text>
                        <SafeAreaView style={{padding:'1%', flexDirection:'row'}}>
                        <View style={styles.oval}><Text>이메일</Text></View>                        
                        <View style={styles.rectangle}><Text style={{fontSize:7}}>{email}</Text></View>
                      
                      </SafeAreaView>

                      <SafeAreaView style={{padding:'1%', flexDirection:'row'}}>
                        <View style={styles.oval}><Text>닉네임</Text></View>
                        <FeedbackBox placeholder={nickname}/>
                        </SafeAreaView>

                      <SafeAreaView style={{padding:'1%', flexDirection:'row'}}>
                        <View style={styles.oval}><Text>생년월일</Text></View>
                         <TextInput type="date"
                      max="9999-12-31"
                      defaultValue={birthdate}
                      onChangeText={(event) => {
                        setBirthdate(event
                        );
                      }}
                    name="birthdate" />
                        </SafeAreaView>


                        <TouchableOpacity onPress={async()=>await SaveInfo()}>
                          <View style={styles.oval0}><Text style={styles.text}>저장하기</Text></View>
                        </TouchableOpacity>

                    </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginTop:65,
  },
  circle: {
      
      width: 150,
      height: 150,
      borderRadius: (150/2),
      backgroundColor: "white",
      margin : '5%',
    },
    oval: {
      width: 40,
      height: 20,
      borderRadius: 100,
      backgroundColor: "#AAEFC2",
      transform: [{ scaleX: 2 }],
      margin : '8%',
      flexDirection : 'row',
  },
  oval0: {
      width: 50,
      height: 20,
      borderRadius: 100,
      backgroundColor: "pink",
      transform: [{ scaleX: 2 }],
      margin : '10%',
      flexDirection : 'row',
  },
  rectangle: { 
      width: 20 * 2,
      height: 20,
      backgroundColor: "#d3d3d3",
      transform: [{ scaleX: 2 }],
      margin : '8%',
      flexDirection : 'row',
    },
    text:{
      fontSize :8,
      fontWeight : "bold"

    }

});
