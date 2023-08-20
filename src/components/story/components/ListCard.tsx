import { useState, useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, StyleSheet, Dimensions, Alert} from 'react-native';
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
  summary: string;
  writer: string;
  nickname: string;
  created: string;
  writer_is_verified: boolean;
  isLogin: boolean;
  navigation: any;
}

const ListCard = ({id, place_name, title, rep_pic, extra_pics, story_like, created, preview, summary, writer, nickname, writer_is_verified, isLogin, navigation}: ListCardProps) => {
  const { width, height } = Dimensions.get('screen');
  const [verified, setVerified] = useState<boolean>(writer_is_verified);
  const [like, setLike] = useState<boolean>(false);
  const request = new Request();

  useEffect(()=> {
    story_like ? setLike(true) : setLike(false);
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
    <View style={{flex: 1, width: width-30, paddingBottom: 20, marginBottom: 20, borderBottomColor: 'rgba(203, 203, 203, 1)', borderBottomWidth: 1 }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[textStyles.writer, {color: verified ? '#209DF5' : '#67D393', flex: 1}]}>{nickname}</Text>
        <Text style={textStyles.date}>{created.slice(0, 10).replace(/-/gi, '.')} 작성</Text>
      </View>
      <TouchableOpacity style={{marginTop: 5}} onPress={onPress}>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <View style={{flex: 1}}>
            <Text numberOfLines={2} style={textStyles.title}>{title}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={textStyles.placename} numberOfLines={1}>{place_name}</Text>
              <Heart like={like} onPress={toggleLike} size={20} color={'#202020'}/>
            </View>
          </View>
          <Image source={{uri: rep_pic}} style={{width: 60, height: 60, borderRadius: 4, marginRight: 8, marginLeft: 20}} />
          { extra_pics!= null ? (
            <Image source={{uri: extra_pics[0]}} style={{width: 60, height: 60, borderRadius: 4}} />
          ): (
            <View style={{backgroundColor: '#D9D9D9', width: 60, height: 60, borderRadius: 4}} />
          )}
        </View>
        <Text style={textStyles.preview} numberOfLines={3}>{summary}</Text>
      </TouchableOpacity>
    </View>
  )
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.6,
    width: '80%'
  },
  placename: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.6,
    flex: 1
  },
  preview: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: -0.6
  },
  writer: { 
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    fontWeight: '400',
    color: '#676767',
  }
});

export default ListCard;