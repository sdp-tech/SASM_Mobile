import React, { useState } from "react";
import styled from "styled-components/native";
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import { TextPretendard as Text } from '../../../../common/CustomText';
import Heart from "../../../../common/Heart";
//import { useCookies } from "react-cookie";
import axios from "axios";
import Loading from "../../../../common/Loading";
import { Request } from "../../../../common/requests";
import { MatchCategory, CATEGORY_LIST } from "../../../../common/Category";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  Container: {
    width: 120,
    marginTop: 3,
    marginBottom: 3,
    paddingVertical: 3,
    marginHorizontal: 3,
    //backgroundColor:'red'
  },
  ImageSection: {
    alignItems: "center",
    //flex:1
    marginBottom: 5,
  },
  NameHeartCategoryBox: {
    width: "100%",
    alignItems: "center",
    //backgroundColor: '#00000',
    marginTop: "-2%",
    marginBottom: "5%",
    justifyContent: "space-between",
    flexDirection: "row",
    //flex:1
    //backgroundColor: 'pink'
  },
  NameBox: {
    //backgroundColor: 'white'
    width: "100%",
  },
});

export default function ItemCard(props) {
  const [like, setLike] = useState(false);
  //const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const request = new Request();
  const categoryIndex = MatchCategory(props.category);
  const categorySrc =
    "../../../assets/img/Category/Category" + categoryIndex + ".svg";
  // console.log("catgory", categoryIndex);

  // 좋아요 클릭 이벤트
  const toggleLike = async () => {
    const response = await request.post(
      "/places/place_like/",
      { id: props.place_id },
      null
    );
    console.log("response", response);
    //색상 채우기
    setLike(!like);
  };

  return (
    <View style={styles.Container}>
      <View style={styles.ImageSection}>
        <Image source={{ uri: props.rep_pic }} width={120} height={150} />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("맵", { id: props.place_id })}
      >
        <View style={styles.NameBox}>
          <Text style={{ fontSize: 15, fontWeight: 200 }}>
            {props.place_name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
    // </View>
  );
}
