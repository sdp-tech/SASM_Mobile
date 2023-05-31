import { View, TouchableOpacity, FlatList } from 'react-native';
import { TextPretendard as Text } from '../../../common/CustomText';
import { useNavigation } from '@react-navigation/native';

interface RecommendStory {
    id: number;
    title: string;
    created: string;
}

interface RecommendStoryParams {
    data: any;
    navigation?: any;
}

const StoryRecommend = ({ data, navigation }: RecommendStoryParams) => {

    return (
        <View>
            <FlatList
                data = {data}
                renderItem = {({item}) => {
                    return (
                        <TouchableOpacity
                            onPress = {() => {
                                navigation.replace('StoryDetail', { id: item.id })
                            }}>
                            <View style = {{ flexDirection: 'row', borderBottomColor: '#000000', borderBottomWidth: 1 }}>
                                <Text>{item.title}</Text>
                                <Text>{item.created.slice(0, 10)}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
            {/* {results.map((it, index) => (
                <TouchableOpacity
                    onPress = {(e) => {
                        navigation.replace('StoryDetail', { id: it.id })
                    }}>
                    <View style = {{ flexDirection: 'row', borderBottomColor: '#000000', borderBottomWidth: 1 }}>
                        <Text>{it.title}</Text>
                        <Text>{it.created.slice(0, 10)}</Text>
                    </View>
                </TouchableOpacity>
            ))} */}
        </View>
    )
}

export default StoryRecommend;