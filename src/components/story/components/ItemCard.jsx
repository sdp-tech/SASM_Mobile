import { useState, useEffect, useNavigate } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components';
import { Request } from '../../../common/requests';
import Loading from '../../../common/Loading';
import Heart from '../../../common/Heart';
import { useNavigation } from '@react-navigation/native';

const { width, height, fontScale } = Dimensions.get('screen');

const textStyles = StyleSheet.create({
    PlaceName: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 4,
        lineHeight: 24,
    },
    Title: {
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 19,
        marginBottom: 6,
    },
    Category: {
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 14,
        marginBottom: 7
    },
    Preview: {
        fontSize: 10,
        fontWeight: 500,
        lineHeight: 12,
        marginBottom: 8
        // numberOfLines: 3,
        // ellipsizeMode: 'tail'
    },
    More: {
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 14,
        color: '#01A0FC'
    }
})
const TitleBox = styled.View`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  color: #6c6c6c;
  margin-top: 7%;
  @media screen and (max-width: 768px) {
    width:100%;
  }
  font-size: 16px;
`;

const StoreNameBox = styled.View`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  left: 0%;
  top: 0%;
  bottom: 0%;
  
  font-family: 'Pretendard';
  font-style: bold;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height */
  
  
  color: #000000;
`;

const CategoryBox = styled.View`
  box-sizing: border-box;
  display: flex;
  margin-top: 2.5%;
  width: 100%;
  color: #000000;
  @media screen and (max-width: 768px) {
    width:100%;
  }
  font-size:0.8rem;
`;
const OptionBox = styled.View`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  color: #999999;
  padding-left: 2%;
  border-left: 2px solid #000000;
  @media screen and (max-width: 768px) {
    width:100%;
  }
  font-size: 0.8rem;
`;

const ContentBox = styled.View`
  box-sizing: border-box;
  display: flex;
  //margin-top: 1rem;
  width: 100%;
  overflow: hidden;
  min-height: 86px;
  max-height: 86px;
  color: #797979;
  @media screen and (max-width: 768px) {
    width:100%;
  }
  font-size: 0.8rem;
`;

// // 기존에 존재하는 버튼에 재스타일
// const Button = styled.Button`
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
//   margin: "2% 3% 2% 0",
// });

// const StyledCard = styled(Card)`
//   display: flex;
//   min-height: 15vw;
//   min-width: 30vw;
//   max-height: 15vw;
//   max-width: 30vw;
//   flex-direction: row;
//   @media screen and (max-width: 768px) {
//     flex-direction: column;
//     min-height: 120vw;
//     min-width: 60vw;
//     max-height: 120vw;
//     max-width: 60vw;
//   }
// `

const ItemCard = (props) => {

    const [like, setLike] = useState(false);
    //const [cookies, setCookie, removeCookie] = useCookies(["name"]);
    const [loading, setLoading] = useState(true);
    //const navigate = useNavigate();
    //const request = new Request(cookies, localStorage, navigate);
    const [items, setItems] = useState([]);

    const request = new Request();
    const navigation = useNavigation();

    // 좋아요 클릭 이벤트
    const toggleLike = async () => {
        // const token = cookies.name; // 쿠키에서 id 를 꺼내기
        // const token = localStorage.getItem("accessTK"); //localStorage에서 accesstoken꺼내기

        // if (!token) {
        //     alert("로그인이 필요합니다.");
        // } else {
        //     const response = await request.post("/stories/story_like/", { id: props.id }, null);
        //     console.log("response", response);

        //     //색상 채우기
        //     setLike(!like);
        // }
        const response = await request.post('/stories/story_like/', { id: props.id }, null);
        console.log("like => ", response)
        setLike(!like);
    };

    // const setStories = () => {
    //     items.push({
    //         _title: title,
    //         _category: category,
    //     })
    // }

    // const renderItem = ({ item }) => {
    //     return (
    //         <TouchableOpacity
    //             onPress = {onPress}>
    //             <Text>
    //                 {title}
    //                 {category}
    //             </Text>
    //         </TouchableOpacity>
    //     )
    // }

    const onPress = () => {
        navigation.navigate('StoryDetail', { id: props.id });
    }

    return (
        // <FlatList
        //     data = {items}
        //     renderItem = {renderItem}
        // />
        <SafeAreaView style = {{ flexDirection: 'row'}}>
            <Image
                style = {{
                    margin: 10,
                    width: 135,
                    height: 135,
                    borderRadius: 24,
                    flexShrink: 1
                }}
                src = {props.rep_pic}
                resizeMode = 'cover' />
                <View style = {{
                    position: 'absolute',
                    marginTop: 110,
                    marginLeft: 20,
                }}>
                    {/* {props.story_like === "ok" ? (
                        <Heart like={!like} onClick={toggleLike} />
                    ) : (
                        <Heart like={like} onClick={toggleLike} />
                    )} */}
                    <Heart like = {like} onPress = {toggleLike} />
                </View>
            <SafeAreaView style = {{ flexShrink: 1, width: width * 0.5, margin: 10 }}>
                <Text style = {textStyles.PlaceName}>{props.place_name}</Text>
                <Text style = {textStyles.Title}>{props.title}</Text>
                <Text style = {textStyles.category}>{props.category}</Text>
                <Text style = {textStyles.Preview}
                    numberOfLines = {3}
                    ellipsizeMode = {'tail'}>
                    {props.preview}</Text>
                <TouchableOpacity
                    onPress = {onPress}>
                    <Text style = {textStyles.More}>더보기</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaView>
    )
}

export default ItemCard;