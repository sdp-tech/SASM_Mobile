import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, Pressable, Alert } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { Request } from '../../../common/requests';
import Heart from '../../../common/Heart';

export interface MainCardProps {
  id: number;
  place_name: string;
  rep_pic: string;
  story_like: boolean;
  title: string;
  category: string;
  preview: string;
  summary: string;
  writer: string;
  nickname: string;
  profile: string;
  writer_is_verified: boolean;
  isLogin: boolean;
  navigation: any;
}

const MainCard = ({id, place_name, title, rep_pic, story_like, category, preview, summary, writer, nickname, profile, writer_is_verified, isLogin, navigation}: MainCardProps) => {
  const { width, height } = Dimensions.get('window');
  const [verified, setVerified] = useState<boolean>(writer_is_verified);
  const [like, setLike] = useState<boolean>(false);
  const request = new Request();

  useEffect(()=> {
    story_like ? setLike(true) : setLike(false)
  }, [story_like])

  const toggleLike = async () => {
    if(isLogin){
      const response = await request.post(`/stories/${id}/story_like/`);
      setLike(!like);
    } else {
      Alert.alert(
        "로그인이 필요합니다.",
        "로그인 항목으로 이동하시겠습니까?",
        [
            {
                text: "이동",
                onPress: () => navigation.navigate('마이페이지'),

            },
            {
                text: "취소",
                onPress: () => { },
                style: "cancel"
            },
        ],
        { cancelable: false }
      );
    }
  };

  const onPress = () => {
    navigation.navigate('StoryDetail', { id: id });
  }

  return (
    <View style={{width: width, overflow: 'hidden', height: width*0.85+140}}>
    <Image source={{uri: rep_pic}} resizeMode='cover' style={{position: 'absolute', borderTopLeftRadius: 5, top: 50, left: 0, width: width*0.6, height: width*0.6, opacity: 0.3}} />
    <Image source={{uri: rep_pic}} resizeMode='cover' style={{position: 'absolute', borderTopRightRadius: 5, top: 50, right: 0, width: width*0.6, height: width*0.6, opacity: 0.3}} />
    <View style={{position: 'absolute', borderBottomLeftRadius: 5, top: 50+width*0.6, left: 0, width: 30, height: width*0.2, opacity: 0.3, backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 5}}}/>
    <View style={{position: 'absolute', borderBottomLeftRadius: 5, top: 50+width*0.6, right: 0, width: 30, height: width*0.2, opacity: 0.3, backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 5}}}/>
    <Pressable style={{alignSelf: 'center'}} onPress={onPress}>
      <ImageBackground
        source={{uri: rep_pic}}
        style={{width: width*0.9, height:width*0.85}}
        imageStyle={{borderTopLeftRadius: 5, borderTopRightRadius: 5}}
        resizeMode='cover'
      >
        <View style={{width: width*0.9, height: width*0.85, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', flexDirection: 'row'}}>
          <View style={{flex: 1, marginLeft: 20, marginTop: 30}}>
            <Text style={textStyles.title}>{title}</Text>
            <Text style={textStyles.placename}>{place_name}</Text>
          </View>
          <View style={{marginRight: 20, marginTop: 30}}>
            <Heart like={like} onPress={toggleLike} color="white" size={20} />
          </View>
        </View>
      </ImageBackground>
      <View style={{width: width*0.9, height: 130, borderBottomRightRadius:5, borderBottomLeftRadius: 5, backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4}, paddingVertical: 20, paddingHorizontal: 25}}>
        <Text numberOfLines={4} ellipsizeMode={'tail'} style={textStyles.preview}>{summary}</Text>
      </View>
      <View style={{position:'absolute', top: width*0.76, marginLeft: width*0.74, width: 50, alignItems: 'center'}}>
        <Image source={{uri: profile}} style={{borderRadius:60, backgroundColor: 'white', width:50, height:50, marginBottom: 5}} />
        <Text style={[textStyles.writer, {color: verified ? '#209DF5' : '#67D393'}]}>{nickname}</Text>
      </View>
    </Pressable>
    </View>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 5,
    letterSpacing: -0.6,
  },
  placename: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white'
  },
  preview: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.6,
    marginTop: 20
  },
  writer: {
    fontSize: 12,
    fontWeight: '600',
  }
});

export default MainCard;