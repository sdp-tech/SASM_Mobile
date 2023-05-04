import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import { Request } from '../../../common/requests'
import { getNickname } from '../../../common/storage'
import { reviewDataProps } from './DetailCard'
import CardView from '../../../common/CardView'
import ReviewDetail from './ReviewDetail'

const ReviewBox = styled.View`
  border-color: #DDDDDD;
  border-bottom-width: 1px;
  padding-vertical: 15px;
`
const TextBox = styled.View`
  padding-left: 15px;
`


interface UserReviewsProps {
  reviewData: reviewDataProps;
}

export default function UserReviews({ reviewData }: UserReviewsProps): JSX.Element {
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const request = new Request();
  useEffect(() => {
    const _getNickname = async () => {
      const _temp = await getNickname();
      if (_temp) {
        setNickname(_temp);
      }
    }
    _getNickname();
  }, []);
  const deleteReview = async () => {
    const response = await request.delete(`/places/place_review/${reviewData.id}/`);
    // setTab(!tab);
  }
  return (
    <ReviewBox>
      <Modal visible={reviewModal}>
        <ReviewDetail setReviewModal={setReviewModal} reviewData={reviewData} />
      </Modal>
      {
        reviewData &&
        <>

          {
            reviewData.photos.length != 0 &&
            <CardView
              data={reviewData.photos}
              renderItem={({ item }: any) => <Image source={{ uri: item.imgfile }} style={{ height: 150, width: 200, marginHorizontal: 5 }} />}
              gap={10}
              offset={10}
              pageWidth={200}
              height={150}
              dot={false}
            />
          }
          <TouchableOpacity onPress={() => { setReviewModal(true) }}>
          <TextBox>
            <Text style={TextStyles.common}>
              {reviewData.nickname}
            </Text>
            <Text style={TextStyles.common}>
              {reviewData.contents}
            </Text>
            <Text style={TextStyles.date}>
              {reviewData.created.slice(0, 10).replace(/-/gi, '.')}
            </Text>
          </TextBox>
        </TouchableOpacity>
    </>
      }
    </ReviewBox >
  )
}

const TextStyles = StyleSheet.create({
  date: {
    fontSize: 10,
    color: '#9A9A9A',
  },
  common: {
    fontSize: 14,
    marginVertical: 5
  }
})