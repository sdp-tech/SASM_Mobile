import React, { Dispatch, SetStateAction } from 'react';
import { Image, View, Dimensions, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { TextPretendard as Text } from './CustomText';
import { FlatList } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Selector0 from "../assets/img/Category/Selector0.svg";
import Selector1 from "../assets/img/Category/Selector1.svg";
import Selector2 from "../assets/img/Category/Selector2.svg";
import Selector3 from "../assets/img/Category/Selector3.svg";
import Selector4 from "../assets/img/Category/Selector4.svg";
import Selector5 from "../assets/img/Category/Selector5.svg";

const CategoryWrapper = styled.TouchableOpacity<{ selected: boolean, color: string, story: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.selected ? props.color : '#FFFFFF'};
  padding: 5px 10px;
  border-radius: 12px;
  margin: ${props => props.story ? '0 5px' : '0 10px'};
  border-color: 'rgba(203, 203, 203, 1)';
  border-width: ${props => props.story ? 1 : 0}px;
`

interface ListProps {
  id: number;
  data: string;
  name: string;
  color: string;
  content: string;
}

export const CATEGORY_LIST: ListProps[] = [
  { id: 0, data: "식당 및 카페", name: "식당·카페", color: '#FAD656', content: '친환경 식재료와 비건 음식으로 지속가능한 식생활을 즐겨보세요.' },
  { id: 1, data: "전시 및 체험공간", name: "전시·체험", color: '#42A7EE', content: '지속가능한 예술과 문화가 녹아든 이야기들을 만나보세요.' },
  { id: 2, data: "제로웨이스트 샵", name: "제로웨이스트", color: '#ED6093', content: '지속가능한 라이프스타일을 위한 친환경 옵션을 찾아보세요.' },
  { id: 3, data: "도시 재생 및 친환경 건축물", name: "친환경 건축물", color: '#C5F0A3', content: '( G-SEED, LEED 등 ) 친환경 건축물 인증을 받은 국내공간과, 한국의 도시 재생에 기여하는 장소에 방문해보세요.' },
  { id: 4, data: "복합 문화 공간", name: "복합문화", color: '#B06FE3', content: '지속가능성과 관련한 작품의 전시·판매·작업공간이 한 데 모인 복합문화공간에 방문해보세요.' },
  { id: 5, data: "녹색 공간", name: "야외공간", color: '#1DBB6F', content: '자연과 함께하는 공간에서 야외 활동을 즐기세요.' },
];

export function MatchCategory(data: string): number {
  let index: number = 0;
  for (let i: number = 0; i < 6; i++) {
    if (CATEGORY_LIST[i].data == data) {
      index = i;
    }
  }
  return index;
}

export function CategoryIcon({data}:{data:string}): JSX.Element {
  const index = MatchCategory(data);
  let list = [
    <Selector0 width={18} height={18} color={CATEGORY_LIST[0].color} />,
    <Selector1 width={18} height={18} color={CATEGORY_LIST[1].color} />,
    <Selector2 width={18} height={18} color={CATEGORY_LIST[2].color} />,
    <Selector3 width={18} height={18} color={CATEGORY_LIST[3].color} />,
    <Selector4 width={18} height={18} color={CATEGORY_LIST[4].color} />,
    <Selector5 width={18} height={18} color={CATEGORY_LIST[5].color} />
  ]
  return list[index];
}

export function CategoryDescription({data}:{data:string}): JSX.Element {
  const index = MatchCategory(data);
  let list = [
    <><Text style={{fontSize: 14, lineHeight: 20}}>{CATEGORY_LIST[0].name}🥗:</Text><Text style={{fontSize: 14, flex: 1, lineHeight: 20}}>{CATEGORY_LIST[0].content}</Text></>,
    <><Text style={{fontSize: 14, lineHeight: 20}}>{CATEGORY_LIST[1].name}🎨:</Text><Text style={{fontSize: 14, flex: 1, lineHeight: 20}}>{CATEGORY_LIST[1].content}</Text></>,
    <><Text style={{fontSize: 14, lineHeight: 20}}>{CATEGORY_LIST[2].name}♻️:</Text><Text style={{fontSize: 14, flex: 1, lineHeight: 20}}>{CATEGORY_LIST[2].content}</Text></>,
    <><Text style={{fontSize: 14, lineHeight: 20}}>{CATEGORY_LIST[3].name}🏢:</Text><Text style={{fontSize: 14, flex: 1, lineHeight: 20}}>{CATEGORY_LIST[3].content}</Text></>,
    <><Text style={{fontSize: 14, lineHeight: 20}}>{CATEGORY_LIST[4].name}🎭:</Text><Text style={{fontSize: 14, flex: 1, lineHeight: 20}}>{CATEGORY_LIST[4].content}</Text></>,
    <><Text style={{fontSize: 14, lineHeight: 20}}>{CATEGORY_LIST[5].name}🌳:</Text><Text style={{fontSize: 14, flex: 1, lineHeight: 20}}>{CATEGORY_LIST[5].content}</Text></>
  ]
  return list[index];
}

interface CategoryProps {
  checkedList: any[];
  setCheckedList: (list: any[]) => void;
  story?: boolean;
  setPage?: Dispatch<SetStateAction<number>>;
  style?: ViewStyle;
}

export default function Category({ checkedList, setCheckedList, story, setPage, style }: CategoryProps): JSX.Element {
  const handleCheckedList = (data: string): void => {
    if(setPage) setPage(1);
    if (checkedList.includes(data)) {
      setCheckedList(checkedList.filter(element => element != data));
    }
    else {
      setCheckedList([...checkedList, data]);
    }
  }

  return (
    <FlatList
      style={{ marginVertical: 10, ...style}}
      showsHorizontalScrollIndicator={false}
      data={CATEGORY_LIST}
      horizontal
      renderItem={({ item }) => {
        const isSelected = checkedList.includes(item.data)
        return (
          <CategoryWrapper
            selected={isSelected}
            color={item.color}
            story={story ? true : false}
            onPress={() => { handleCheckedList(item.data) }}>
            {{
                0: <Selector0 width={18} height={18} color={isSelected ? '#FFFFFF' : item.color}/>,
                1: <Selector1 width={18} height={18} color={isSelected ? '#FFFFFF' : item.color}/>,
                2: <Selector2 width={18} height={18} color={isSelected ? '#FFFFFF' : item.color}/>,
                3: <Selector3 width={18} height={18} color={isSelected ? '#FFFFFF' : item.color}/>,
                4: <Selector4 width={18} height={18} color={isSelected ? '#FFFFFF' : item.color}/>,
                5: <Selector5 width={18} height={18} color={isSelected ? '#FFFFFF' : item.color}/>

              }[item.id]
            }
            <Text style={{ fontSize: 14, color: (isSelected ? '#FFFFFF' : '#000000'), marginHorizontal: 5, }}>{item.name}</Text>
          </CategoryWrapper>
        )
      }}
    />
  )
}

export function ForestCategory({ checkedList, setCheckedList, setPage, style }: CategoryProps) {
  const category = [
    {id: 1, name: '시사'},
    {id: 2, name: '문화'},
    {id: 3, name: '라이프스타일'},
    {id: 4, name: '뷰티'},
    {id: 5, name: '푸드'},
    {id: 6, name: '액티비티'},
  ];
  const handleCheckedList = (data: number): void => {
    if(setPage) setPage(1);
    if (checkedList.includes(data)) {
      setCheckedList(checkedList.filter(element => element != data));
    }
    else {
      setCheckedList([...checkedList, data]);
    }
  }

  return (
    <FlatList
      style={{ marginVertical: 10, ...style }}
      showsHorizontalScrollIndicator={false}
      data={category}
      horizontal
      renderItem={({ item }) => {
        const isSelected = checkedList.includes(item.id);
        return (
            <TouchableOpacity style={{justifyContent: 'center'}} onPress={()=>handleCheckedList(item.id)}>
            <Text style={{...TextStyles.forestCategory, backgroundColor: (isSelected ? '#D7D7D7' : '#FFFFFF')}}>{item.name}</Text>
            </TouchableOpacity>
        )
      }}
    />
  )
}

const TextStyles = StyleSheet.create({
  forestCategory : {
    marginHorizontal: 4.5,
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 12,
    borderColor:'rgba(203, 203, 203, 1)',
    borderWidth: 1,
    overflow: 'hidden'
  }
})