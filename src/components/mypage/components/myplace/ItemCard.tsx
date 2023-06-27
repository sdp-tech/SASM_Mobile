import React, { useState } from "react";
import { TouchableOpacity, View, ImageBackground, StyleSheet, Dimensions } from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import Heart from "../../../../common/Heart";
import { Request } from "../../../../common/requests";
import { CATEGORY_LIST, MatchCategory } from "../../../../common/Category";
import Selector0 from "../../../../assets/img/Category/Selector0.svg";
import Selector1 from "../../../../assets/img/Category/Selector1.svg";
import Selector2 from "../../../../assets/img/Category/Selector2.svg";
import Selector3 from "../../../../assets/img/Category/Selector3.svg";
import Selector4 from "../../../../assets/img/Category/Selector4.svg";
import Selector5 from "../../../../assets/img/Category/Selector5.svg";
import { MyPageParams } from "../../../../pages/MyPage";

interface ItemCardProps extends MyPageParams {
  props: any;
}

const ItemCard = ({ props, navigation }: ItemCardProps) => {
  const [like, setLike] = useState(false);
  const request = new Request();
  // 좋아요 클릭 이벤트
  const toggleLike = async () => {
    const response = await request.post(
      "/places/place_like/",
      { id: props.place_id },
      null
    );
    //색상 채우기
    setLike(!like);
  };

  const category = () => {
    let idx = MatchCategory(props.category);
    let list = [
      <Selector0 color={CATEGORY_LIST[0].color} width={15} height={15}/>,
      <Selector1 color={CATEGORY_LIST[1].color} width={15} height={15}/>,
      <Selector2 color={CATEGORY_LIST[2].color} width={15} height={15}/>,
      <Selector3 color={CATEGORY_LIST[3].color} width={15} height={15}/>,
      <Selector4 color={CATEGORY_LIST[4].color} width={15} height={15}/>,
      <Selector5 color={CATEGORY_LIST[5].color} width={15} height={15}/>
    ]
    return list[idx];
  }

  const handlePageGoToMap = async () => {
    let coor = {latitude: 0, longitude: 0};
    const places = await request.get('/places/map_info/', {}, {});
    for (const place of places.data.data){
      if (place.id === props.id){
        coor = {latitude: place.latitude, longitude: place.longitude}
      }
    }
    navigation.navigate('맵', { coor: {latitude: coor.latitude, longitude: coor.longitude}})
  }

  return (
    <TouchableOpacity style={{marginHorizontal: 6, marginBottom: 20}} onPress={handlePageGoToMap}>
      <ImageBackground
        source={{ uri: props.rep_pic }}
        style={{width: 110, height: 150}}
      >
        <View style={{width: 110, height: 150, backgroundColor: 'rgba(0,0,0,0.3)', padding: 5, justifyContent: 'flex-end'}}>
          <View style={{flexDirection: 'row'}}>
            {category()}
            <Text style={textStyles.address}>서대문구, 신촌</Text>
          </View>
          <Text numberOfLines={1} style={textStyles.place_name}>{props.place_name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const textStyles = StyleSheet.create({
  place_name: {
    fontSize: 12,
    color: "#F4F4F4",
    fontWeight: "600",
    lineHeight: 18,
  },
  address: {
    fontSize: 10,
    lineHeight: 15,
    color: "#F4F4F4",
    marginLeft: 3
  }
})

export default ItemCard;