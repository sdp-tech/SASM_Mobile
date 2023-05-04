import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { reviewDataProps } from './DetailCard';
import styled from 'styled-components/native';
import Close from "../../../assets/img/common/Close.svg";
import ArrowWhite from "../../../assets/img/common/ArrowWhite.svg";

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
  setReviewModal: Dispatch<SetStateAction<boolean>>;
}

export default function ReviewDetail({ reviewData, setReviewModal }: ReviewDetailProps): JSX.Element {
  const { width, height } = Dimensions.get('window');
  const flatlistRef = useRef<FlatList>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);


  return (
    <Section>
      <CloseButton onPress={() => { setReviewModal(false) }}>
        <Close color={'#FFFFFF'} />
      </CloseButton>
      <View>
        {
          currentIdx != 0 &&
          <PageButton style={{left:10}}>
            <TouchableOpacity onPress={() => { flatlistRef.current?.scrollToIndex({ animated: true, index: currentIdx - 1 }) }}>
              <ArrowWhite />
            </TouchableOpacity>
          </PageButton>
        }
        {currentIdx != reviewData.photos.length - 1 &&
          <PageButton style={{right:10}}>
            <TouchableOpacity onPress={() => { flatlistRef.current?.scrollToIndex({ animated: true, index: currentIdx + 1 }) }}>
              <ArrowWhite transform={[{rotate:'180deg'}]}/>
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
      </TextBox>

    </Section >
  )
}

const TextStyles = StyleSheet.create({
  nickname: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  date: {
    color: '#FFFFFF',
    fontSize: 12,
    marginVertical: 10,
  },
  content: {
    color: '#FFFFFF',
    fontSize: 16,
  }
})
