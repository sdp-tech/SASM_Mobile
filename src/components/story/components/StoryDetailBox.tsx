import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, FlatList, Image, Share, Alert, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loading from '../../../common/Loading';
import { Request } from '../../../common/requests';
import Heart from '../../../common/Heart';
import RenderHTML from 'react-native-render-html';
import Comment from './Comment';
import WriteComment from './WriteComment';
import StoryRecommend from './StoryRecommend';
import Place from '../../../assets/img/Story/Place.svg';
import Arrow from '../../../assets/img/common/Arrow.svg';
import CardView from '../../../common/CardView';
import ShareIcon from '../../../assets/img/Story/ShareIcon.svg';
import CommentIcon from '../../../assets/img/Story/Comment.svg';

interface StoryDetailProps {
    id: number;
    navigation: any;
}

export interface StoryDetail {
    id: number;
    title: string;
    created: string;
    profile: string;
    rep_pic: string;
    extra_pics: string[];
    story_review: string;
    tag: string;
    story_like: boolean;
    category: string;
    semi_category: string;
    place_name: string;
    views: number;
    html_content: string;
    writer: string;
    nickname: string;
    map_image: string;
    writer_is_verified: string;
}

interface RecommendStory {
    count: number;
    results: Array<object>;
}

const StoryDetailBox = ({navigation, id}: StoryDetailProps) => {
    const { width, height } = Dimensions.get('screen');
    const [data, setData] = useState<StoryDetail>();
    const [comment, setComment] = useState([] as any);
    //const [recommend, setRecommend] = useState<RecommendStory>();
    const [like, setLike] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const request = new Request();

    const checkUser = async () => {
        const response = await request.get(`/users/me/`,{},{});
        setEmail(response.data.data.email);
        console.log('email', email);
    }

    const toggleLike = async () => {
        const response = await request.post('/stories/story_like/', { id: id });
        setLike(!like);
    };

    const handlePageGoToMap = async () => {
        const response = await request.get('/stories/go_to_map/', {id: id});
        console.log(response)
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
        //const recommend_story = await request.get("/stories/recommend_story/", { id: id }, null);
        setData(response_detail.data.data);
        setComment(response_comment.data.data.results);
        //setRecommend(recommend_story.data.data);
        setLoading(false);
        console.log(data);
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

    const onShare = async () => {
        try {
          const result = await Share.share({
            message:
              'React Native | A framework for building native apps using React',
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error: any) {
          Alert.alert(error.message);
        }
    };

    const deleteStory = async () => {
        const _delete = async () => {
            await request.delete(`/stories/${id}/delete/`, {});
            navigation.goBack();
        }
        Alert.alert(
            "게시글 삭제 확인",
            "정말로 삭제하시겠습니까?",
            [
                {
                    text: "삭제",
                    onPress: () => _delete(),

                },
                {
                    text: "취소",
                    onPress: () => { },
                    style: "cancel"
                },
            ],
            { cancelable: false }
        );
    }

    useEffect(() => {
        checkUser();
        loadItem();
        getStories();
    }, [refreshing]);

    const [item,setItem] = useState([])
    const getStories = async () => {
        const response = await request.get('/stories/story_search/', {
            page: 1,
            search: null,
            latest: true
        }, null);
        setItem(response.data.data.results);
    }

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <FlatList
                    data = {comment}
                    onRefresh = {onRefresh}
                    refreshing = {refreshing}
                    disableVirtualization = {false}
                    ListHeaderComponent={
                    <>
                        {data!.extra_pics.length > 0 ? (
                            <CardView 
                                gap={0}
                                offset={0}
                                data={data!.extra_pics}
                                pageWidth={width}
                                height={330}
                                dot={false}
                                renderItem={({item}: any) => (
                                    <ImageBackground
                                        style={{width: 280, height: 330, marginRight: 15}}
                                        source={{uri: item}}
                                        resizeMode='cover'
                                    />
                                )}
                            />
                        ) : (
                            <ImageBackground style={{width: width, height: 330}} source={{uri: data!.rep_pic}} />
                        )}
                        <Text style={[textStyles.category, {marginLeft: 20, marginTop: 20}]}>{data!.category}</Text>
                        <View style = {{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 20 }}>
                            <View style={{flex: 6, justifyContent: 'center'}}>
                                <Text style={textStyles.title}>{data!.title}</Text>
                                <Text style={textStyles.semi_title}>{data!.story_review}</Text>
                                <Text style={textStyles.date}>{data!.created.slice(0, 10)} 작성</Text>
                            </View>
                            <View style = {{flex: 1, alignSelf: 'center'}}>
                                <Image source={{uri: data!.profile}} style={{width: 50, height: 50, borderRadius: 60}} />
                                <View style={{position: 'absolute', width: 34, height: 12, backgroundColor: data!.writer_is_verified ? '#209DF5' : '#89C77F', borderRadius: 10, top: 42, left: 8.5}}>
                                    <Text style={textStyles.verified}>{data!.writer_is_verified ? 'Editor' : 'User'}</Text>
                                </View>
                                <Text style={textStyles.writer}>{data!.nickname}</Text>
                            </View>
                        </View>
                        <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1}} />
                        <TouchableOpacity style = {{flexDirection: 'row', margin: 20}} onPress = {handlePageGoToMap}>
                            <Place />
                            <Text style={[textStyles.semi_title, {marginLeft: 10}]}>{data!.place_name}</Text>
                        </TouchableOpacity>
                        <RenderHTML
                            contentWidth = {width}
                            source = {markup}
                            renderersProps = {renderersProps} 
                            />
                        <Image source={{uri: data!.map_image}} style={{width: width, height: 120}} />
                        <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1, marginTop: 40}} />
                        <View style={{flexDirection: 'row'}}>
                            <Text style={textStyles.subject}>한줄평</Text>
                            <View style={{marginTop: 15}}><CommentIcon /></View>
                        </View>
                        <WriteComment id = {id} reRenderScreen = {reRenderScreen}/>
                    </>}
                    renderItem = {({item}) => { 
                        return (
                            <Comment data = {item} reRenderScreen = {reRenderScreen} email={email}/>
                        )
                    }}
                    ListFooterComponent = {
                    <>
                        <TouchableOpacity style={{alignItems: 'flex-end', marginRight: 30, marginTop: 10}} onPress={() => {navigation.navigate('CommentList', { id: id, comment: comment, reRenderScreen: reRenderScreen })}}>
                            <Text>더보기{'>'}</Text>
                        </TouchableOpacity>
                        <View style={{borderBottomColor: '#D9D9D9', width: width, borderBottomWidth: 1, marginTop: 20}} />
                        <Text style={textStyles.subject}>스토리가 포함된 큐레이션</Text>
                        <CardView 
                            gap={10}
                            offset={12}
                            data={item}
                            pageWidth={width*0.6}
                            height={width*0.5}
                            dot={false}
                            renderItem={({item}: any) => (
                                <TouchableOpacity style={{marginHorizontal: 8}}>
                                    <ImageBackground
                                        style={{width: width*0.5, height: width*0.5}}
                                        source={{uri: item.rep_pic}}
                                        imageStyle={{borderRadius: 5}}
                                        resizeMode='cover'
                                    >
                                        <View style={{width: width*0.5, height: width*0.5, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'flex-end'}}>
                                        <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 10, marginLeft: 10, color: 'white'}}>서울 어쩌구 저쩌구{"\n"}비건 카페 5곳</Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                                
                            )}
                        />
                        <Text style={textStyles.subject}>이 장소의 다른 스토리</Text>
                        <CardView 
                            gap={10}
                            offset={12}
                            data={item}
                            pageWidth={width*0.6}
                            height={width*0.3}
                            dot={false}
                            renderItem={({item}: any) => (
                                <TouchableOpacity style={{marginHorizontal: 8}}>
                                    <ImageBackground
                                        style={{width: width*0.5, height: width*0.25}}
                                        source={{uri: item.rep_pic}}
                                        imageStyle={{borderRadius: 5}}
                                        resizeMode='cover'
                                    >
                                        <View style={{width: width*0.5, height: width*0.25, borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'flex-end'}}>
                                        <Text style={{fontSize: 15, fontWeight: '700', marginBottom: 10, marginLeft: 10, color: 'white'}}>서울 어쩌구 저쩌구{"\n"}비건 카페 5곳</Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                                
                            )}
                        />
                        { data!.writer == email ? (
                            <>
                            <TouchableOpacity onPress={deleteStory}>
                                <Text>삭제</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('WriteStory', { id: data!.id })}>
                                <Text>수정</Text>
                            </TouchableOpacity>
                            </>
                        ) : (
                            <></>
                        )}
                        {/* <Text>{data!.category} 카테고리의 다른 글을 확인하세요</Text>
                        {recommend!.count != 0 ? (
                            <StoryRecommend data={recommend!.results} navigation = {navigation} />
                        ) : (
                            <></>
                        )} */}
                    </>}
                />
                <TouchableOpacity style={{position: 'absolute', top: 70, left: 10}} onPress={() => {navigation.goBack()}}>
                    <Arrow width={20} height={20} transform={[{rotateY: '180deg'}]}/>
                </TouchableOpacity>
                <View style={{
                    position: 'absolute',
                    marginTop: height*0.8,
                    marginLeft: width*0.85
                }}>
                    <View style={buttonStyles.floating}>
                        {data!.story_like ? (
                            <Heart like={!like} onPress={toggleLike} white={true} />
                        ) : (
                            <Heart like={like} onPress={toggleLike} white={true} />
                        )}
                    </View>
                    <TouchableOpacity style={[buttonStyles.floating, { marginTop: 12 }]} onPress={onShare}>
                        <ShareIcon />
                    </TouchableOpacity>
                </View>
                </SafeAreaView>
            )}
        </>
    )
}

