import React from 'react';
import { Image, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Category0 from "../assets/img/Category/Category0.svg";
import Category1 from "../assets/img/Category/Category1.svg";
import Category2 from "../assets/img/Category/Category2.svg";
import Category3 from "../assets/img/Category/Category3.svg";
import Category4 from "../assets/img/Category/Category4.svg";
import Category5 from "../assets/img/Category/Category5.svg";

const {
  width: MAX_WIDTH,
  height: MAX_HEIGHT,
} = Dimensions.get('window');

const CategoryWrapper = styled.View`
  display: flex;
  flex-direction: row;
  width:${MAX_WIDTH};
`
interface ImageWrapperProps {
  selected: boolean;
}
const CategoryImageWrapper = styled.TouchableOpacity<ImageWrapperProps>`
  flex: 1;
  height: ${MAX_WIDTH / 6 - 10};
  background-color: ${props => props.selected ? '#01A0FC' : '#FFFFFF'};
  border: 0.5px solid #D9D9D9;
  border-radius: 100px;
  margin: 5px;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
`
interface ListProps {
  id: number;
  data: string;
  name: string;
  sourceWhite: number;
}

export const CATEGORY_LIST: ListProps[] = [
  { id: 0, data: "식당 및 카페", name: "식당·카페", sourceWhite: require("../assets/img/Category/CategoryWhite0.svg") },
  { id: 1, data: "전시 및 체험공간", name: "전시·체험", sourceWhite: require("../assets/img/Category/CategoryWhite1.svg") },
  { id: 2, data: "제로웨이스트 샵", name: "제로웨이스트", sourceWhite: require("../assets/img/Category/CategoryWhite2.svg") },
  { id: 3, data: "도시 재생 및 친환경 건축물", name: "건축물", sourceWhite: require("../assets/img/Category/CategoryWhite3.svg") },
  { id: 4, data: "복합 문화 공간", name: "복합문화", sourceWhite: require("../assets/img/Category/CategoryWhite4.svg") },
  { id: 5, data: "녹색 공간", name: "녹색공간", sourceWhite: require("../assets/img/Category/CategoryWhite5.svg") },
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
}

export default function Category({ checkedList, setCheckedList }: CategoryProps): JSX.Element {
  const handleCheckedList = (data: string): void => {
    if (checkedList.includes(data)) {
      setCheckedList(checkedList.filter(element => element != data));
    }
    else {
      setCheckedList([...checkedList, data]);
    }
  }

  return (
    <CategoryWrapper>
      {CATEGORY_LIST.map((data: ListProps) => {
        let Image: JSX.Element[] = [];
        {
          switch (data.id) {
            case 0:
              Image.push(<Category0 />);
              break;
            case 1:
              Image.push(<Category1 />);
              break;
            case 2:
              Image.push(<Category2 />);
              break;
            case 3:
              Image.push(<Category3 />);
              break;
            case 4:
              Image.push(<Category4 />);
              break;
            case 5:
              Image.push(<Category5 />);
              break;
          }
        }
        return (
          <CategoryImageWrapper key={data.id} selected={checkedList.includes(data.data)} onPress={() => { handleCheckedList(data.data) }}>
            {Image}
          </CategoryImageWrapper>
        )
      })}
    </CategoryWrapper>
  )
}