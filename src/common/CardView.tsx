import { useState } from 'react';
import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

interface CardViewProps {
    gap: number;    // 카드 사이 간격은 renderItem에서 marginHorizontal: gap / 2로 설정해주기
    offset: number;
    height: number;
    data: any[];
    pageWidth: number;  // 카드 width. Image width랑 동일하게 설정해주기
    renderItem: any;
    dot: boolean;   // dot 표시하고 싶을 때는 true로 설정하기
}

interface DotProps {
    focused: boolean;
}

const Dot = ({focused}: DotProps) => {
    return (
        <View style = {{
            width: 6,
            height: 6,
            marginHorizontal: 3,
            borderRadius: 3,
            backgroundColor: focused ? 'black' : 'white'
        }}/>
    )
}

const CardView = ({ gap, offset, height, data, pageWidth, renderItem, dot }: CardViewProps) => {
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
            />
            {dot? (
                <View style = {{ flexDirection: 'row', alignItems: 'center' }}>
                    {Array.from({length: data.length}, (_, i) => i).map((i) => (
                        <Dot key={i} focused={i === page ? true : false} />
                    ))}
                </View>
            ):(<></>)}
        </View>
    )
}

export default CardView