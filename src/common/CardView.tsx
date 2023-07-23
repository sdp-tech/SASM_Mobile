import { useState, useRef } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

interface CardViewProps {
  gap: number;    // 카드 사이 간격은 renderItem에서 marginHorizontal: gap / 2로 설정해주기
  offset: number;
  data: any[];
  pageWidth: number;  // 카드 width. Image width랑 동일하게 설정해주기
  renderItem: any;
  dot: boolean;   // dot 표시하고 싶을 때는 true로 설정하기
  onEndReached?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onEndDrag?: () => void;
}

interface DotProps {
  focused: boolean;
}

const Dot = ({focused}: DotProps) => {
  return (
    <View style = {{
      width: focused ? 8 : 4,
      height: focused ? 8 : 4,
      marginHorizontal: 6,
      borderRadius: 16,
      backgroundColor: '#209DF5',
      opacity: focused ? 1 : 0.3
    }}/>
)
}

const CardView = ({ gap, offset, data, pageWidth, renderItem, dot, onEndReached, onRefresh, refreshing, onEndDrag }: CardViewProps) => {
  const [page, setPage] = useState<number>(0);
  const prevScrollOffset = useRef<number>(0); // 이전 스크롤 위치를 저장할 ref

  const onScroll = (e: any) => {
    const newPage = Math.round(e.nativeEvent.contentOffset.x / (pageWidth + gap));
    setPage(newPage);
    prevScrollOffset.current = e.nativeEvent.contentOffset.x;
  };

  const handleOnScrollEndDrag = (e: any) => {
    const currentScrollOffset = e.nativeEvent.contentOffset.x;
    const currentPage = Math.round(currentScrollOffset / (pageWidth + gap));
    const maxScrollOffset = (data.length - 1) * (pageWidth + gap);

    const scrollDiff = currentScrollOffset - maxScrollOffset
    // 스와이프 제스처가 화면 너비의 1/10 이상 넘는다면 navigate 함수 호출
    if (onEndDrag && currentPage === 2 && scrollDiff > (pageWidth / 4)) {
      onEndDrag();
      // const scrollDiff = currentScrollOffset - prevScrollOffset.current; // 이전 스크롤 위치와 현재 스크롤 위치의 차이를 계산
      // console.log(scrollDiff)
      // if (scrollDiff > 0 && onMomentumScrollEnd) { // scrollDiff가 양수인 경우에만 스와이프 방향이 오른쪽임
      //   console.log("Trying to scroll beyond the last item.");
      //   onMomentumScrollEnd();
      // }
    }
    // prevScrollOffset.current = currentScrollOffset; // 현재 스크롤 위치를 이전 스크롤 위치로 저장
    console.log(currentScrollOffset, maxScrollOffset);
  };

  return (
    <>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        onScrollEndDrag={handleOnScrollEndDrag}
        // onEndReached={handleOnScrollEndDrag}
        snapToInterval={pageWidth + gap}
        snapToAlignment='start'
        decelerationRate='fast'
        contentContainerStyle={{ paddingHorizontal: offset + gap / 2 }}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReachedThreshold={0.1}
      />
      {dot ? (
        <View style = {{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
          {Array.from({length: data.length}, (_, i) => i).map((i) => (
            <Dot key={i} focused={i === page ? true : false} />
          ))}
        </View>
      ):(<></>)}
    </>
  )
}

export default CardView