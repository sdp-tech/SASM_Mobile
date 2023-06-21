import { useState, useRef } from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, PanResponder, Animated } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { Request } from '../../../common/requests';
import Heart from '../../../common/Heart';

interface ListCardProps {
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

const ListCard = ({id, place_name, title, rep_pic, story_like, category, preview, writer, nickname, writer_is_verified, navigation}: ListCardProps) => {
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

  return (
    <TouchableOpacity style={{marginBottom: 15, width: width*0.84}} onPress={onPress}>
      <View style={{flexDirection: 'row'}}>
        <ImageBackground
          source={{uri: rep_pic}}
          style={{width: width*0.4, height:width*0.4}}
          imageStyle={{borderRadius: 5}}
          resizeMode='cover'
        >
          <SafeAreaView style={{width: width*0.4, height: width*0.4, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', paddingHorizontal: 10, paddingVertical: 10}}>
            <View style={{flexDirection: 'row', flex: 2}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={textStyles.category}>{category}</Text>
              </View>
              <View>
                {story_like ? (
                  <Heart like={!like} onPress={toggleLike} white={true} />
                ) : (
                  <Heart like={like} onPress={toggleLike} white={true} />
                )}
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{backgroundColor: verified ? '#209DF5' : '#89C77F', width: 7, height: 7, borderRadius: 60, marginTop: 2}}/>
              <Text style={[textStyles.writer, {color: verified ? '#209DF5' : '#89C77F'}]}>{verified ? ('Editor') : ('User')}</Text>
              <Text style={textStyles.writer}>{nickname}</Text>
              <Text></Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
        <View style={{width: width*0.44, height: width*0.4}}>
          <Text style={textStyles.title}>{title}</Text>
          <Text style={textStyles.placename}>{place_name}</Text>
          <Text style={textStyles.preview} numberOfLines={8} ellipsizeMode="tail">{preview}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    marginLeft: 10
  },
  placename: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginLeft: 10
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
    margin: 10
  },
  writer: {
    marginLeft: 2,
    marginBottom: 3, 
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
    color: 'white'
  }
});

export default ListCard;