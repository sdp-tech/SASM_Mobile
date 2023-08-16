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
  border-width: ${props => props.story ? 1 : 0};
`

interface ListProps {
  id: number;
  data: string;
  name: string;
  color: string;
}

export const CATEGORY_LIST: ListProps[] = [
  { id: 0, data: "식당 및 카페", name: "식당·카페", color: '#FAD656' },
  { id: 1, data: "전시 및 체험공간", name: "전시·체험", color: '#42A7EE' },
  { id: 2, data: "제로웨이스트 샵", name: "제로웨이스트", color: '#ED6093' },
  { id: 3, data: "도시 재생 및 친환경 건축물", name: "건축물", color: '#C5F0A3' },
  { id: 4, data: "복합 문화 공간", name: "복합문화", color: '#B06FE3' },
  { id: 5, data: "녹색 공간", name: "녹색공간", color: '#1DBB6F' },
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

export function CategoryIcon({data}:{data:string}) {
  const index = MatchCategory(data);
  switch(index) {
    case 0: return <Selector0 width={18} height={18} color={CATEGORY_LIST[index].color}/>
    case 1: return <Selector1 width={18} height={18} color={CATEGORY_LIST[index].color}/>
    case 2: return <Selector2 width={18} height={18} color={CATEGORY_LIST[index].color}/>
    case 3: return <Selector3 width={18} height={18} color={CATEGORY_LIST[index].color}/>
    case 4: return <Selector4 width={18} height={18} color={CATEGORY_LIST[index].color}/>
    case 5: return <Selector5 width={18} height={18} color={CATEGORY_LIST[index].color}/>
  }
}


interface CategoryProps {
  checkedList: string[];
  setCheckedList: (list: string[]) => void;
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
  const category = ['시사', '문화', '라이프스타일', '뷰티', '푸드', '액티비티'];
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
      style={{ marginVertical: 10, ...style, }}
      showsHorizontalScrollIndicator={false}
      data={category}
      horizontal
      renderItem={({ item }) => {
        const isSelected = checkedList.includes(item);
        return (
            <TouchableOpacity onPress={()=>handleCheckedList(item)}>
            <Text style={{...TextStyles.forestCategory, backgroundColor: (isSelected ? '#D7D7D7' : '#FFFFFF')}}>{item}</Text>
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
    lineHeight: 28,
    paddingHorizontal: 9,
    borderRadius: 12,
    borderColor:'rgba(203, 203, 203, 1)',
    borderWidth: 1,
    overflow: 'hidden'
  }
})