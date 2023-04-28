import { useState, useRef } from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, Text, StyleSheet, Dimensions, ImageBackground, PanResponder, Animated } from 'react-native';
import { Request } from '../../../common/requests';
import Heart from '../../../common/Heart';

export interface ListCardProps {
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
  width: any;
}

const ListCard = ({id, place_name, title, rep_pic, story_like, category, preview, writer, writer_is_verified, width, navigation}: ListCardProps) => {
  //const { width, height } = Dimensions.get('screen');
  const [verified, setVerified] = useState<boolean>(writer_is_verified);
  const [like, setLike] = useState<boolean>(false);
  const request = new Request();

  const toggleLike = async () => {
    const response = await request.post('/stories/story_like/', { id: id }, null);
    setLike(!like);
  };

  const onPress = () => {
    navigation.navigate('StoryDetail', { id: id });
  }

  // writer: email로 받음
  // nickname으로 전환하는 과정 필요

  return (
    <TouchableOpacity style={{marginVertical: 8}} onPress={onPress}>
      <View style={{flexDirection: 'row'}}>
        <ImageBackground
          source={{uri: rep_pic}}
          style={{width: width*0.4, height:width*0.4}}
          imageStyle={{borderRadius: 5}}
          resizeMode='cover'
        >
          <SafeAreaView style={{width: width*0.4, height: width*0.4, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
            <View style={{marginLeft: 10, marginTop: 20, flex: 2.2}}>
              <Text style={textStyles.title}>{title}</Text>
              <Text style={textStyles.placename}>{place_name}</Text>
              <Text style={textStyles.category}>{category}</Text>
            </View>
            <View style={{flexDirection: 'row', flex: 1}}>
              <View style={{backgroundColor:'#D9D9D9', borderRadius:60, width:30, height:30, marginHorizontal: 10}} />
              <View style={{marginLeft: 70, marginTop: 5}}>
                {story_like ? (
                  <Heart like={!like} onPress={toggleLike} />
                ) : (
                  <Heart like={like} onPress={toggleLike} />
                )}
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
        <View style={{width: width*0.5, height: width*0.4, flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={textStyles.writer}>{verified ? ('Editor') : ('User')} 사슴 님의 이야기</Text>
            <View style={{backgroundColor: verified ? '#209DF5' : '#89C77F', width: 10, height: 10, borderRadius: 60, marginTop: 2}}/>
          </View>
          <Text style={textStyles.preview} numberOfLines={8} ellipsizeMode="tail">{preview}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 8,
    fontWeight: '600',
    lineHeight: 12,
    color: 'white',
  },
  placename: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    color: 'white'
  },
  category: {
    fontSize: 6,
    fontWeight: '400',
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    overflow: 'hidden',
    marginTop: 5
  },
  preview: {
    fontSize: 8,
    fontWeight: '400',
    lineHeight: 14,
    margin: 10,
  },
  writer: {
    marginHorizontal: 10,
    marginBottom: 3, 
    fontSize: 12,
    fontWeight: '600',
  }
});

export default ListCard;