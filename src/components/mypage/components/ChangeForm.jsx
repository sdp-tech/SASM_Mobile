import React, { useEffect, useState, useCallback } from 'react';
import { Dimensions ,ImageBackground, ScrollView, View, TouchableOpacity, Alert,StyleSheet,SafeAreaView, localStorage,Image, Switch } from "react-native";
import { TextPretendard as Text } from '../../../common/CustomText';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getNickname, removeNickname, removeAccessToken, getEmail } from '../../../common/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import PhotoOptions, { PhotoSelector } from '../../../common/PhotoOptions';
import { Request } from '../../../common/requests';
import { TextInput } from 'react-native-gesture-handler';
import styled, { css } from 'styled-components/native';
           
const { width } = Dimensions.get('window');
const percentUnit = width / 100; 

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
 
  const formData = new FormData();
  const [nickname, setNickname] = useState('')
  const [nick, setNick] = useState('')
  const [changednick,setChangednick] = useState('');

  const [photo, setPhoto] = useState('');
  const [email,setEmail] = useState('');
  const [birthdate,setBirthdate] = useState('');
  
  const [newphoto,setNewphoto] = useState('');
  const [gender,setGender] = useState('');
  const [followernum, setFollowernum] = useState();
  const [followingnum, setFollowingnum] = useState();
  const [text,setText] = useState('');
  
  const TextChange = (newText) =>{
    setText(newText)
  }

  const logout = () => {
      removeNickname()
      removeAccessToken()
      setNickname('')
      setEmail('')
  }
  const getUserinfo = async () => {
    const response = await request.get(`/mypage/me/`,{},{});
    console.log("응답 : ",response);
    console.log("이메일 : ",response.data.data.email);
    console.log("생년월일 : ", response.data.data.birthdate);
    console.log("프로필 사진 : ", response.data.data.profile_image)
    console.log("성별", response.data.data.gender)

    setChangednick(response.data.data.nickname)
    setEmail(response.data.data.email);
    setBirthdate(response.data.data.birthdate)
    setPhoto(response.data.data.profile_image)
    setGender(response.data.data.gender)
    const response0 = await request.get('/mypage/following/', {
      email: response.data.data.email,
      search_email: '',
    })
    const response1 = await request.get('/mypage/follower/', {
      email: response.data.data.email,
      search_email: '',
    })
    //console.log("*******",newphoto[0].uri)
    //setPhoto(newphoto[0].uri)
    setFollowingnum(response0.data.data.count);
    setFollowernum(response1.data.data.count);

  }
  const SaveInfo = async () =>{

    //변경된 정보 post
    console.log("닉네임 : ",changednick);
    console.log("생년월일 : ", birthdate);
    // //console.log("프로필 사진 : " , newphoto[0].uri)
    // console.log("성별 : ", gender)
    //   // console.log(file);
    //   //setPhoto(newphoto[0].uri)
      
    // // var changephoto = {
    // //   uri: newphoto[0].uri,
    // //   name: newphoto[0].fileName,
    // //   type: 'image/jpeg/png',
    // // }
    // //formData.append('nickname',changednick)
    // //formData.append('birthdate', birthdate);
    // //formData.append('profile_image',changephoto)
    // //formData.append('gender', gender)
    console.log(formData);
    /*const response = await request.post('/users/me/',{nickname:changednick,birthdate:birthdate,profile_image:{
      uri: newphoto[0].uri,
      name: newphoto[0].fileName,
      type: 'image/jpeg/png',}});*/

  }

  const handleButtonPress = async (selectedGender) => {
    setGender(selectedGender);

    if (newphoto && newphoto[0] && newphoto[0].uri) {
      setPhoto(newphoto[0].uri);
    }
    formData.append('gender', gender);
    if(changednick != nick){
      formData.append('nickname', nick);
      }

    formData.append('birthdate', birthdate);
    formData.append('profile_image',  
    {
       uri: photo,
       type: photo.endsWith('.jpg')?'image/jpeg':'image/png',
       name: photo,
     }
    )
                             
    const response = await request.patch('/mypage/me/update/',formData, {"Content-Type": "multipart/form-data"} );
    console.log("변경됨 ",response);

    
    navigation.navigate('mypage');
  
  };

    useFocusEffect(
      useCallback(() => {
         // Do someth2ing when the screen is focused
         async function _getNickname() {
          setNickname(await getNickname());
      }
      _getNickname();
      getUserinfo();
  }, [nickname]))
   
      
  
  return (
    <View style={{flex : 1, backgroundColor :'white'}}>
    {nickname ? (
      <ScrollView >
        <View style={styles.container}>
        <View style={styles.followContainer}> 
                  
          <View style={styles.imageBox}>         
            <Image source={{ uri: photo }} style={styles.imageBackground}>
                </Image>         
              </View>
  
            <TouchableOpacity style={styles.imageBox}>
            <PhotoSelector max={1} width={90} height={90} setPhoto={setNewphoto}>
              {/* {(data)=>(setPhoto(data[0].uri))} */}
            </PhotoSelector>
            </TouchableOpacity>    
          </View>
          <Text style={styles.nicknameText}>  {changednick}님</Text>
          
          <View style={styles.userContainer}>
          <TextInput style={styles.textInput} 
          placeholder="소개 쓰기" value={text} onChangeText={TextChange}/>
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
              <View style={styles.followContainer}>
                <Text style={styles.Text}>이름       </Text>
                <TextInput style={styles.Text} placeholder={changednick} value={nick}
                onChangeText={(text)=>{setNick(text)}}/>
             
             
              </View>
              <View style={styles.followContainer}>
                <Text style={styles.Text}>성별        </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => handleButtonPress('male')}
                    >
                      <Text style={[styles.Text, gender === 'male' 
                      && styles.selectedButton]}>남</Text>
                    </TouchableOpacity>
                    <Text style={styles.Text}> / </Text>
                    <TouchableOpacity
                      onPress={() => handleButtonPress('female')}
                    >
                      <Text style={[styles.Text, gender === 'female'
                       && styles.selectedButton]}>여</Text>
                    </TouchableOpacity>
                    <Text style={styles.Text}> / </Text>
                    <TouchableOpacity
                      onPress={() => handleButtonPress('other')}
                    >
                      <Text style={[styles.Text, gender === 'other' 
                      && styles.selectedButton]}>기타</Text>
                    </TouchableOpacity>
                  </View>
              </View>
              <View style={styles.followContainer}>
                <Text style={styles.Text}>생년월일</Text>
                <TextInput style={styles.Text} placeholder={birthdate} value={birthdate} 
                onChangeText={(text)=>{setBirthdate(text)}}/>
              </View>

              <TouchableOpacity
                      onPress={()=>{SaveInfo()}}
                    >
                      <Text style={styles.Text}>확인</Text>
                    </TouchableOpacity>
          </View>

              <View style={styles.OutdotContainer} >
                <TouchableOpacity style={styles.IndotContainer} onPress={() => navigation.navigate('options')}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </TouchableOpacity>
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
  smallSquareButton: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    marginLeft: 5,
  },
imageBackground: {
flex: 1,
resizeMode: 'cover',
},
textInput: {
  width: '100%',
  height: '100%',
  fontSize: 12,
  fontFamily: 'Inter',
  fontWeight: '500',
  color: '#949494',

},
container: {
flex: 1,
backgroundColor: 'white',
padding: 10,
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},
text:{
fontSize :8,
fontWeight : "bold"

},  sections: {
flexDirection: 'row',
alignItems: 'center',
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
marginTop : 20,
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
marginTop: 10,
marginLeft :10,
width: 100,
height: 100,
borderRadius: 50,
overflow: 'hidden',
borderWidth: 1,
borderColor: 'black',
},
userContainer: {
  position: 'relative',
  flexDirection: 'row',
  paddingHorizontal: 3,
  paddingVertical: 5,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
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
Text: {
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '400',
  fontSize: 10,
  lineHeight: 12,
  display: 'flex',
  alignItems: 'center',
  color: '#000000',
  marginRight: 4,
  },
followContainer: {  
flexDirection: 'row',
alignItems: 'center',
marginTop: 10,
marginLeft: 3,
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
button: {
  width: 100,
  height: 40,
  backgroundColor: 'lightgray',
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 10,
},
selectedButton: {
  backgroundColor: 'red',
},
buttonText: {
  fontSize: 16,
  color: 'black',
},

});

