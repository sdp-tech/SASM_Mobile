import { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { Request } from '../../../common/requests';
import CardView from '../../../common/CardView';
import Heart from '../../../common/Heart';

interface MainCardProps {
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

const MainCard = ({id, place_name, title, rep_pic, story_like, category, preview, writer, writer_is_verified, navigation}: MainCardProps) => {
  const { width, height } = Dimensions.get('screen');
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
  // 그동안 등록된 스토리는 writer, verified field 모두 null

  return (
        <TouchableOpacity style={{marginHorizontal: 8}} onPress={onPress}>
          <ImageBackground
            source={{uri: rep_pic}}
            style={{width: width*0.6, height:width*0.6}}
            imageStyle={{borderRadius: 5}}
            resizeMode='cover'
          >
            <SafeAreaView style={{width: width*0.6, height: width*0.6, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
              <View style={{alignSelf: 'flex-end', marginRight: 10, marginTop: 10}}>
                {story_like ? (
                  <Heart like={!like} onPress={toggleLike} />
                ) : (
                  <Heart like={like} onPress={toggleLike} />
                )}
              </View>
              <View style={{marginLeft: 10}}>
                <Text style={textStyles.title}>{title}</Text>
                <Text style={textStyles.placename}>{place_name}</Text>
                <Text style={textStyles.category}>{category}</Text>
              </View>
            </SafeAreaView>
          </ImageBackground>
          { verified ? (
            <View style={{position: 'absolute', top: width*0.58, width: width*0.6, height: 100, borderRadius:5, backgroundColor: '#209DF5'}}>
              <Text style={textStyles.writer}>Editor {writer} 님의 이야기</Text>
              <View style={{backgroundColor: 'rgba(255, 255, 255, 0.3)', alignSelf: 'center', height: 65, borderRadius:5, width: width*0.55, marginTop: 2}}>
                <Text style={textStyles.preview}>{preview}</Text>
              </View>
            </View>
          ): (
            <View style={{position: 'absolute', top: width*0.58, width: width*0.6, height: 100, borderRadius:5, backgroundColor: '#89C77F'}}>
              <Text style={textStyles.writer}>User 사슴{writer} 님의 이야기</Text>
              <View style={{backgroundColor: 'rgba(255, 255, 255, 0.3)', alignSelf: 'center', height: 65, borderRadius:5, width: width*0.55, marginTop: 2}}>
                <Text style={textStyles.preview}>{preview}</Text>
              </View>
            </View>
          )}
          <View style={{position:'absolute', backgroundColor:'#D9D9D9', borderRadius:60, width:35, height:35, marginTop:213, marginLeft: 185}} />
        </TouchableOpacity>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    color: 'white',
    marginBottom: 3,
  },
  placename: {
    fontSize: 16,
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
    fontWeight: '500',
    lineHeight: 14,
    margin: 10
  },
  writer: {
    marginHorizontal: 10,
    marginTop: 10, 
    marginBottom: 3, 
    color: 'white', 
    fontSize: 10,
    fontWeight: '600',
  }
});

export default MainCard;