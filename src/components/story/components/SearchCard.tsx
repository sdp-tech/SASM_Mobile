import { useState, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions, Alert } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import styled from 'styled-components';
import { Request } from '../../../common/requests';
import Heart from '../../../common/Heart';

interface SearchCardProps {
  id: number;
  place_name: string;
  rep_pic: string;
  extra_pics: any;
  story_like: boolean;
  title: string;
  category: string;
  preview: string;
  writer: string;
  nickname: string;
  created: string;
  writer_is_verified: boolean;
  isLogin: boolean;
  navigation: any;
}

const SearchCard = ({id, place_name, title, rep_pic, extra_pics, story_like, category, preview, writer, nickname, created, writer_is_verified, isLogin, navigation} : SearchCardProps) => {
  const { width, height } = Dimensions.get('screen');
  const [like, setLike] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(writer_is_verified);
  const request = new Request();

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
                onPress: () => navigation.navigate('Login'),

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
    <View style={{flex: 1, width: width-30, marginBottom: 30}}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[textStyles.writer, {color: verified ? '#209DF5' : '#67D393', flex: 1}]}>{nickname}</Text>
        <Text style={textStyles.date}>{created.slice(0, 10)} 작성</Text>
      </View>
      <TouchableOpacity style={{marginTop: 5}} onPress={onPress}>
        <View style={{flexDirection: 'row'}}>
          <ImageBackground 
            source={{uri: rep_pic}}
            style={{width: width*0.57, height: width*0.7}}
          >
            <View style={{width: width*0.57, height: width*0.7, backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: 15}}>
              <View style={{flex: 1}}>
                  <Text style={textStyles.title}>{title}</Text>
                  <Text style={textStyles.placename}>{place_name}</Text>
              </View>
              <Text style={textStyles.preview} numberOfLines={6} ellipsizeMode={'tail'}>{preview}</Text>
            </View>
          </ImageBackground>
          <View style={{marginLeft: 8}}>
            { extra_pics.length > 0 ? (
              <>
              <ImageBackground 
                source={{uri: extra_pics[0]}}
                style={{width: width*0.34, height: width*0.34, alignItems: 'flex-end', padding: 10, marginBottom: 8}}
              >
                  {story_like ? (
                    <Heart like={!like} onPress={toggleLike} white={true} />
                  ) : (
                    <Heart like={like} onPress={toggleLike} white={true} />
                  )}
              </ImageBackground>
              <Image 
                source={{uri: extra_pics[1]}}
                style={{width: width*0.34, height: width*0.34}}
              />
              </>
            ) : (
              <>
              <View style={{width: width*0.34, height: width*0.34, marginBottom: 8, backgroundColor: '#D9D9D9', alignItems: 'flex-end', padding: 10}}>
                  {story_like ? (
                    <Heart like={!like} onPress={toggleLike} white={true} />
                  ) : (
                    <Heart like={like} onPress={toggleLike} white={true} />
                  )}
              </View>
              <View style={{width: width*0.34, height: width*0.34, backgroundColor: '#D9D9D9'}} />
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: 'white',
    marginBottom: 5
  },
  placename: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: 'white'
  },
  preview: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: 'white'
  },
  writer: { 
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 10,
    fontWeight: '400',
    color: '#676767',
  }
});

export default SearchCard;