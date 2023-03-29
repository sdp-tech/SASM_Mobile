import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components';
import { Request } from '../../../common/requests';
import Loading from '../../../common/Loading';
import Heart from '../../../common/Heart';
import { useNavigation } from '@react-navigation/native';

interface ItemCardProps {
    id: number;
    place_name: string;
    rep_pic: string;
    story_like: boolean;
    category: string;
    title: string;
    preview: string;
    navigation: any;
}

const { width, height, fontScale } = Dimensions.get('screen');

const textStyles = StyleSheet.create({
    PlaceName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
        lineHeight: 24,
    } ,
    Title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 19,
        marginBottom: 6,
    },
    Category: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 14,
        marginBottom: 7
    },
    Preview: {
        fontSize: 10,
        fontWeight: '500',
        lineHeight: 12,
        marginBottom: 8
    },
    More: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 14,
        color: '#01A0FC'
    }
});

const ItemCard = ({id, place_name, title, rep_pic, category, story_like, preview, navigation} : ItemCardProps) => {

    const [like, setLike] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const request = new Request();

    const toggleLike = async () => {
        const response = await request.post('/stories/story_like/', { id: id }, null);
        console.log(response.data.data.story_like)
        setLike(!like);
    };

    const onPress = () => {
        navigation.navigate('StoryDetail', { id: id });
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
                source = {{uri: rep_pic}}
                resizeMode = 'cover' />
                <View style = {{
                    position: 'absolute',
                    marginTop: 110,
                    marginLeft: 20,
                }}>
                    {story_like === true ? (
                        <Heart like={!like} onPress={toggleLike} />
                    ) : (
                        <Heart like={like} onPress={toggleLike} />
                    )}
                </View>
            <SafeAreaView style = {{ flexShrink: 1, width: width * 0.5, margin: 10 }}>
                <Text style = {textStyles.PlaceName}>{place_name}</Text>
                <Text style = {textStyles.Title}>{title}</Text>
                <Text style = {textStyles.Category}>{category}</Text>
                <Text style = {textStyles.Preview}
                    numberOfLines = {3}
                    ellipsizeMode = {'tail'}>
                    {preview}</Text>
                <TouchableOpacity
                    onPress = {onPress}>
                    <Text style = {textStyles.More}>더보기</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaView>
    )
}

export default ItemCard;