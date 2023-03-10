import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loading from '../../../common/Loading';
import { Request } from '../../../common/requests';
import { useNavigation } from '@react-navigation/native';
import Heart from '../../../common/Heart';
import RenderHTML from 'react-native-render-html';

const StoryDetailBox = (props) => {
    const width = Dimensions.get('screen');
    const id = props.id;
    const [data, setData] = useState([]);
    const [comment, setComment] = useState([]);
    const [recommend, setRecommend] = useState([]);
    const [like, setLike] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const request = new Request();

    // 좋아요 클릭 이벤트
    const toggleLike = async () => {
        if (!token) {
        alert("로그인이 필요합니다.");
        } else {
        const response = await request.post("/stories/story_like/", { id: data.id }, null);
        console.log("response", response);

        //색상 채우기
        setLike(!like);
        }
    };

    const handlePageGoToMap = (place_name) => {
        //window.location.href = `/map/${place_name}`
    }

    const markup = {
        html: `${data.html_content}`
    }

    const renderersProps = {
        img: {
          enableExperimentalPercentWidth: true
        }
      };
    
    const loadItem = async () => {
        setLoading(true);
        const response_detail = await request.get("/stories/story_detail/", { id: id }, null);
        const response_comment = await request.get("/stories/comments/", { story: id }, null);
        const recommend_story = await request.get("/stories/recommend_story/", { id: id }, null);
        // console.log("data", response.data);.
        setData(response_detail.data.data[0]);
        setComment(response_comment.data.data);
        setRecommend(recommend_story.data.data);
        setLoading(false);
    };

    useEffect(() => {
        loadItem();
        console.log('markup', markup)
    }, []);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <ScrollView style = {{ margin: 25 }}>
                    <TouchableOpacity style = {{
                        alignItems: 'flex-end',
                    }}
                        onPress = {() => {
                            navigation.goBack();
                        }}>
                        <Text>Back</Text>
                    </TouchableOpacity>
                    <View style = {{ flexDirection: 'row' }}>
                        <Text>{data.category}</Text>
                        <Text style = {{ marginHorizontal: 10}}>|</Text>
                        <Text>{data.semi_category}</Text>
                    </View>
                    <View style = {{ flexDirection: 'row' }}>
                        <Text>{data.place_name}</Text>
                        {props.story_like === "ok" ? (
                            <Heart like={!like} onClick={toggleLike} />
                        ) : (
                            <Heart like={like} onClick={toggleLike} />
                        )}
                    </View>
                    <Text>{data.tag}</Text>
                    <Text>{data.story_review}</Text>
                    <RenderHTML
                        contentWidth = {width}
                        source = {markup}
                        renderersProps = {renderersProps} />
                    <TouchableOpacity 
                        onPress = {handlePageGoToMap}
                        style = {{
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            backgroundColor: '#3AE89480',
                            width: 129,
                            height: 33,
                            borderRadius: 24,
                            shadowRadius: 3.25,
                            shadowOpacity: 25,
                            shadowColor: 'rgba(0, 0, 0, 0.25)',
                            shadowOffset: {
                                width: 0,
                                height: 3.25,
                                top: 3.25,
                                bottom: 0
                            }
                        }}>
                        <Text>Map에서 보기</Text>
                    </TouchableOpacity>
                    
                </ScrollView>
            )}
        </>
    )
}


export default StoryDetailBox;