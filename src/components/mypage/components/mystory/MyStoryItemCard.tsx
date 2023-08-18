import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import { Request } from "../../../../common/requests";
import { CATEGORY_LIST, MatchCategory } from "../../../../common/Category";
import Selector0 from "../../../../assets/img/Category/Selector0.svg";
import Selector1 from "../../../../assets/img/Category/Selector1.svg";
import Selector2 from "../../../../assets/img/Category/Selector2.svg";
import Selector3 from "../../../../assets/img/Category/Selector3.svg";
import Selector4 from "../../../../assets/img/Category/Selector4.svg";
import Selector5 from "../../../../assets/img/Category/Selector5.svg";
import Heart from '../../../../common/Heart';
import { CategoryIcon } from "../../../../common/Category";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { TabProps } from "../../../../../App";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export interface MyStroyItemCardProps {
  category: string;
  extra_pics: string[];
  id: number;
  nickname: string;
  place_name: string;
  preview: string;
  rep_pic: string;
  story_like: boolean;
  story_review: string;
  title: string;
  writer: string;
}

const MyStoryItemCard = ({ data, edit, rerender }: { data: MyStroyItemCardProps, edit: boolean, rerender: () => void }) => {
  const { category, extra_pics, id, nickname, place_name, preview, rep_pic, story_like, story_review, title, writer } = data;
  const [like, setLike] = useState(story_like);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const request = new Request();

  // 좋아요 클릭 이벤트
  const handleLike = async () => {
    const response = await request.post(`/stories/${id}/story_like/`);
    setLike(!like);
    rerender();
  };

  return (
    <View style={{ position: 'relative' }}>
      <TouchableWithoutFeedback style={{ marginHorizontal: 10, marginBottom: 10 }} onPress={() => { navigationToTab.navigate('스토리', { id: id }) }}>
        <ImageBackground
          source={{ uri: rep_pic }}
          style={{ width: 170, height: 220 }}
        >
          <View style={{ width: 170, height: 220, backgroundColor: 'rgba(0,0,0,0.3)', padding: 10 }}>
            <View style={{ flex: 1, width: edit ? 130 : 'auto' }}>
              <Text style={textStyles.title}>{title}</Text>
              <Text style={textStyles.place_name}>{place_name}</Text>
            </View>
            <Text style={textStyles.preview} numberOfLines={3}>{preview}</Text>
          </View>
        </ImageBackground>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5 }}>
          {/* <Text style={[textStyles.writer, {color: verified ? '#209DF5' : '#89C77F'}]}>{verified ? ('Editor') : ('User')}</Text> */}
          <Text style={textStyles.writer}> {nickname}</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <CategoryIcon data={category} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      {
        edit &&
        <View style={{position:'absolute', top: 10, right: 15}}>
          <Heart like={like} onPress={handleLike} size={20} color={'white'} />
        </View>
      }
    </View>
  );
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: "#F4F4F4",
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: -0.6
  },
  place_name: {
    fontSize: 16,
    color: "#F4F4F4",
    fontWeight: "700",
    lineHeight: 22,
    letterSpacing: -0.6
  },
  preview: {
    fontSize: 10,
    color: "#F4F4F4",
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: -0.6
  },
  writer: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    letterSpacing: -0.6
  }
})

export default MyStoryItemCard;