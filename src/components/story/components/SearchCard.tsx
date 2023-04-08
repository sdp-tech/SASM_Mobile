import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components';
import { Request } from '../../../common/requests';
import Loading from '../../../common/Loading';
import Heart from '../../../common/Heart';
import { useNavigation } from '@react-navigation/native';

interface SearchCardProps {
  id: number;
  place_name: string;
  rep_pic: string;
  story_like: boolean;
  title: string;
  category: string;
  preview: string;
  writer: string;
  writer_is_verified: boolean;
  navigation: any;
}

const { width, height, fontScale } = Dimensions.get('screen');

const SearchCard = ({id, place_name, title, rep_pic, story_like, category, preview, writer, writer_is_verified, navigation} : SearchCardProps) => {
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
    <View style={{alignItems:'center'}}>
      <View style={{flexDirection: 'row'}}>
        { verified ? (
          <View style={{backgroundColor: '#209DF5', borderRadius: 10, width: 120, height: 25, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={textStyles.writer}>Editor {writer} 님의 이야기</Text>
          </View>
        ): (
          <View style={{backgroundColor: '#89C77F', borderRadius: 10, width: 120, height: 25, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={textStyles.writer}>User 사슴{writer} 님의 이야기</Text>
          </View>
        )}
        <View style={{marginLeft: 160}}>
          {story_like ? (
            <Heart like={!like} onPress={toggleLike} />
          ) : (
            <Heart like={like} onPress={toggleLike} />
          )}
        </View>
      </View>
      <TouchableOpacity style={{marginTop: 5, marginBottom: 20}} onPress={onPress}>
        <View style={{flexDirection: 'row'}}>
          <ImageBackground 
            source={{uri: rep_pic}}
            style={{width: width*0.5, height: width*0.53}}
            imageStyle={{borderRadius: 5}}
          >
            <View style={{width: width*0.5, height: width*0.53, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
              <View style={{marginLeft: 15}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={textStyles.placename}>{place_name}</Text>
                  <Text style={textStyles.address}>서울특별시 마포구 양화로 6길 60 1층</Text>
                </View>
                <Text style={textStyles.title}>{title}</Text>
                <Text style={textStyles.preview} numberOfLines={3} ellipsizeMode={'tail'}>{preview}</Text>
              </View>
            </View>
            <View style={{position: 'absolute', marginTop: 185, marginLeft: 10}}>
              <Text style={textStyles.tag}>#{category}</Text>
            </View>
          </ImageBackground>
          <View style={{marginHorizontal: 10}}>
            <Image 
              source={{uri: rep_pic}}
              style={{width: width*0.25, height: width*0.25, borderRadius: 5, marginBottom: 10}}
            />
            <Image 
              source={{uri: rep_pic}}
              style={{width: width*0.25, height: width*0.25, borderRadius: 5}}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const textStyles = StyleSheet.create({
  placename: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white',
    marginTop: 20,
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    color: 'white',
    marginVertical: 7,
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
    color: 'white', 
    fontSize: 10,
    fontWeight: '600',
  }
});

export default SearchCard;