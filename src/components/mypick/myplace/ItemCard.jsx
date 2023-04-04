import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableOpacity, View, Image, StyleSheet, Dimensions, Button, Text } from 'react-native';
import Heart from "../../../common/Heart";
//import { useCookies } from "react-cookie";
import axios from "axios";
import Loading from "../../../common/Loading";
import { Request } from "../../../common/requests";
import { MatchCategory, CATEGORY_LIST } from "../../../common/Category";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  ImageSection: {
    alignItems: 'center',
    //flex:1
    marginBottom: 20
  },
  NameHeartCategoryBox: {
    width: '100%',
    alignItems: 'center',
    //backgroundColor: '#00000',
    marginTop: "-2%",
    marginBottom: '5%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    //flex:1
    //backgroundColor: 'pink'
  },
  NameBox: {
    //backgroundColor: 'white'
  },
  CategoryIcon: {
    //display: 'flex',
    backgroundColor: 'blue',
    alignItems:'center'
  },
  LikeButton: {
    border: 'none',
    //flex:1,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'green'
  },
})



export default function ItemCard(props) {
  const [like, setLike] = useState(false);
  //const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const request = new Request();
  const categoryIndex = MatchCategory(props.category);
  const categorySrc = '../../../assets/img/Category/Category'+categoryIndex+'.svg'
  // console.log("catgory", categoryIndex);
  

  // 좋아요 클릭 이벤트
  const toggleLike = async () => {
    const response = await request.post("/places/place_like/", { id: props.place_id }, null);
    console.log("response", response);
    //색상 채우기
    setLike(!like);
  };

  return (
    <View style={{ width: 300, marginTop: 3, marginBottom:3, paddingVertical:3 }}>
      <View style={styles.ImageSection}>
        <Image
          source={{ uri: props.rep_pic }}
          width={300}
          height={150}
          borderRadius={20}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('맵', { id: props.place_id })}
        style={{ textDecoration: 'none' }}
      >
        <View style={styles.NameHeartCategoryBox}>
          <View style={styles.NameBox}>
            <Text style={{ fontSize: 18, fontWeight: 600, }}>{props.place_name}</Text>
          </View>
          <View style={styles.CategoryIcon}>
            {/* <Image 
            source={categorySrc} 
            width={30}
            height={30}
            /> */}
          </View>
          <View style={styles.LikeButton}>
            {props.place_like === 'ok' ? (
              <Heart like={!like} onPress={toggleLike} />
            ) : (
              <Heart like={like} onPress={toggleLike} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
    // </View>
  );
}