const textStyles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginVertical: 5
    },
    semi_title: {
        fontSize: 12,
        fontWeight: '400'
    },
    date: {
        fontSize: 10,
        fontWeight: '400',
        marginTop: 4,
        color: '#676767'
    },
    category: {
        fontSize: 12,
        fontWeight: '400',
        marginVertical: 10,
        alignSelf: 'flex-start', 
        borderRadius: 12, 
        paddingHorizontal: 16, 
        paddingVertical: 4, 
        overflow: 'hidden', 
        lineHeight: 14, 
        color: '#ADADAD', 
        borderColor: '#B1B1B1', 
        borderWidth: 1
    },
    verified: {
        fontSize: 8,
        fontWeight: '600',
        color: 'white', 
        alignSelf: 'center', 
        justifyContent: 'center'
    },
    writer: {
        fontSize: 8,
        fontWeight: '600',
        marginTop: 8,
        marginLeft: 15
    },
    subject: {
        fontSize: 14,
        fontWeight: '500',
        margin: 15
    }
})

const buttonStyles = StyleSheet.create({
    floating: {
        backgroundColor: '#75E59B', 
        width: 34, 
        height: 34, 
        borderRadius:60, 
        alignItems: 'center', 
        justifyContent: 'center'
    }
})

export default StoryDetailBox;