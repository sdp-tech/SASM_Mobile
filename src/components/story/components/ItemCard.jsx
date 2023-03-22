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
    },
    More: {
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 14,
        color: '#01A0FC'
    }
});

const ItemCard = (props) => {

    const [like, setLike] = useState(false);
    const [loading, setLoading] = useState(true);
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
        setLike(!like);
    };

    const onPress = () => {
        navigation.navigate('StoryDetail', { id: props.id });
    }

    return (
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
                    {props.story_like === true ? (
                        <Heart like={!like} onPress={toggleLike} />
                    ) : (
                        <Heart like={like} onPress={toggleLike} />
                    )}
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