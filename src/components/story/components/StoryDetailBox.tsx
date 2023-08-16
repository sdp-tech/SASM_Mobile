import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Alert, ImageBackground, Platform } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { useState, useEffect } from 'react';
import { Request } from '../../../common/requests';
import styled from 'styled-components/native';
import RenderHTML from 'react-native-render-html';
import Place from '../../../assets/img/Story/Place.svg';
import ArrowWhite from '../../../assets/img/common/ArrowWhite.svg';
import CardView from '../../../common/CardView';
import { CATEGORY_LIST, MatchCategory } from "../../../common/Category";
import Selector0 from "../../../assets/img/Category/Selector0.svg";
import Selector1 from "../../../assets/img/Category/Selector1.svg";
import Selector2 from "../../../assets/img/Category/Selector2.svg";
import Selector3 from "../../../assets/img/Category/Selector3.svg";
import Selector4 from "../../../assets/img/Category/Selector4.svg";
import Selector5 from "../../../assets/img/Category/Selector5.svg";
import Settings from '../../../assets/img/MyPage/Settings.svg';
import Logo from "../../../assets/img/common/Logo.svg"

interface StoryDetailProps {
    data: any;
    navigation: any;
    isLogin: boolean;
    onLayout: any;
    email: string;
    onRefresh: () => void;
    onReport: () => void;
    onUpdate: () => void;
    onDelete: () => void;
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
    preview: string;
}

const CategoryWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 28px;
  border-radius: 12px;
  padding-horizontal: 10px;
  background-color: '#FFFFFF';
  border-color: 'rgba(203, 203, 203, 1)';
  border-width: 1;
