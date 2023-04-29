import { useState, useRef } from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, Text, StyleSheet, Dimensions, ImageBackground, PanResponder, Animated } from 'react-native';
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
  writer_is_verified: boolean;
  navigation: any;
  width: any;
}

const MainCard = ({id, place_name, title, rep_pic, story_like, category, preview, writer, writer_is_verified, width, navigation}: MainCardProps) => {
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

  const onSwipeUp = () => {
    console.log('up');
  }

  const onSwipeDown = () => {
    console.log('down');
  }

  const flatListRef = useRef();
  const pan = useRef<Animated.ValueXY>(new Animated.ValueXY()).current;

  // const panResponder = PanResponder.create({
  //   onMoveShouldSetPanResponder: (evt, gestureState) => {
  //     // 수직 스와이프 동안에만 제스처 이벤트를 처리합니다.
  //     const { dx, dy } = gestureState;
  //     return Math.abs(dx) < Math.abs(dy);
  //   },
  //   onPanResponderMove: Animated.event(
  //     [
  //       null,
  //       { dy: pan.y } // pan 값 변경
  //     ],
  //     { useNativeDriver: false }
  //   ),
  //   onPanResponderRelease: (_, gestureState) => {
  //     // Animated.spring(pan, {
  //     //   toValue: { x: 0, y: 0 },
  //     //   useNativeDriver: false
  //     // }).start();
  //     if (gestureState.dy > 0) {
  //       console.log('down')
  //       Animated.spring(pan, {
  //         toValue: { x: 0, y: 0 },
  //         useNativeDriver: false
  //       }).start();
  //     } else {
  //       Animated.timing(pan, {
  //         toValue: { x: 0, y: -1000 }, // 위로 swipe할 경우 y값을 -1000으로 설정
  //         duration: 300, // 300ms 동안 애니메이션 실행
  //         useNativeDriver: false
  //       }).start(() => {
  //         console.log('up')
  //       });
  //     }
  //   }
  // });

  // writer: email로 받음
  // nickname으로 전환하는 과정 필요

  return (
        <TouchableOpacity style={{marginRight: 20}} onPress={onPress}>
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
                  <Heart like={!like} onPress={toggleLike} />
                ) : (
                  <Heart like={like} onPress={toggleLike} />
                )}
              </View>
            </SafeAreaView>
          </ImageBackground>
          <View style={{width: width*0.84, height: 130, borderBottomRightRadius:5, borderBottomLeftRadius: 5, borderColor: 'black', borderWidth: 1, backgroundColor: '#F2F2F2', paddingVertical: 20, paddingHorizontal: 25}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={textStyles.writer}>{verified ? ('Editor') : ('User')} 사슴 님의 이야기</Text>
              <View style={{backgroundColor: verified ? '#209DF5' : '#89C77F', width: 15, height: 15, borderRadius: 60}}/>
            </View>
            <Text numberOfLines={4} ellipsizeMode={'tail'} style={textStyles.preview}>{preview}</Text>
            </View>
          <View style={{position:'absolute', backgroundColor:'#D9D9D9', borderRadius:60, width:50, height:50, top: width*0.8, marginLeft: 250}} />
        </TouchableOpacity>
      
    // </Animated.View>
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
    marginRight: 10,
    marginBottom: 3, 
    fontSize: 14,
    fontWeight: '600',
  }
});

export default MainCard;