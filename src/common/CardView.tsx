import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import Arrow from '../assets/img/common/Arrow.svg';

interface CardViewProps {
    gap: number;    // 카드 사이 간격은 renderItem에서 marginHorizontal: gap / 2로 설정해주기
    offset: number;
    height: number;
    data: any[];
    pageWidth: number;  // 카드 width. Image width랑 동일하게 설정해주기
    renderItem: any;
    dot: boolean;   // dot 표시하고 싶을 때는 true로 설정하기
    onEndReached?: () => void;
    onRefresh?: () => void;
    refreshing?: boolean;
    onArrowPressed?: () => void;
}

interface DotProps {
    focused: boolean;
}

const Dot = ({focused}: DotProps) => {
    return (
        <View style = {{
            width: focused ? 8 : 4,
            height: focused ? 8 : 4,
            marginHorizontal: 4,
            borderRadius: 16,
            backgroundColor: focused ? '#209DF5' : '#3B3B3B'
        }}/>
    )
}

const CardView = ({ gap, offset, height, data, pageWidth, renderItem, dot, onEndReached, onRefresh, refreshing, onArrowPressed }: CardViewProps) => {
    const [page, setPage] = useState<number>(0);
    const onScroll = (e: any) => {
        const newPage = Math.round(
            e.nativeEvent.contentOffset.x / (pageWidth + gap)
        )
        setPage(newPage);
    }

    return (
        <View style = {{
            height: height,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <FlatList
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {(item: any) => item.id}
                horizontal
                pagingEnabled
                onScroll={onScroll}
                snapToInterval = {pageWidth + gap}
                snapToAlignment = 'start'
                decelerationRate='fast'
                contentContainerStyle = {{ paddingHorizontal: offset + gap / 2 }}
                nestedScrollEnabled = {true}
                showsHorizontalScrollIndicator={false}
                onEndReached={onEndReached}
                //onEndReachedThreshold={0}
                onRefresh = {onRefresh}
                refreshing = {refreshing}
            />
            {dot? (
                <View style = {{ flexDirection: 'row', alignItems: 'center' }}>
                    {page !== 0 ? (<Arrow transform={[{rotateY: '180deg'}]} />) : (<></>)}
                    {Array.from({length: 4}, (_, i) => i).map((i) => (
                        <Dot key={i} focused={i === page ? true : false} />
                    ))}
                    <Arrow onPress = {onArrowPressed}/>
                </View>
            ):(<></>)}
        </View>
    )
}

export default CardView