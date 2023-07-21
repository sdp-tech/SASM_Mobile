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

interface ItemCardProps extends MyPageParams {
  props: any;
}

const ItemCard = ({props}: ItemCardProps) => {
  const { width, height } = Dimensions.get("window");
  const [like, setLike] = useState(false);
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const request = new Request();

  // 좋아요 클릭 이벤트
  const toggleLike = async () => {
    const response = await request.post("/stories/story_like/", { id: props.id }, null);
    console.log("mystory", response);
    setLike(!like);
  };

  const category = () => {
    let idx = MatchCategory(props.category);
    let list = [
      <Selector0 color={CATEGORY_LIST[0].color}/>,
      <Selector1 color={CATEGORY_LIST[1].color}/>,
      <Selector2 color={CATEGORY_LIST[2].color}/>,
      <Selector3 color={CATEGORY_LIST[3].color}/>,
      <Selector4 color={CATEGORY_LIST[4].color}/>,
      <Selector5 color={CATEGORY_LIST[5].color}/>
    ]
    return list[idx];
  }

  return (
    <TouchableOpacity style={{marginHorizontal: 10, marginBottom: 10}} onPress={() => { navigationToTab.navigate('스토리', { id: props.id })}}>
      <ImageBackground
        source={{ uri: props.rep_pic }}
        style={{width: 170, height: 220}}
      >
        <View style={{width: 170, height: 220, backgroundColor: 'rgba(0,0,0,0.3)', padding: 10}}>
          <View style={{flex: 1}}>
            <Text style={textStyles.title}>{props.title}</Text>
            <Text style={textStyles.place_name}>{props.place_name}</Text>
          </View>
          <Text style={textStyles.preview} numberOfLines={4}>{props.preview}</Text>
        </View>
      </ImageBackground>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5}}>
        <Text style={[textStyles.writer, {color: props.verified ? '#209DF5' : '#89C77F'}]}>{props.verified ? ('Editor') : ('User')}</Text>
        <Text style={textStyles.writer}> {props.nickname}</Text>
        <View style={{flex: 1, alignItems: 'flex-end'}}>{category()}</View>
      </View>
    </TouchableOpacity>
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

export default ItemCard;