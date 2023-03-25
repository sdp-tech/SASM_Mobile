import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, FlatList } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Loading from '../../../common/Loading';
import { Request } from '../../../common/requests';
import { useNavigation } from '@react-navigation/native';
import Heart from '../../../common/Heart';
import RenderHTML from 'react-native-render-html';
import Comment from './Comment';
import WriteComment from './WriteComment';
import StoryRecommend from './StoryRecommend';
import { TabProps } from '../../../../App';

interface StoryDetailProps {
    id: number;
    navigation: any;
}

interface StoryDetail {
    id: number;
    title: string;
    story_review: string;
    tag: string;
    story_like: boolean;
    category: string;
    semi_category: string;
    place_name: string;
    views: number;
    html_content: string;
}

interface RecommendStory {
    count: number;
    results: Array<object>;
}

const StoryDetailBox = ({navigation, id}: StoryDetailProps) => {
    const width = Number(Dimensions.get('screen'));
    const [data, setData] = useState<StoryDetail>();
    const [comment, setComment] = useState([] as any);
    const [recommend, setRecommend] = useState<RecommendStory>();
    const [like, setLike] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    //const navigation = useNavigation();
    const request = new Request();

    const toggleLike = async () => {
        const response = await request.post('/stories/story_like/', { id: id }, null);
        setLike(!like);
        //reRenderScreen();
    };

    const handlePageGoToMap = async () => {
        const response = await request.get('/stories/go_to_map/', {id: id});
        navigation.navigate('맵', {id: response.data.data.id});
    }

    const markup = {
        html: `${data?.html_content}`
    }

    const renderersProps = {
        img: {
          enableExperimentalPercentWidth: true
        }
    };
    
    const loadItem = async () => {
        setLoading(true);
        const response_detail = await request.get(`/stories/story_detail/${id}/`);
        const response_comment = await request.get("/stories/comments/", { story: id }, null);
        const recommend_story = await request.get("/stories/recommend_story/", { id: id }, null);
        setData(response_detail.data.data);
        setComment(response_comment.data.data.results);
        console.log(response_comment.data.data.results)
        setRecommend(recommend_story.data.data);
        setLoading(false);
    };

    const reRenderScreen = () => {
        setRefreshing(true);
        setRefreshing(false);
    }

    const onRefresh = async () => {
        if(!refreshing){
            setRefreshing(true);
            await loadItem();
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadItem();
    }, [refreshing]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <SafeAreaView style = {{ margin: 25 }}>
                <FlatList
                    data = {comment}
                    onRefresh = {onRefresh}
                    refreshing = {refreshing}
                    disableVirtualization = {false}
                    ListHeaderComponent={
                    <>
                        <TouchableOpacity style = {{
                            alignItems: 'flex-end',
                        }}
                            onPress = {() => {
                                navigation.goBack();
                            }}>
                            <Text>Back</Text>
                        </TouchableOpacity>
                        <View style = {{ flexDirection: 'row' }}>
                            <Text>{data!.category}</Text>
                            <Text style = {{ marginHorizontal: 10}}>|</Text>
                            <Text>{data!.semi_category}</Text>
                        </View>
                        <View style = {{ flexDirection: 'row' }}>
                            <Text>{data!.place_name}</Text>
                            {data!.story_like === true ? (
                                <Heart like={!like} onPress={toggleLike} />
                            ) : (
                                <Heart like={like} onPress={toggleLike} />
                            )}
                        </View>
                        <Text>{data!.tag}</Text>
                        <Text>{data!.story_review}</Text>
                        <RenderHTML
                            contentWidth = {width}
                            source = {markup}
                            // renderersProps = {renderersProps} 
                            />
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
                                }
                            }}>
                            <Text>Map에서 보기</Text>
                        </TouchableOpacity>
                    </>}
                    renderItem = {({item}) => { 
                        return (
                            <Comment data = {item} reRenderScreen = {reRenderScreen}/>
                        )
                    }}
                    ListFooterComponent = {
                    <>
                        <WriteComment id = {id} reRenderScreen = {reRenderScreen}/>
                        <Text>{data!.category} 카테고리의 다른 글을 확인하세요</Text>
                        {recommend!.count != 0 ? (
                            <StoryRecommend data={recommend!.results} navigation = {navigation} />
                        ) : (
                            <></>
                        )}
                    </>}
                />
                </SafeAreaView>
            )}
        </>
    )
}

export default StoryDetailBox;