import React from 'react';
import { Image, Text, View, Dimensions, TouchableOpacity } from 'react-native';
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
  align-items: ${props => props.story ? `flex-start` : `center`}
  background-color: ${props => props.selected ? props.color : '#FFFFFF'};
  height: ${props => props.story ? `25px` : `30px`}
  border-radius: ${props => props.story ? `0px` : `10px`}
  padding: 0 ${props => props.story ? `0px` : `10px`};
  margin: 0 10px;
  border-color: '#444444';
  border-bottom-width: ${props => props.selected && props.story ? 2 : 0};
`

interface ListProps {
  id: number;
  data: string;
  name: string;
  color: string;
}

export const CATEGORY_LIST: ListProps[] = [
  { id: 0, data: "식당 및 카페", name: "식당·카페", color: '#FF6B00' },
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


interface CategoryProps {
  checkedList: string[];
  setCheckedList: (list: string[]) => void;
  story?: boolean;
}

export default function Category({ checkedList, setCheckedList, story }: CategoryProps): JSX.Element {
  const handleCheckedList = (data: string): void => {
    if (checkedList.includes(data)) {
      setCheckedList(checkedList.filter(element => element != data));
    }
    else {
      setCheckedList([...checkedList, data]);
    }
  }

  return (
    <FlatList
      style={{ marginTop: 10, marginBottom: story ? 0 : 10 }}
      showsHorizontalScrollIndicator={false}
      data={CATEGORY_LIST}
      horizontal
      renderItem={({ item }) => {
        const isSelected = checkedList.includes(item.data)
        return (
          <CategoryWrapper
            selected={isSelected}
            color={story ? 'white': item.color}
            story={story ? true : false}
            onPress={() => { handleCheckedList(item.data) }}>
            {
              story ?
              ({
                0: <Selector0 color={item.color}/>,
                1: <Selector1 color={item.color}/>,
                2: <Selector2 color={item.color}/>,
                3: <Selector3 color={item.color}/>,
                4: <Selector4 color={item.color}/>,
                5: <Selector0 color={item.color}/>

              }[item.id])
              :
              ({
                0: <Selector0 color={isSelected ? '#FFFFFF' : item.color}/>,
                1: <Selector1 color={isSelected ? '#FFFFFF' : item.color}/>,
                2: <Selector2 color={isSelected ? '#FFFFFF' : item.color}/>,
                3: <Selector3 color={isSelected ? '#FFFFFF' : item.color}/>,
                4: <Selector4 color={isSelected ? '#FFFFFF' : item.color}/>,
                5: <Selector5 color={isSelected ? '#FFFFFF' : item.color}/>

              }[item.id])
            }
            <Text style={{ fontSize: story ? 10 : 14, lineHeight: 14, color: story ? '#444444' : (isSelected ? '#FFFFFF' : '#000000'), marginHorizontal: 5 }}>{item.name}</Text>
          </CategoryWrapper>
        )
      }}
    />
  )
}