`

const StoryDetailBox = ({navigation, data, isLogin, onLayout, email, onRefresh, onReport, onUpdate, onDelete}: StoryDetailProps) => {
    const { width, height } = Dimensions.get('screen');
    const [follow, setFollow] = useState<boolean>(data.writer_is_followed);
    const [dot, setDot] = useState<boolean>(false);
    const user = Boolean(data.writer === email)
    const request = new Request();

    const onFollow = async () => {
        if (isLogin) {
          const response = await request.post('/mypage/follow/', {
            targetEmail: data.writer
          }, {});
          console.log(response.data)
          if(response.data.status==='success'){
            setFollow(response.data.data.follows);
            onRefresh();
          }
          else{
            Alert.alert(
                `${response.data.message}`
            )
          }
        } else {
          Alert.alert(
            "로그인이 필요합니다.",
            "로그인 항목으로 이동하시겠습니까?",
            [
                {
                    text: "이동",
                    onPress: () => navigation.navigate('Login')
    
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
    }

    const chunkArray = () => {
        const array = [data.rep_pic, ...data.extra_pics]
        return array.slice(0,3);
    }

    const handlePageGoToMap = async () => {
        const response = await request.get('/stories/go_to_map/', {id: data.id});
        console.log(response)
        navigation.navigate('맵', {coor: {latitude: response.data.data.latitude, longitude: response.data.data.longitude}});
    }

    const markup = {
        html: `${data?.html_content}`
    }

    const renderersProps = {
        img: {
          enableExperimentalPercentWidth: false,
          initialDimensions: {
            width: width,
            height: 400
          }
        }
    };

    const tagsStyles = {
        span: {
          fontSize: 16,
          lineHeight: 30,
          letterSpacing: -0.6
        },
        h6: {
            fontSize: 12,
            lineHeight: 30,
            letterSpacing: -0.6
        }
    }

    const category = () => {
        let idx = MatchCategory(data.category);
        let list = [
        <Selector0 color={CATEGORY_LIST[0].color}/>,
        <Selector1 color={CATEGORY_LIST[1].color}/>,
        <Selector2 color={CATEGORY_LIST[2].color}/>,
        <Selector3 color={CATEGORY_LIST[3].color}/>,
        <Selector4 color={CATEGORY_LIST[4].color}/>,
        <Selector5 color={CATEGORY_LIST[5].color}/>
        ]
        return (
            <CategoryWrapper>
                {list[idx]}
                <Text style={{ fontSize: 14, marginHorizontal: 5 }}>{data.category}</Text>
            </CategoryWrapper>
        )
    }

    return (
        <View onLayout={onLayout}>
            <View>
                <TouchableOpacity style={{position: 'absolute', zIndex: 1, top: Platform.OS === 'ios' ? 50:20, left: 10}} onPress={() => {navigation.goBack()}}>
                    <ArrowWhite width={18} height={18} strokeWidth={5} />
                </TouchableOpacity>
                    {data!.extra_pics.length > 0 ? (
                        <CardView 
                            gap={0}
                            offset={0}
                            data={chunkArray()}
                            pageWidth={width}
                            dot={false}
                            renderItem={({item}: any) => (
                                <ImageBackground
                                    style={{width: 280, height: 330, marginRight: 15}}
                                    source={{uri: item}}
                                    resizeMode='cover'
                                >
                                    <View style={{backgroundColor: 'rgba(0,0,0,0.2)', width: 280, height: 330}} />
                                </ImageBackground>
                            )}
                        />
                    ) : (
                        <ImageBackground style={{width: width, height: 330}} source={{uri: data!.rep_pic}}>
                            <View style={{backgroundColor: 'rgba(0,0,0,0.2)', width: width, height: 330}} />
                        </ImageBackground>
                    )}
                <TouchableOpacity style={{position: 'absolute', zIndex: 1, top: Platform.OS === 'ios' ? 55:25, right: 20}} onPress={() => setDot(!dot)}>
                    <Settings transform={[{ rotate: dot ? '90deg' : '0deg'}]} color={'white'} />
                </TouchableOpacity>
                { dot &&
                <View style={{position: 'absolute', backgroundColor: 'white', top: Platform.OS === 'ios' ? 75: 50, left: width-140, borderRadius: 4}}>
                    <TouchableOpacity style={{borderColor: 'rgba(168, 168, 168, 0.20)', borderBottomWidth: 1, paddingHorizontal: 40, paddingVertical: 10}} onPress={onUpdate} disabled={!user}>
                        <Text style={{fontSize: 14, lineHeight: 20, letterSpacing: -0.6, opacity: user ? 1 : 0.4}}>수정하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{borderColor: 'rgba(168, 168, 168, 0.20)', borderBottomWidth: 1, paddingHorizontal: 40, paddingVertical: 10}} onPress={onDelete} disabled={!user}>
                        <Text style={{fontSize: 14, lineHeight: 20, letterSpacing: -0.6, opacity: user ? 1 : 0.4}}>삭제하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{paddingHorizontal: 40, paddingVertical: 10}} onPress={onReport} disabled={user}>
                        <Text style={{fontSize: 14, lineHeight: 20, letterSpacing: -0.6, opacity: !user ? 1 : 0.4}}>신고하기</Text>
                    </TouchableOpacity>
                </View>}
            </View>
            <View style={{borderBottomColor: '#D9D9D9', borderBottomWidth: 1, padding: 15}}>
                <View style={{flexDirection: 'row'}}>
                    {category()}
                    <View style={{flex: 1}} />
                </View>
                    <View style = {{ flexDirection: 'row' }}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={textStyles.title}>{data!.title}</Text>
                            <Text style={textStyles.placename}>{data!.place_name}</Text>
                            <Text style={textStyles.date}>작성: {data!.created.slice(0, 10)}</Text>
                        </View>
                        <View style = {{alignItems: 'center'}}>
                            <Image source={{uri: data!.profile}} style={{width: 50, height: 50, borderRadius: 60, marginVertical: 5}} />
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[textStyles.writer, {color: data!.writer_is_verified ? '#209DF5' : '#67D393'}]}>{data!.writer_is_verified ? 'Editor' : 'User'}</Text>
                                <Text style={textStyles.writer}> {data!.nickname}</Text>
                            </View>
                            <TouchableOpacity style={{ width: 75, borderColor: '#67D393', borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 15, marginTop: 10 }} onPress={onFollow}>
                                <Text style={{ color: '#202020', fontSize: 12 }}>{follow ? '팔로잉' : '+ 팔로우'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </View>
            <View style={{padding: 15}}>
                <TouchableOpacity style = {{flexDirection: 'row', marginBottom: 10, alignItems: 'center'}} onPress = {handlePageGoToMap}>
                    <Place />
                    <Text style={textStyles.gotomap}>{data!.place_name}</Text>
                </TouchableOpacity>
                <View style={{alignItems: 'center', paddingVertical: 50}}>
                    <Logo />
                    <Text style={textStyles.review}>{data!.story_review}</Text>
                </View>
                <RenderHTML
                    contentWidth = {width}
                    source = {markup}
                    renderersProps = {renderersProps}
                    tagsStyles = {tagsStyles}
                />
            </View>
            <TouchableOpacity onPress = {handlePageGoToMap}>
                <Image source={{uri: data!.map_image}} style={{width: width, height: 120}} />
            </TouchableOpacity>
        </View>
    )
}

const textStyles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
        letterSpacing: -0.6
    },
    placename: {
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 28,
        letterSpacing: -0.6,
    },
    gotomap: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: -0.6,
        marginLeft: 5
    },
    date: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 18,
        letterSpacing: -0.6,
        color: '#676767'
    },
    writer: {
        fontSize: 12,
        fontWeight: '600',
    },
    review: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: -0.6,
        textAlign: 'center',
        marginTop: 10
    }
})

export default StoryDetailBox;