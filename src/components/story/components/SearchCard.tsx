import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components';
import { Request } from '../../../common/requests';
import Loading from '../../../common/Loading';
import Heart from '../../../common/Heart';

interface SearchCardProps {
  id: number;
  place_name: string;
  rep_pic: string;
  story_like: boolean;
  title: string;
  category: string;
  preview: string;
  writer: string;
  nickname: string;
  writer_is_verified: boolean;
  navigation: any;
}

const SearchCard = ({id, place_name, title, rep_pic, story_like, category, preview, writer, nickname, writer_is_verified, navigation} : SearchCardProps) => {
  const { width, height } = Dimensions.get('screen');
  const [like, setLike] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(writer_is_verified);
  const request = new Request();

  const toggleLike = async () => {
    const response = await request.post('/stories/story_like/', { id: id }, null);
    setLike(!like);
  };

  const onPress = () => {
    navigation.navigate('StoryDetail', { id: id });
  }
    
  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flexDirection: 'row', flex: 4}}>
          <Text style={textStyles.writer}>{verified ? ('Editor') : ('User')} {nickname} 님의 이야기</Text>
          <View style={{backgroundColor: verified ? '#209DF5' : '#89C77F', width: 14, height: 14, borderRadius: 60, marginTop: 1, marginLeft: 5}}/>
        </View>
        <View style={{flex: 1}}>
          <Text style={textStyles.date}>2023.4.5 작성</Text>
        </View>
      </View>
      <TouchableOpacity style={{marginTop: 10, marginBottom: 20}} onPress={onPress}>
        <View style={{flexDirection: 'row'}}>
          <ImageBackground 
            source={{uri: rep_pic}}
            style={{width: width*0.55, height: width*0.6}}
            imageStyle={{borderRadius: 5}}
          >
            <View style={{width: width*0.55, height: width*0.6, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: 10}}>
              <View style={{flexDirection: 'row', padding: 8, flex: 1}}>
                <View style={{width: '70%'}}>
                  <Text style={textStyles.title}>{title}</Text>
                  <Text style={textStyles.placename}>{place_name}</Text>
                </View>
                <View style={{marginLeft: 35}}>
                  {story_like ? (
                    <Heart like={!like} onPress={toggleLike} white={true} />
                  ) : (
                    <Heart like={like} onPress={toggleLike} white={true} />
                  )}
                </View>
              </View>
              <Text style={textStyles.preview} numberOfLines={6} ellipsizeMode={'tail'}>{preview}</Text>
            </View>
          </ImageBackground>
          <View style={{marginLeft: 7}}>
            <Image 
              source={{uri: rep_pic}}
              style={{width: width*0.27, height: width*0.29, borderRadius: 5, marginBottom: 7}}
            />
            <Image 
              source={{uri: rep_pic}}
              style={{width: width*0.275, height: width*0.29, borderRadius: 5}}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    color: 'white',
    marginBottom: 5
  },
  placename: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white'
  },
  tag: {
    fontSize: 8,
    fontWeight: '400',
    color: 'white',
  },
  preview: {
    fontSize: 8,
    fontWeight: '500',
    lineHeight: 14,
    color: 'white'
  },
  address: {
    fontSize: 6,
    fontWeight: '400',
    lineHeight: 7,
    color: 'white',
    marginLeft: 2,
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  writer: { 
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 10,
    fontWeight: '400',
    color: '#676767'
  }
});

export default SearchCard;