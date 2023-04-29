import { useState, useRef, useEffect } from 'react';
import { View, FlatList, PanResponder, Animated, Dimensions } from 'react-native';
import MainCard from './MainCard';
import CardView from '../../../common/CardView';

interface SwipeListProps {
  item: any;
  navigation: any;
}

type PanHandlers = ReturnType<typeof PanResponder['create']>['panHandlers'];

const SwipeList = ({ item, navigation }: SwipeListProps) => {
  const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
  const panHandlers: Record<number, PanHandlers> = useRef({}).current;
  const pan = useRef<Animated.ValueXY>(new Animated.ValueXY()).current;
  const renderItem = ({ item: cardItem, index }: any) => {
    

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // 수직 스와이프 동안에만 제스처 이벤트를 처리합니다.
        const { dx, dy } = gestureState;
        return Math.abs(dx) < Math.abs(dy);
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dy: pan.y } // pan 값 변경
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 0) {
          console.log('down')
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false
          }).start();
        } else {
          Animated.timing(pan, {
            toValue: { x: 0, y: -1000 }, // 위로 swipe할 경우 y값을 -1000으로 설정
            duration: 300, // 300ms 동안 애니메이션 실행
            useNativeDriver: false
          }).start(() => {
            console.log('up')
          });
        }
      }
    });

    panHandlers[index] = panResponder.panHandlers;

    return (
      <Animated.View
        key={cardItem.id}
        style={{
          opacity: pan.y.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp'
          }),
          transform: [{ translateY: pan.y }]
        }}
      >
        <MainCard
          id={cardItem.id}
          rep_pic={cardItem.rep_pic}
          place_name={cardItem.place_name}
          title={cardItem.title}
          story_like={cardItem.story_like}
          category={cardItem.category}
          preview={cardItem.preview}
          writer={cardItem.writer}
          writer_is_verified={cardItem.writer_is_verified}
          navigation={navigation}
          width={DEVICE_WIDTH}
          {...panHandlers[index]}
        />
      </Animated.View>
    )
  }

  const [page, setPage] = useState<number>(0);
    const onScroll = (e: any) => {
        const newPage = Math.round(
            e.nativeEvent.contentOffset.x / (DEVICE_WIDTH*0.84+20)
        )
        setPage(newPage);
    }

  return (
    <View style={{ height: DEVICE_WIDTH + 120}}>
    <FlatList
      data={item}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      onScroll={onScroll}
      snapToInterval={DEVICE_WIDTH*0.84+20}
      snapToAlignment = 'start'
      decelerationRate='fast'
      nestedScrollEnabled = {true}
      showsHorizontalScrollIndicator={false}
    />
    </View>
  )
}

export default SwipeList;
