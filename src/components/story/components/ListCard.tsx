import { useState, useRef } from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, PanResponder, Animated } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { Request } from '../../../common/requests';
import Heart from '../../../common/Heart';

interface ListCardProps {
  id: number;
  place_name: string;
  rep_pic: string;
  extra_pics: any;
  story_like: boolean;
  title: string;
  preview: string;
  writer: string;
  nickname: string;
  created: string;
  writer_is_verified: boolean;
  navigation: any;
}

const ListCard = ({id, place_name, title, rep_pic, extra_pics, story_like, created, preview, writer, nickname, writer_is_verified, navigation}: ListCardProps) => {
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
    <View style={{flex: 1, width: width-30, paddingBottom: 20, marginBottom: 20, borderBottomColor: 'rgba(203, 203, 203, 1)', borderBottomWidth: 1 }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[textStyles.writer, {color: verified ? '#209DF5' : '#67D393', flex: 1}]}>{nickname}</Text>
        <Text style={textStyles.date}>{created.slice(0, 10)} 작성</Text>
      </View>
      <TouchableOpacity style={{marginTop: 5}} onPress={onPress}>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <View style={{flex: 1}}>
            <Text numberOfLines={2} style={textStyles.title}>{title}</Text>
            <Text style={textStyles.placename}>{place_name}</Text>
          </View>
          <View style={{justifyContent: 'flex-end'}}>
            {story_like ? (
              <Heart like={!like} onPress={toggleLike} />
            ) : (
              <Heart like={like} onPress={toggleLike} />
            )}
          </View>
          <Image source={{uri: rep_pic}} style={{width: 60, height: 60, borderRadius: 4, marginRight: 8, marginLeft: 20}} />
          { extra_pics!= null ? (
            <Image source={{uri: extra_pics[0]}} style={{width: 60, height: 60, borderRadius: 4}} />
          ): (
            <View style={{backgroundColor: '#D9D9D9', width: 60, height: 60, borderRadius: 4}} />
          )}
        </View>
        <Text style={textStyles.preview}>{preview}</Text>
      </TouchableOpacity>
    </View>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 5
  },
  placename: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  preview: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
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

export default ListCard;