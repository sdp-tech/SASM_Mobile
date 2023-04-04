import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableOpacity, View, Image, StyleSheet,Dimensions, Button, Text } from 'react-native';
//import Card from "@mui/material/Card";
//import CardContent from "@mui/material/CardContent";
//import { CardMedia } from "@mui/material";
import HeartButton from "../../../common/Heart";
//import { useCookies } from "react-cookie";
import axios from "axios";
import Loading from "../../../common/Loading";
//import Typography from "@mui/material/Typography";
//import { Link, useNavigate } from "react-router-dom";
import {Request} from "../../../common/requests";
import { MatchCategory, CATEGORY_LIST } from "../../../common/Category";
//import { useMediaQuery } from "react-responsive";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import ReactDOM from 'react-dom';
import { useNavigation } from "@react-navigation/native";

const WindowWidth = Dimensions.get("window").width;
const WindowHeight = Dimensions.get("window").height;

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
// const PlacenameBox = styled.View`
//   box-sizing: border-box;
//   display: flex;
//   width: 100%;
//   font-weight: 550;
//   font-size: 1rem;
//   align-items: center;
//   color:#000000;
//   margin-top: -2%;
//   margin-bottom: 5%;
//   justify-content: space-between;
// `;

// // 기존에 존재하는 버튼에 재스타일
// const Button = styled(TouchableOpacity)`
//   background-color: #ffffff;
//   height: 50px;
//   font-size: 20px;
//   font-weight: 700;
//   border-radius: 15px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   cursor: pointer;
// `;
// const LikeButton = styled(Button)({
//   boxSizing: "border-box",
//   border: "none",
//   display: "flex",
//   height: "30",
//   width: "30",
//   alignItems: 'center',
//   justifyContent: 'center',
// });


export default function ItemCard(props) {
  const [like, setLike] = useState(false);
  //const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [loading, setLoading] = useState(true);
  //const navigate = useNavigate();
  // const isMobile = useMediaQuery({ query: "(max-width:768px)" });
  // const width = isMobile ? 80 : 24;
  // const height = isMobile ? 45 : 13.5;
  //const request = new Request(cookies, localStorage, navigate);

  const navigation = useNavigation();
  const request = new Request();
  // 좋아요 클릭 이벤트
  const toggleLike = async (id) => {
    const response = await request.post("/places/place_like/", { id: id }, null); 
    console.log("response", response);

    //색상 채우기
    setLike(!like);
  };

  return (
    <View>
      <View
        // sx={{
        //   minWidth: "width",
        //   maxWidth: "width",
        //   display: "flex",
        //   flexDirection: "column",
        //   alignItems: "center",
        // }}
      >
        <Image
        source={{uri: props.rep_pic}}
        width={100}
        height={100}
        />
        <View
          sx={{
            height: "2.5vw",
            minWidth: 'width',
            maxWidth: 'width',
            display: "flex",
            flexFlow: "column",
          }}
        >
           <TouchableOpacity
            onPress={() => navigation.navigate('맵', { place_id: props.place_id })}
            style={{ textDecoration: 'none' }}
          >
            <View style={styles.PlacenameBox}>
              <Text>{props.place_name}</Text>
              <View style={{ display: 'flex', }}>
              <Image
              source={{
                uri: `../../../assets/img/Category/Category${MatchCategory(props.category)}.svg`,
                cache: 'only-if-cached',
                headers: {Pragma: 'no-cache'}
              }}
              onError={() => {// Load a fallback image
                require('../../../assets/img/Category/Category0.svg');
                }}/>
                {/* <Button style={styles.LikeButton}>
                  <HeartButton like={!like} onClick={() => toggleLike(props.id)} />
                  HeartButton
                </Button> */}
              </View>
            </View>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

