import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableOpacity, StyleSheet, Image, View,Button, Text } from 'react-native';
//import { useCookies } from "react-cookie";
import axios from "axios";
import Loading from "../../../common/Loading";
import {Request} from "../../../common/requests";
import { MatchCategory, CATEGORY_LIST } from "../../../common/Category";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Heart from '../../../common/Heart';

const styles = StyleSheet.create({
  PlacenameBox:{
    display:'flex',
    width:'100%',
    fontWeight:550,
    fontSize: 1,
    alignItems:'center',
    backgroundColor:'#00000',
    marginTop:"-2%",
    marginBottom:'5%',
    justifyContent:'space-between'
  },
  Button:{
    backgroundColor: '#ffffff',
    height: 50,
    fontSize: 20,
    fontWeight: 700,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // cursor: pointer;
  },
  LikeButton:{
    border:'none',
    flex:1,
    height:30,
    width:30,
    alignItems:'center',
    justifyContent:'center'
  },
})


function ItemCard(props) {
  const [like, setLike] = useState(false);
  //const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const request = new Request();

  // 좋아요 클릭 이벤트
  const toggleLike = async () => {
    const response = await request.post("/stories/story_like/", { id: props.story_id }, null); 
    console.log("mystory", response);
    setLike(!like);

  };

  return (
    <View>
      <View>
        <Image
        source={{uri: props.rep_pic} }
        width={150}
        height={200}
        />
        

          <TouchableOpacity
            onPress={() => {navigation.navigate('스토리', { id: props.story_id }) }}
            style={{ textDecoration: 'none' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>{props.place_name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                <Image
                  source={{
                    uri: `../../../assets/img/Category/Category${MatchCategory(props.category)}.svg`,
                    cache: 'only-if-cached',
                    headers: { Pragma: 'no-cache' },
                  }}
                  onError={() => {
                    require('../../../assets/img/Category/Category0.svg');
                  }}
                  style={{ width: 20, height: 20 }}
                />
                <View>
                    {props.story_like === 'ok' ? (
                        <Heart like={!like} onPress={toggleLike} />
                    ) : (
                        <Heart like={like} onPress={toggleLike} />
                    )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ borderBottomWidth: 2, borderColor: '#44ADF7', paddingBottom: 10 }}>
            <Text>{props.title}</Text>
          </View>
          <View style={{ paddingTop: 10, fontSize: 12 }}>
            <Text>{props.preview}</Text>
          </View>
      </View>
    </View>
  );
}

export default ItemCard;
