import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ForestStackParams } from '../../../../pages/Forest';
import { TabProps } from '../../../../../App';

const Container = styled.View`
  display: flex;
  flex-direction: row;
  border-color: rgba(0,0,0,0.4);
  border-bottom-width: 1px;
  width: 100%;
  padding-vertical: 20px;
`

const TextBox = styled.View`
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin-top: 15px;
  margin-right: 20px;
`

export interface MyForestItemCardProps {
  id: number;
  title: string;
  forest_like: boolean;
  preview: string;
  rep_pic: string;
  writer: string;
  writer_is_verified: boolean;
}

export default function MyForestItemCard({ props }: { props: MyForestItemCardProps }) {
  // const navigateToForest = useNavigation<StackNavigationProp<ForestStackParams>>();
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const { id, title, forest_like, preview, rep_pic, writer, writer_is_verified } = props;
  return (
    <Container>
      <TextBox>
        <Text style={TextStyles.title} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
        <Text style={TextStyles.preview} numberOfLines={2} ellipsizeMode='tail'>{preview}</Text>
        <Text style={TextStyles.writer}>{writer}</Text>
      </TextBox>
      {/* <TouchableWithoutFeedback onPress={()=>{navigateToForest.navigate('PostDetail', {})}}> */}
      <TouchableWithoutFeedback onPress={()=>{navigationToTab.navigate('포레스트', {id:id})}}>
      <Image source={{ uri: rep_pic }} style={{ width: 88, height: 88 }} />
      </TouchableWithoutFeedback>
    </Container>
  )
}

const TextStyles = StyleSheet.create({
  title: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.6,
    fontWeight: '700',
    color: '#373737'
  },
  preview: {
    fontSize: 12,
    lineHeight: 14.4,
    letterSpacing: -0.6,
    color:'#373737'
  },
  writer: {
    fontSize: 12,
    lineHeight: 14.4,
    color: '#67D393',
    fontWeight: '600'
  }
})
