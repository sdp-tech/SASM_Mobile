import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, ImageBackground, Dimensions } from 'react-native';
import { TextPretendard as Text } from '../../../../common/CustomText';
import { Request } from "../../../../common/requests";
import { MyPageParams } from "../../../../pages/MyPage";
import { CATEGORY_LIST, MatchCategory } from "../../../../common/Category";
import Selector0 from "../../../../assets/img/Category/Selector0.svg";
import Selector1 from "../../../../assets/img/Category/Selector1.svg";
import Selector2 from "../../../../assets/img/Category/Selector2.svg";
import Selector3 from "../../../../assets/img/Category/Selector3.svg";
import Selector4 from "../../../../assets/img/Category/Selector4.svg";
import Selector5 from "../../../../assets/img/Category/Selector5.svg";
import Heart from '../../../../common/Heart';
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
  const [like, setLike] = useState(true);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const request = new Request();

  // 좋아요 클릭 이벤트
  const handleLike = async () => {
    const response = await request.post("/stories/story_like/", { id: id });
    setLike(!like);
    rerender();
  };

  const categoryIcon = () => {
    let idx = MatchCategory(category);
    let list = [
      <Selector0 color={CATEGORY_LIST[0].color} />,
      <Selector1 color={CATEGORY_LIST[1].color} />,
      <Selector2 color={CATEGORY_LIST[2].color} />,
      <Selector3 color={CATEGORY_LIST[3].color} />,
      <Selector4 color={CATEGORY_LIST[4].color} />,
      <Selector5 color={CATEGORY_LIST[5].color} />
    ]
    return list[idx];
  }

  return (
    <View style={{ position: 'relative' }}>
      <TouchableWithoutFeedback style={{ marginHorizontal: 10, marginBottom: 10 }} onPress={() => { navigationToTab.navigate('스토리', { id: id }) }}>
        <ImageBackground
          source={{ uri: rep_pic }}
          style={{ width: 170, height: 220 }}
        >
          <View style={{ width: 170, height: 220, backgroundColor: 'rgba(0,0,0,0.3)', padding: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={textStyles.title}>{title}</Text>
              <Text style={textStyles.place_name}>{place_name}</Text>
            </View>
            <Text style={textStyles.preview} numberOfLines={4}>{preview}</Text>
          </View>
        </ImageBackground>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5 }}>
          {/* <Text style={[textStyles.writer, {color: verified ? '#209DF5' : '#89C77F'}]}>{verified ? ('Editor') : ('User')}</Text> */}
          <Text style={textStyles.writer}> {nickname}</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>{categoryIcon()}</View>
        </View>
      </TouchableWithoutFeedback>
      {
        edit &&
        <View style={{position:'absolute', top: 10, right: 10}}>
          <Heart like={like} onPress={handleLike} />
        </View>
      }
    </View>
  );
}

const textStyles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: "#F4F4F4",
    fontWeight: "600",
    lineHeight: 18,
  },
  place_name: {
    fontSize: 16,
    color: "#F4F4F4",
    fontWeight: "700",
    lineHeight: 22,
  },
  preview: {
    fontSize: 12,
    color: "#F4F4F4",
    fontWeight: "400",
    lineHeight: 18,
  },
  writer: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18
  }
})

export default MyStoryItemCard;