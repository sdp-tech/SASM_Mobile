import React, { useState } from "react";
import { TouchableOpacity, View, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import Heart from "../../../../common/Heart";
import { Request } from "../../../../common/requests";
import { CategoryIcon } from "../../../../common/Category";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabProps } from "../../../../../App";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";

export interface MyPlaceItemCardProps {
  id: number;
  place_name: string;
  category: string;
  rep_pic: string;
  address: string;
}


const MyPlaceItemCard = ({ data, edit, rerender }: { data: MyPlaceItemCardProps, edit: boolean, rerender: () => void }) => {
  const navigationToTab = useNavigation<StackNavigationProp<TabProps>>();
  const [like, setLike] = useState(true);
  const request = new Request();
  // 좋아요 클릭 이벤트
  const handleLike = async () => {
    const response = await request.post("/places/place_like/",
      { id: data.id },
    );
    setLike(!like);
    rerender();
  };

  const handlePageGoToMap = async () => {
    navigationToTab.navigate('맵', {place_name: data.place_name})
  }

  return (
    <View style={{ position: 'relative' }}>
      <TouchableWithoutFeedback style={{ marginHorizontal: 6, marginBottom: 10 }} onPress={handlePageGoToMap}>
        <FastImage
          source={{ uri: data.rep_pic, priority: FastImage.priority.normal }}
          style={{ width: 110, height: 150 }}
        >
          <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', padding: 5, justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CategoryIcon data={data.category} />
              <Text style={textStyles.address}>{data.address.split(' ')[1]}, {data.address.split(' ')[0]}</Text>
            </View>
            <Text numberOfLines={1} style={textStyles.place_name}>{data.place_name}</Text>
          </View>
        </FastImage>
      </TouchableWithoutFeedback>
      {
        edit &&
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          <Heart like={like} onPress={handleLike} size={20} color={'white'} />
        </View>
      }
    </View>
  );
}

const textStyles = StyleSheet.create({
  place_name: {
    fontSize: 14,
    color: "#F4F4F4",
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: -0.6
  },
  address: {
    fontSize: 12,
    lineHeight: 18,
    color: "#F4F4F4",
    marginLeft: 5,
  }
})

export default MyPlaceItemCard;