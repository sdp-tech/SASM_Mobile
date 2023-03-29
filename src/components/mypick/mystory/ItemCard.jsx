import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableOpacity, StyleSheet, Image, View,Button, Text } from 'react-native';
//import Card from "@mui/material/Card";
//import CardContent from "@mui/material/CardContent";
//import { CardMedia } from "@mui/material";
import HeartButton from "../../../common/Heart";
import { useCookies } from "react-cookie";
import axios from "axios";
import Loading from "../../../common/Loading";
//import Typography from "@mui/material/Typography";
//import { Link, useNavigate } from "react-router-dom";
import {Request} from "../../../common/requests";
import { MatchCategory, CATEGORY_LIST } from "../../../common/Category";
//import { useMediaQuery } from "react-responsive";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

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
//   font-size: 1.2rem;
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
//   height: "30px",
//   width: "30px",
// });

function ItemCard(props) {
  // const isMobile = useMediaQuery({ query: '(max-width:768px)' });
  // const width = isMobile ? '80vw' : '32vw';
  // const height = isMobile ? '45vw' : '18vw';
  const [like, setLike] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const request = new Request();

  // 좋아요 클릭 이벤트
  const toggleLike = async (id) => {
    const response = await request.post("/story/story_like/", { id: id }, null); 
    setLike(!like);
  };

  return (
    <View>
      <View>
        <Image
        source={{uri: props.rep_pic} }
        width={100}
        height={100}
        />
        

          <TouchableOpacity
            onPress={() => navigation.navigate('스토리', { story_id: props.story_id })}
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
                <Button style={styles.LikeButton} title='LikeButton'>
                  <Button style={styles.HeartButton} like={!like} onClick={() => toggleLike(props.id)} title='HeartButton' />
                </Button>
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
/*
export default function ItemCard(props) {
  const isMobile = useMediaQuery({query: "(max-width:768px)"});
  const width = isMobile?"80vw":"32vw";
  const height = isMobile?"45vw":"18vw";
  const [like, setLike] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [loading, setLoading] = useState(true);
  //const navigate = useNavigate();
  const request = new Request(cookies, localStorage, navigate);
  // 좋아요 클릭 이벤트
  const toggleLike = async (id) => {
    const response = await request.post("/places/place_like/", { id: id }, null);
    //console.log("response", response);

    //색상 채우기
    setLike(!like);
  };

  return (
    <View>
      <Card
        sx={{
          minWidth: width,
          maxWidth: width,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            // 16: 9,
            minHeight: height,
            minWidth: width,
            maxHeight: height,
            maxWidth: width,
            display: "flex",
          }}
          image={props.rep_pic}
          alt="placeImage"
        />

        <CardContent
          sx={{
            minWidth: width,
            maxWidth: width,
            display: "flex",
            flexFlow: "column",
          }}
        >
          <Link to={`/story/${props.story_id}`} style={{ textDecoration: 'none' }}>
            <PlacenameBox>
              <Text>{props.place_name}</Text>
              <View style={{display:'flex', marginRight:10}}>
              <Image
              source={{
                uri: `../../../assets/img/Category/Category${MatchCategory(props.category)}.svg`,
                cache: 'only-if-cached',
                headers: {Pragma: 'no-cache'}
              }}
              onError={() => {// Load a fallback image
                require('../../../assets/img/Category/Category0.svg');
                }}/>
                <LikeButton>
                  <HeartButton like={!like} onClick={() => toggleLike(props.id)} />
                </LikeButton>
              </View>
            </PlacenameBox>
          </Link>
          <View style={{borderBottom:"2px #44ADF7 solid" ,paddingBottom:10}}>
            {props.title}
          </View>
          <View style={{paddingTop:10, fontSize:"0.8rem"}}>
            {props.preview}
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
*/

