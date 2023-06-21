import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, TouchableOpacity, Alert,StyleSheet,SafeAreaView, localStorage,Image, ImageBackground, Button, Dimensions } from "react-native";
import { TextPretendard as Text } from '../../../common/CustomText';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getNickname, removeNickname, removeAccessToken, } from '../../../common/storage';
import { onChange } from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';
import PhotoOptions from '../../../common/PhotoOptions';
import ChangeForm from './ChangeForm';
import { Request } from '../../../common/requests';

const request = new Request();

  //export default ViewStyleProps;   

 
const { width } = Dimensions.get('window');
const percentUnit = width / 100; 

export default function UserInfoBox({ navigation }) {

    const [nickname, setNickname] = useState('')
    const [photo, setPhoto] = useState('');
    const [email,setEmail] = useState('');
    const [birthdate,setBirthdate] = useState('');
    const [gender,setGender] = useState('');
    const [introduction,setIntroduction] = useState('');
    const [followernum, setFollowernum] = useState();
    const [followingnum, setFollowingnum] = useState();
 

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
      console.log("프로필 이미지 : ", response.data.data.profile_image)
      setEmail(response.data.data.email);
      setBirthdate(response.data.data.birthdate);
      setPhoto(response.data.data.profile_image);
      setGender(response.data.data.gender);
      setIntroduction(response.data.data.introduction);

      const response0 = await request.get('/mypage/following/', {
        email: response.data.data.email,
        source_email: '',
      })
      const response1 = await request.get('/mypage/follower/', {
        email: response.data.data.email,
        source_email: '',
      })
      
      setFollowingnum(response0.data.data.count);
      setFollowernum(response1.data.data.count);

    }

    
    const Follow_Do_Undo = async () => {
      const response = await request.post('/mypage/follow/',{"targetEmail" : email});
      console.log("팔로우 언팔로우 : ",response)
      if(response.data.data.follows==true)
      {
        Alert.alert('알림','유저를 팔로우하였습니다.',[{text:'확인'}])
      }
      else if(response.data.data.follows==false)
      {
        Alert.alert('알림','유저를 언팔로우하였습니다.',[{text:'확인'}])
      }
    }


  /*
    useFocusEffect(useCallback(()=>{
      async function _getEmail()
      {
        setEmail(await getEmail());
      }
      _getEmail();
    },[email]))*/

    //화면에 포커스 잡힘 -> 실행됨 
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

   


      // React.js와 RN에서 화면 네비게이션 동작이 다르므로 useEffect 대신 useFocusEffect를 사용

  


  return (
      <View style={{flex : 1, backgroundColor :'white'}}>
          {nickname ? (
            <ScrollView >
              <View style={styles.sections}>
                <View style={styles.imageBox}>
                      <Image source={{ uri: photo }} style={styles.imageBackground}  />
                  </View>
                
                <View>
                  <Text style={styles.nicknameText}>    {nickname}님</Text>
                  <View style={{  flexDirection: 'row', alignItems: 'center',  marginTop: 8,}}>
                  <Text style={{fontFamily: 'inter',fontSize : 12, fontWeight : 400, fontStyle: 'normal', color:'#000000'}}>     자기소개</Text>
                  </View>
                  <View style={styles.followContainer}> 
                    <TouchableOpacity onPress={() => navigation.navigate('following')}>
                        <Text style={styles.followText}>팔로잉 </Text>
                      </TouchableOpacity>
                      <Text style={styles.followNum}>{followingnum}</Text>
                      <Text style={styles.followText}> | </Text>
                      <TouchableOpacity onPress={() => navigation.navigate('follower')}>
                        <Text style={styles.followText}>팔로워 </Text>
                      </TouchableOpacity>
                      <Text style={styles.followNum}>{followernum}</Text>
                    </View>
                </View>    
                    <View style={styles.OutdotContainer} >
                      <TouchableOpacity style={styles.IndotContainer} onPress={() => navigation.navigate('options')}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                      </TouchableOpacity>
                    </View>
                  
              </View>
              </ScrollView>
          ) : (

              <View style={styles.sections}>
                <View style={styles.mypage}>
                  <TouchableOpacity onPress={() => navigation.navigate('login')}>
                    <Text>로그인이 필요합니다.</Text>
                  </TouchableOpacity>
                  </View>
              </View>
          )}

      </View>
  )
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginTop:65,
    
  },
  text:{
      fontSize :8,
      fontWeight : "bold"

    },  sections: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#CCC',
      
    },
    mypage: {
      flex: 1,
    },
    section: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: 16,
    },
    labelWrapper: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
    },
    label: {
      width: percentUnit * 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#AAEFC2',
      borderWidth: 2,
      borderColor: 'rgba(171, 239, 194, 0.1)',
      borderRadius: 5,
      padding: percentUnit * 2,
      fontSize: percentUnit * 1,
      fontWeight: '400',
      margin: percentUnit * 2,
    },
    nicknameText: {
      
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 14,
      lineHeight: 17,
      display: 'flex',
      alignItems: 'center',
      color: '#000000',
  },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    detailContainer: {
      height: '70%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      paddingLeft: percentUnit * 5,
      paddingRight: percentUnit * 10,
    },
    imageBox: {
      marginTop: 15,
      marginLeft :8,
      marginBottom:20,
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'black',
    },
    followText: {
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 10,
      lineHeight: 12,
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
      color: '#000000',
      marginRight: 4,
    },
    followContainer: {  
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      marginLeft: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    followNum: {
      marginLeft: 4, // Adjust the spacing between the text components
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 10,
      lineHeight: 12,
      display: 'flex',
      alignItems: 'center',
      textAlign: 'right',
      color: '#000000',
      marginRight: 4,
    },
    introText: {
      marginRight: 8,
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 15,
      color: '#000000',
    },    
    IndotContainer: {
      flexDirection: 'row',
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      marginLeft: 4,
      backgroundColor: '#000000',
      },
    OutdotContainer: {
      position: 'absolute',
      top: 16,
      right: 16,
      },
});

