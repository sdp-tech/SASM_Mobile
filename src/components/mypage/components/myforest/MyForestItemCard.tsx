import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import styled from 'styled-components/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ForestStackParams } from '../../../../pages/Forest';
import { TabProps } from '../../../../../App';
import Heart from '../../../../common/Heart';
import { Request } from '../../../../common/requests';

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

export default function MyForestItemCard({ props, edit, rerender }: { props: MyForestItemCardProps, edit: boolean, rerender: () => void }) {
  const request = new Request();
  const [like, setLike] = useState<boolean>(true);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const { id, title, forest_like, preview, rep_pic, writer, writer_is_verified } = props;

  const handlelike = async () => {
    const response = await request.post('/mypage/forest_like/', { id: id });
    setLike(!like);
    rerender();
  }
  return (
    <View style={{ position: 'relative' }}>
      <TouchableWithoutFeedback onPress={() => { navigationToTab.navigate('포레스트', { id: id }) }}>
        <Container>
          <TextBox>
            <Text style={TextStyles.title} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
            <Text style={TextStyles.preview} numberOfLines={2} ellipsizeMode='tail'>{preview}</Text>
            <Text style={TextStyles.writer}>{writer}</Text>
          </TextBox>
          <Image source={{ uri: rep_pic }} style={{ width: 88, height: 88 }} />
        </Container>
      </TouchableWithoutFeedback>
      {
        edit &&
        <View style={{ position: 'absolute', right: 10, top: 10 }}>
          <Heart like={like} onPress={handlelike} />
        </View>
      }
    </View>
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
    color: '#373737'
  },
  writer: {
    fontSize: 12,
    lineHeight: 14.4,
    color: '#67D393',
    fontWeight: '600'
  }
})
