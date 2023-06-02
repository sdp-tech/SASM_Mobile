import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import { TextInput, TouchableOpacity, View, Image, Alert, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import styled from 'styled-components/native';
import { Request } from '../../../common/requests';
import { reviewDataProps } from './DetailCard';
import PhotoOptions, { PhotoSelector } from '../../../common/PhotoOptions';
import Close from "../../../assets/img/common/Close.svg";
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const Header = styled.View`
  background-color: #75E59B;
  height: 12.5%;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`
const Section = styled.View`
  padding: 20px;
`
const KeywordBox = styled.View`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-vertical: 20px;
`
const KeywordButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: 49%;
  background-color: ${props => props.isSelected ? '#75E59B' : '#FFFFFF'}
  border: 1px #B7B7B7 solid;
  margin-vertical: 5px;
`
const KeywordTitle = styled.Text<{ isSelected: boolean }>`
  padding: 10px;
  font-size: 13px;
  color: ${props => props.isSelected ? '#FFFFFF' : '#000000'};
`
const ContentsInput = styled.TextInput`
  border: 1px #B7B7B7 solid;
  height: 35px;
  margin: 10px 0;
  padding: 5px;
`
const Submit = styled.TouchableOpacity`
  width: 50%;
  margin: 0 auto
  height: 50px;
  background-color: #75E59B;
  display: flex;
  justify-content: center;
  align-items: center;
`
interface FormProps {
  keywords: number[];
  id: number;
  contents: string;
}

interface WriteReviewProps {
  id: number;
  category: string;
  setReviewModal: Dispatch<SetStateAction<boolean>>;
  setDetailModal?: Dispatch<SetStateAction<boolean>>;
  setTab: Dispatch<SetStateAction<number>>;
  rerender: () => void;
  targetData?: reviewDataProps;
}

export default function WriteReview({ rerender, id, category, setReviewModal, setDetailModal, setTab, targetData }: WriteReviewProps) {
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
    if (photoList.length + photos.length > 3 || form.contents.length == 0 || form.keywords.length == 0) {
      if (form.contents.length == 0) {
        Alert.alert(
          '댓글을 작성해주세요',
          '',
          [{
            text: '확인'
          }]
        )
      }
      if (form.keywords.length == 0) {
        Alert.alert(
          '키워드를 선택해주세요',
          '',
          [{
            text: '확인'
          }]
        )
      }
      if (photoList.length + photos.length > 3) {
        Alert.alert(
          '사진은 최대 3장까지 업로드 가능합니다.',
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
      if (setDetailModal) {
        setDetailModal(false);
      }
      setTab(0);
      rerender();
    }
  }
  useEffect(() => {
    let tempCategory = [];
    if (targetData) {
      setPhotoList(targetData.photos);
      for (let i = 0; i < targetData?.category.length; i++) {
        tempCategory.push(targetData.category[i].category);
      }
      setForm({ ...form, contents: targetData?.contents, keywords: tempCategory });
    }
  }, []);

  return (
    <View>
      <Header>
        <Text style={TextStyles.header}>리뷰하기</Text>
        <TouchableOpacity onPress={() => { setReviewModal(false) }}><Close color={'#FFFFFF'} /></TouchableOpacity>
      </Header>
      <ScrollView style={{height: '87.5%'}}>
      <Section>
        <Text style={TextStyles.title}>이미지 등록하기</Text>
        <PhotoSelector max={3} width={width-40} height={300} setPhoto={setPhotos}>
          {
            photos.map((data) =>
              <View style={{ position: 'relative' }}>
                <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, zIndex: 2 }} onPress={() => { deletePhoto(data, photos, setPhotos) }}>
                  <Close color={'#FFFFFF'} width={20} height={20} />
                </TouchableOpacity>
                <Image source={{ uri: data.uri }} style={{ width: 100, height: 100, marginBottom: 10 }} />
              </View>)
          }
          {
            photoList.map((data) =>
              <View style={{ position: 'relative' }}>
                <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, zIndex: 2 }} onPress={() => { deletePhoto(data, photoList, setPhotoList) }}>
                  <Close color={'#FFFFFF'} width={20} height={20} />
                </TouchableOpacity>
                <Image source={{ uri: data.imgfile }} style={{ width: 100, height: 100, marginBottom: 10 }} />
              </View>
            )
          }
        </PhotoSelector>
        <Text style={TextStyles.titleBold}>좋았던 점을 알려주세요!</Text>
        <Text style={TextStyles.title}>한줄평</Text>
        <ContentsInput defaultValue={targetData && targetData.contents} onChangeText={(event) => { setForm({ ...form, contents: event }) }} />
        <KeywordBox>
          {keywordList.map(data => {
            const isSelected = form.keywords.includes(data[1]);
            return (
              <KeywordButton isSelected={isSelected} onPress={() => onChangeKeyword(data[1])} key={data[1]}>
                <KeywordTitle isSelected={isSelected}>{data[0]}</KeywordTitle>
              </KeywordButton>)
          })}
        </KeywordBox>
        <Submit onPress={uploadReview}>
          <Text style={TextStyles.submit}>리뷰 등록하기</Text>
        </Submit>
      </Section>
      </ScrollView>
    </View>
  )
}

const TextStyles = StyleSheet.create({
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: "700",
  },
  submit: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: "700",
  },
  title: {
    fontSize: 15,
    marginVertical: 10,
    color: '#000000'
  },
  titleBold: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 10,
    color: '#000000'
  }
})