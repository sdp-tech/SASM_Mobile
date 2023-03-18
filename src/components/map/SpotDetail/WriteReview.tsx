import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react'
import { Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native'
import styled from 'styled-components/native';
import { Request } from '../../../common/requests';
import { reviewDataProps } from './DetailCard';
import PhotoOptions from '../../../common/PhotoOptions';

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
const PhotoBox = styled.View`
  display: flex;
  min-height: 110px;
  margin: 10px 0;
  flex-flow: row wrap;
  justify-content: space-around;
`
interface WriteProps {
  category: string;
  id: number;
  tab: boolean;
  setTab: Dispatch<SetStateAction<boolean>>;
  targetData: reviewDataProps | null | undefined;
  setReviewModal: Dispatch<SetStateAction<boolean>>;
}

interface FormProps {
  keywords: number[];
  id: number;
  contents: string;
}

interface SubmitProps {
  onSubmit: (form: FormProps) => void;
}

export default function WriteReview({ category, id, tab, setTab, targetData, setReviewModal }: WriteProps) {
  //업로드할 사진 목록
  const [photos, setPhotos] = useState<any[]>([]);
  //수정할 사진 목록
  const [photoList, setPhotoList] = useState<any[]>([]);
  const request = new Request();
  const [form, setForm] = useState<FormProps>(
    {
      keywords: [],
      id: id,
      contents: ''
    }
  )
  let keywordList: any[] = [
    //카테고리 별 키워드 리스트
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
    //키워드 선택
    if (form.keywords.includes(value)) {
      setForm({
        ...form,
        keywords: form.keywords.filter((el) => el != value)
      })
    }
    else {
      if (form.keywords.length >= 3) {
        Alert.alert('경고', '키워드는 3개까지만');
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
  }
  const onChangeText = (props: string) => (value: string) => {
    //텍스트 입력
    setForm({
      ...form,
      [props]: value,
    });
  };
  const deletePhoto = (data: any, state: any[], setState: Dispatch<SetStateAction<any[]>>) => {
    //각각의 photoList와 photos를 위해 state를 props로 전달
    setState(state.filter((el) => el !== data));
  }
  const uploadReview = async () => {
    //리뷰 업로드
    const formData = new FormData();
    formData.append('place', form.id);
    formData.append('contents', form.contents);
    formData.append('category', form.keywords);
    if (photos) {
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', {
          uri: photos[i].uri,
          name: photos[i].fileName,
          type: 'image/jpeg/png',
        });
      }
    }
    if (photoList) {
      for (let i = 0; i < photoList.length; i++) {
        formData.append('photoList', photoList[i].imgfile);
      }
    }

    for(let item of formData.getParts()){
      console.log(item);
    }
    if (photoList.length + photos.length > 3 || form.contents.length==0) {
      if(form.contents.length==0) {
        Alert.alert(
          '댓글을 작성해주세요',
          '',
          [{
            text: '확인'
          }]
        )
      }
      if(photoList.length + photos.length > 3) {
        Alert.alert(
          '사진은 최대 3장까지 업로드',
          '',
          [{
            text: '확인'
          }]
        )
      }
    }
    else {
      if (targetData) {
        const response_update = await request.put(`/places/place_review/${targetData.id}/update`, formData, { "Content-Type": "multipart/form-data" });
      }
      else {
        const response_upload = await request.post('/places/place_review/create/', formData, { "Content-Type": "multipart/form-data" });
      }
      setReviewModal(false);
      setTab(!tab);
    }
  }
  useEffect(() => {
    let tempCategory = [];
    if (targetData) {
      setPhotoList(targetData.photos);
      for (let i = 0; i < targetData?.category.length; i++) {
        tempCategory.push(targetData.category[i].category);
      }
    }
    setForm({ ...form, keywords: tempCategory });
  }, [targetData]);
  return (
    <View>
      <KeywordBox>
        {keywordList.map(data => {
          const isSelected = form.keywords.includes(data[1]);
          return (<KeywordButton onPress={() => onChangeKeyword(data[1])} key={data[1]}><KeywordTitle isSelected={isSelected}>{data[0]}</KeywordTitle></KeywordButton>)
        })}
      </KeywordBox>
      <ContentsInput placeholder={targetData ? targetData.contents : '댓글을 작성해주세요'} value={form.contents} onChangeText={onChangeText('contents')} />
      <PhotoOptions setPhoto={setPhotos} max={3} />
      <PhotoBox>
        {
          photos?.map((data, index) => {
            return (
              <TouchableOpacity onPress={()=>deletePhoto(data,photos,setPhotos)}>
                <Image key={index} source={{ uri: data.uri }} style={{ width: 100, height: 100, margin: 5 }} />
              </TouchableOpacity>
            )
          })
        }
        {
          photoList?.map((data, index) => {
            return (
              <TouchableOpacity onPress={()=>deletePhoto(data, photoList, setPhotoList)}>
                <Image key={index} source={{ uri: data.imgfile }} style={{ width: 100, height: 100, margin: 5 }} />
              </TouchableOpacity>
            )
          })
        }
      </PhotoBox>
      <TouchableOpacity onPress={uploadReview} style={{ borderColor: 'black', borderWidth: 1, width: '20%', padding: 5 }}>
        <Text style={{ textAlign: 'center' }}>{targetData ? '수정' : '작성'}</Text>
      </TouchableOpacity>
    </View>
  )
}