import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { reviewDataProps } from './DetailCard';
import styled from 'styled-components/native';
import Close from "../../../assets/img/common/Close.svg";
import ArrowWhite from "../../../assets/img/common/ArrowWhite.svg";
import { getNickname } from "../../../common/storage";
import { Request } from '../../../common/requests';
import WriteReview from './WriteReview';

const Section = styled.SafeAreaView`
  height: 100%;
  background-color: #000000;
  position: relative;
  display: flex;
  justify-content: center;
`
const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 50px
  right: 20px;
`
const TextBox = styled.View`
  width: 100%;
  position: absolute;
  bottom: 0%;
  height: 30%;
  padding: 20px;
`
const PageButton = styled.View`
  height: 100%;
  position: absolute;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface ReviewDetailProps {
  reviewData: reviewDataProps;
  setDetailModal: Dispatch<SetStateAction<boolean>>;
  rerender: ()=>void;
  category: string;
}

export default function ReviewDetail({ reviewData, setDetailModal, rerender, category}: ReviewDetailProps): JSX.Element {
  const request = new Request();
  const { width, height } = Dimensions.get('window');
  const flatlistRef = useRef<FlatList>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isWriter, setIsWriter] = useState<boolean>(false);
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const checkisWriter = async () => {
    const nickname = await getNickname();
    if(reviewData.nickname == nickname) setIsWriter(true);
  }

  useEffect(() => {
    checkisWriter();
  }, [])

  console.error(reviewData);

  const deleteReview = async () => {
    const response_delete = await request.delete(`/places/place_review/${reviewData.id}/`);
    setDetailModal(false);
    rerender();
  }

  return (
    <Section>
      <Modal visible={reviewModal}>
        <WriteReview id={reviewData.place} setReviewModal={setReviewModal} rerender={rerender} category={category} setTab={()=>{}} targetData={reviewData}/>
      </Modal>
      <CloseButton onPress={() => { setDetailModal(false) }}>
        <Close color={'#FFFFFF'} />
      </CloseButton>
      <View>
        {
          currentIdx != 0 &&
          <PageButton style={{ left: 10 }}>
            <TouchableOpacity onPress={() => { flatlistRef.current?.scrollToIndex({ animated: true, index: currentIdx - 1 }) }}>
              <ArrowWhite />
            </TouchableOpacity>
          </PageButton>
        }
        {currentIdx != reviewData.photos.length - 1 &&
          <PageButton style={{ right: 10 }}>
            <TouchableOpacity onPress={() => { flatlistRef.current?.scrollToIndex({ animated: true, index: currentIdx + 1 }) }}>
              <ArrowWhite transform={[{ rotate: '180deg' }]} />
            </TouchableOpacity>
          </PageButton>
        }
        <FlatList
          ref={flatlistRef}
          onScroll={(e) => { setCurrentIdx(Math.floor(e.nativeEvent.contentOffset.x / width)) }}
          data={reviewData.photos}
          pagingEnabled
          renderItem={({ item }: any) => <Image source={{ uri: item.imgfile }} style={{ width: width, height: height * 0.3 }} />}
          horizontal
        />
      </View>
      <TextBox>
        <Text style={TextStyles.nickname}>{reviewData.nickname}</Text>
        <Text style={TextStyles.date}>{reviewData.created.slice(0, 10).replace(/-/gi, '.')}</Text>
        <Text style={TextStyles.content}>{reviewData.contents}</Text>
        {
          isWriter && 
          <View style={{display:'flex', flexDirection:'row', alignSelf:'flex-end'}}>
            <TouchableOpacity onPress={deleteReview}><Text style={TextStyles.button}>삭제하기</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=> {setReviewModal(true);}}><Text style={TextStyles.button}>수정하기</Text></TouchableOpacity>
          </View>
        }
      </TextBox>
    </Section >
  )
}

const TextStyles = StyleSheet.create({
  nickname: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  date: {
    color: '#FFFFFF',
    fontSize: 7,
    marginBottom: 10,
  },
  content: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 10
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    color:'#FFFFFF',
    marginRight: 5,
  }
})
