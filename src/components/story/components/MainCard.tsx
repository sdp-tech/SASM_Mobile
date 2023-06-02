import { useState, useRef } from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, Pressable } from 'react-native';
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
  writer: string;
  nickname: string;
  profile: string;
  writer_is_verified: boolean;
  navigation: any;
  width: any;
}

const MainCard = ({id, place_name, title, rep_pic, story_like, category, preview, writer, nickname, profile, writer_is_verified, width, navigation}: MainCardProps) => {
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

  return (
    <View style={{width: width, overflow: 'hidden'}}>
    <Image source={{uri: rep_pic}} resizeMode='cover' style={{position: 'absolute', borderTopLeftRadius: 5, top: 50, left: 0, width: width*0.6, height: width*0.6, opacity: 0.3}} />
    <Image source={{uri: rep_pic}} resizeMode='cover' style={{position: 'absolute', borderTopRightRadius: 5, top: 50, right: 0, width: width*0.6, height: width*0.6, opacity: 0.3}} />
    <View style={{position: 'absolute', borderBottomLeftRadius: 5, top: 50+width*0.6, left: 0, width: 30, height: width*0.2, opacity: 0.3, backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 5}}}/>
    <View style={{position: 'absolute', borderBottomLeftRadius: 5, top: 50+width*0.6, right: 0, width: 30, height: width*0.2, opacity: 0.3, backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 5}}}/>
    <Pressable style={{alignSelf: 'center'}} onPress={onPress}>
      <ImageBackground
        source={{uri: rep_pic}}
        style={{width: width*0.84, height:width*0.85}}
        imageStyle={{borderTopLeftRadius: 5, borderTopRightRadius: 5}}
        resizeMode='cover'
      >
        <SafeAreaView style={{width: width*0.84, height: width*0.85, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', flexDirection: 'row'}}>
          <View style={{width: width*0.6, marginLeft: 20, marginTop: 30}}>
            <Text style={textStyles.title}>{title}</Text>
            <Text style={textStyles.placename}>{place_name}</Text>
            <Text style={textStyles.category}>{category}</Text>
          </View>
          <View style={{marginLeft: 40, marginTop: 30}}>
            {story_like ? (
              <Heart like={!like} onPress={toggleLike} white={true} />
            ) : (
              <Heart like={like} onPress={toggleLike} white={true} />
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
      <View style={{width: width*0.84, height: 130, borderBottomRightRadius:5, borderBottomLeftRadius: 5, backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4}, paddingVertical: 20, paddingHorizontal: 25}}>
        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
          <View style={{backgroundColor: verified ? '#209DF5' : '#89C77F', width: 7, height: 7, borderRadius: 60, marginTop: 2}}/>
          <Text style={[textStyles.writer, {color: verified ? '#209DF5' : '#89C77F'}]}>{verified ? ('Editor') : ('User')}</Text>
          <Text style={textStyles.writer}>{nickname}</Text>
        </View>
          <Text numberOfLines={4} ellipsizeMode={'tail'} style={textStyles.preview}>{preview}</Text>
        </View>
      <Image source={{uri: profile}} style={{position:'absolute', borderRadius:60, backgroundColor: 'white', width:50, height:50, top: width*0.76, marginLeft: 250}} />
    </Pressable>
    </View>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
    color: 'white',
    marginBottom: 3,
  },
  placename: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: 'white'
  },
  category: {
    fontSize: 10,
    fontWeight: '400',
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'flex-start',
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
    marginTop: 10
  },
  preview: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 18,
  },
  writer: {
    marginLeft: 2,
    marginBottom: 3, 
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12
  }
});

export default MainCard;