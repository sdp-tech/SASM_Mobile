import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native';
import { Request } from '../../../common/requests';

const KeywordBox = styled.View`
  border: 1px black solid;
  display: flex;
  flex-flow: row wrap;
`
const KeywordButton = styled.TouchableOpacity`
  margin: 5px;
`
const KeywordTitle = styled.Text<{ isSelected: boolean }>`
  color: ${props => props.isSelected ? 'red' : 'black'};

`
const ContentsInput = styled.TextInput<{ value: string }>`
  border: 1px #000000 solid;
  height: 30px;
  margin: 10px 0;
  padding: 5px;
`
interface WriteProps {
  category: string;
  id: number;
}

interface FormProps {
  keywords: number[];
  id: number;
  contents: string;
}

interface SubmitProps {
  onSubmit: (form: FormProps) => void;
}

export default function WriteReview({ category, id }: WriteProps) {
  const request = new Request();
  const [form, setForm] = useState<FormProps>(
    {
      keywords: [],
      id: id,
      contents: ''
    }
  )
  let keywordList: any[] = [
    ['분위기가 좋다', 1],
    ['혼자 가기 좋다', 2],
    ['함께 가기 좋다', 3],
    ['가족끼리 가기 좋다', 4],
    ['청결하다', 5],
    ['뷰가 좋다', 6],
    ['지속가능성의 필요성을 느낄 수가 있다', 7]
  ]
  switch (category) {
    case '식당 및 카페':
      keywordList.push(['음식이 맛있다', 8], ['양이 많다', 9], ['직원분이 친절하시다', 10])
      break;
    case '전시 및 체험공간':
      keywordList.push(['전시가 멋지다', 11], ['아이와 함께 가기 좋다', 12], ['부모님과 함께 가기 좋다', 13])
      break;
    case '도시 재생 및 친환경 건축물':
      keywordList.push(['특색 있다', 14])
      break;
    case '제로웨이스트 샵':
      keywordList.push(['물건 종류가 다양하다', 15])
      break;
    case '녹색 공간':
      keywordList.push(['관리가 잘 되어 있다', 16])
      break;
  }
  const onChangeKeyword = (value: number) => {
    if (form.keywords.includes(value)) {
      setForm({
        ...form,
        keywords: form.keywords.filter((el) => el != value)
      })
    }
    else {
      setForm({
        ...form,
        keywords: [
          ...form.keywords, value
        ]
      })
    }
  }
  const onChangeText = (props: string) => (value: string) => {
    setForm({
      ...form,
      [props]: value,
    });
  };
  const reviewUpload = async () => {
    console.log(form.keywords);
    const formData = new FormData();
    formData.append('place', form.id);
    formData.append('contents', form.contents);
    formData.append('category', form.keywords);
    const response = await request.post('/places/place_review/create/', formData, { "Content-Type": "multipart/form-data" });
  }
  return (
    <View>
      <KeywordBox>
        {keywordList.map(data => {
          const isSelected = form.keywords.includes(data[1]);
          return (<KeywordButton onPress={() => onChangeKeyword(data[1])} key={data[1]}><KeywordTitle isSelected={isSelected}>{data[0]}</KeywordTitle></KeywordButton>)
        })}
      </KeywordBox>
      <ContentsInput value={form.contents} onChangeText={onChangeText('contents')} />
      <TouchableOpacity onPress={reviewUpload} style={{ borderColor: 'black', borderWidth: 1, width: '20%', padding: 5}}>
        <Text style={{textAlign:'center'}}>제출</Text>
      </TouchableOpacity>
    </View>
  )
}
