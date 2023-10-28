import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Alert, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import styled from 'styled-components/native';
import { reviewDataProps } from './DetailCard';
import CardView from '../../../common/CardView';
import ReviewDetail from './ReviewDetail';
import FastImage from 'react-native-fast-image';

const ReviewBox = styled.View`
  border-color: #DDDDDD;
  border-bottom-width: 1px;
  padding-vertical: 15px;
`
const TextBox = styled.View`
  padding-left: 27px;
  margin-top: 10px;
`


interface UserReviewsProps {
  reviewData: reviewDataProps;
  rerender: () => void;
  category: string;
}

export default function UserReviews({ reviewData, rerender, category }: UserReviewsProps): JSX.Element {
  const [detailModal, setDetailModal] = useState<boolean>(false);

  return (
    <ReviewBox>
      <Modal visible={detailModal}>
        <ReviewDetail category={category} setDetailModal={setDetailModal} reviewData={reviewData} rerender={rerender} />
      </Modal>
      {
        reviewData &&
        <>
          {
            reviewData.photos.length != 0 &&
            <CardView
              data={reviewData.photos}
              renderItem={({ item }: any) => <FastImage source={{ uri: item.imgfile, priority: FastImage.priority.normal  }} style={{ height: 150, width: 200, marginHorizontal: 5 }} />}
              gap={8}
              offset={19}
              pageWidth={194}
              dot={false}
            />
          }
          <TouchableOpacity onPress={() => { setDetailModal(true) }}>
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
    fontSize: 8,
    color: '#9A9A9A',
  },
  common: {
    fontSize: 12,
    color: '#000000',
    marginVertical: 5
  }
})