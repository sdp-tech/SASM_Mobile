import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components/native'
import { Request } from '../../../common/requests'
import { getNickname } from '../../../common/storage'
import { reviewDataProps } from './DetailCard'

const ReviewBox = styled.View`
  border-color: #535351;
  border-bottom-width: 1px;
  margin: 5px 0;

`
const ImageBox = styled.View`
  display: flex;
  justify-contents: space-around;
`
const ButtonWrapper = styled.View`
  display: flex;
  flex-flow: row wrap;
`
const Button = styled.TouchableOpacity`
  padding: 5px;
`
interface UserReviewsProps {
  reviewData: reviewDataProps[] | undefined,
  tab: boolean,
  setTab: Dispatch<SetStateAction<boolean>>,
  setReviewModal: Dispatch<SetStateAction<boolean>>,
  setTargetId: Dispatch<SetStateAction<number>>,
}

export default function UserReviews({ reviewData, tab, setTab, setReviewModal, setTargetId }: UserReviewsProps): JSX.Element {
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
  const deleteReview = async (id: number) => {
    const response = await request.delete(`/places/place_review/${id}/`);
    setTab(!tab);
  }
  return (
    <View>
      {reviewData && reviewData.map((data: reviewDataProps) => {
        let isWriter = false;
        if (nickname == data.nickname) isWriter = true;
        return (
          <ReviewBox key={data.id}>
            <Text>{data.nickname}</Text>
            <Text>{data.created.slice(0, 10)}</Text>
            <Text>{data.contents}</Text>
            <ImageBox>
              {
                data?.photos.map((data, index) => {
                  {
                    return (
                      <Image key={index} source={{ uri: data.imgfile }} style={{ width: 100, height: 100 }} />
                    )
                  }
                })
              }
            </ImageBox>
            {
              isWriter ?
                <ButtonWrapper>
                  <Button onPress={() => {
                    Alert.alert(
                      '삭제하시겠습니까?',
                      '',
                      [
                        { text: "아니요" },
                        { text: "네", onPress: () => { deleteReview(data.id) }, style: 'destructive' },
                      ],
                      { cancelable: false }
                    )
                  }}><Text>삭제</Text></Button>
                  <Button onPress={()=>{}}><Text>수정</Text></Button>
                </ButtonWrapper>
                :
                null
            }
            {
              data.category.map((data, index)=>{return(<Text>{data.category}</Text>)})
            }
          </ReviewBox>
        )
      })}
    </View>
  )
}
